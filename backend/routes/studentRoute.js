const { Router } = require("express");
const User = require("../models/User");
const Assignment = require("../models/Assignment");
const multer = require("multer");
const path = require("path");
const auth = require("../middlewares/authMiddleware");
const { uploadToCloudinary, deleteFromCloudinary, getCloudinaryUrl, getDownloadUrl } = require("../utils/cloudinaryService");
const axios = require('axios');

const studentRoutes = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== ".pdf") {
            return cb(new Error("Only PDF allowed"));
        }
        cb(null, true);
    }
}).single("assignmentFile");

const uploadMultiple = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (path.extname(file.originalname).toLowerCase() !== ".pdf") {
            return cb(new Error("Only PDF allowed"));
        }
        cb(null, true);
    }
}).array("files", 10);

studentRoutes.get("/dashboard", auth.authMiddleware, auth.checkStudent, async (req, res) => {
    try {
        const email = req.session.user.email;

        const counts = await Assignment.aggregate([
            { $match: { studentEmail: email } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        let draftCount = 0, pendingCount = 0, submittedCount = 0, rejected = 0;

        counts.forEach(item => {
            if (item._id === "Draft") draftCount = item.count;
            if (item._id === "PendingProfessor" || item._id === "ProfessorApproved") pendingCount += item.count;
            if (item._id === "Submitted") submittedCount = item.count;
            if (item._id === "Rejected") rejected = item.count;
        });

        const recentAssignments = await Assignment.find({ studentEmail: email })
            .sort({ uploadedAt: -1 })
            .limit(5)
            .select("-fileData");

        res.json({
            email,
            draftCount,
            pendingCount,
            submittedCount,
            rejected,
            recentAssignments
        });

    } catch (err) {
        console.log("Dashboard error:", err);
        res.status(500).json({ message: "Error loading dashboard" });
    }
});

studentRoutes.get("/assignments", auth.authMiddleware, auth.checkStudent, async (req, res) => {
    try {
        const email = req.session.user.email;
        const assignments = await Assignment.find({ studentEmail: email })
            .sort({ uploadedAt: -1 })
            .select("-fileData");

        res.json({ assignments });
    } catch (error) {
        console.log("Error fetching assignments:", error);
        res.status(500).json({ message: "Error fetching assignments" });
    }
});

studentRoutes.post("/upload", auth.authMiddleware, auth.checkStudent, (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        try {
            const { title, description, category } = req.body;
            if (!title || !description || !category) {
                return res.status(400).json({ message: "All fields required" });
            }
            if (!req.file) {
                return res.status(400).json({ message: "PDF file required" });
            }

            const cloudResult = await uploadToCloudinary(
                req.file.buffer,
                "assignments",
                "raw"
            );

            const newAssignment = new Assignment({
                studentEmail: req.session.user.email,
                title,
                description,
                category,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                cloudinaryPublicId: cloudResult.publicId,
                cloudinaryUrl: cloudResult.secureUrl,
                cloudinaryFormat: cloudResult.format,
                cloudinaryResourceType: cloudResult.resourceType || "raw",
                status: "Draft",
                uploadedAt: new Date()
            });

            await newAssignment.save();
            res.status(201).json({ message: "Assignment uploaded successfully" });
        } catch (error) {
            console.error("Upload error:", error);
            res.status(500).json({ message: "Error saving assignment" });
        }
    });
});

studentRoutes.post("/bulk-upload", auth.authMiddleware, auth.checkStudent, (req, res) => {
    uploadMultiple(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: "At least one PDF file required" });
            }

            const category = req.body.category || "Other";

            const assignments = await Promise.all(req.files.map(async file => {
                const cloudResult = await uploadToCloudinary(
                    file.buffer,
                    "assignments",
                    "raw"
                );
                return {
                    studentEmail: req.session.user.email,
                    title: path.basename(file.originalname, ".pdf"),
                    description: "Bulk uploaded assignment",
                    category: category,
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    cloudinaryPublicId: cloudResult.publicId,
                    cloudinaryUrl: cloudResult.secureUrl,
                    cloudinaryFormat: cloudResult.format,
                    cloudinaryResourceType: cloudResult.resourceType || "raw",
                    status: "Draft",
                    uploadedAt: new Date()
                };
            }));

            await Assignment.insertMany(assignments);
            res.status(201).json({ message: `${assignments.length} assignments uploaded successfully` });
        } catch (error) {
            console.error("Bulk upload error:", error);
            res.status(500).json({ message: "Error uploading assignments" });
        }
    });
});

studentRoutes.post("/submit/:id", auth.authMiddleware, auth.checkStudent, async (req, res) => {
    try {
        const assignment = await Assignment.findOne({
            _id: req.params.id,
            studentEmail: req.session.user.email
        });

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        if (assignment.status !== "Draft" && assignment.status !== "Rejected") {
            return res.status(400).json({ message: "Only draft or rejected assignments can be submitted" });
        }

        // Get student's department
        const student = await User.findOne({ email: req.session.user.email });
        if (!student || !student.department) {
            return res.status(400).json({ message: "Student department not found" });
        }

        // Find a professor from the same department
        const professor = await User.findOne({
            role: "professor",
            department: student.department
        });

        if (!professor) {
            return res.status(400).json({ message: "No professor available in your department" });
        }

        assignment.status = "PendingProfessor";
        assignment.currentLevel = "professor";
        assignment.submittedAt = new Date();
        assignment.isEditable = false;
        assignment.currentReviewer = professor._id;
        assignment.studentId = student._id;
        assignment.department = student.department;

        // Clear previous review data if resubmitting
        assignment.professorReviewedAt = null;
        assignment.professorRemarks = "";
        assignment.professorReviewedBy = null;
        assignment.hodReviewedAt = null;
        assignment.hodRemarks = "";
        assignment.hodReviewedBy = null;
        assignment.reviewComments = "";
        assignment.rejectedBy = "";
        await assignment.save();

        res.json({
            message: "Assignment sent to professor for review",
            assignedTo: professor.name,
            currentLevel: "professor"
        });
    } catch (error) {
        console.error("Submit error:", error);
        res.status(500).json({ message: "Error submitting assignment" });
    }
});

studentRoutes.put("/assignments/:id", auth.authMiddleware, auth.checkStudent, (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        try {
            const assignment = await Assignment.findOne({
                _id: req.params.id,
                studentEmail: req.session.user.email
            });

            if (!assignment) {
                return res.status(404).json({ message: "Assignment not found" });
            }

            if (!assignment.isEditable && assignment.status !== "Rejected") {
                return res.status(400).json({ message: "This assignment cannot be edited" });
            }

            const { title, description, category } = req.body;

            // Update fields if provided
            if (title) assignment.title = title;
            if (description) assignment.description = description;
            if (category) assignment.category = category;

            if (req.file) {
                if (assignment.cloudinaryPublicId) {
                    try {
                        await deleteFromCloudinary(assignment.cloudinaryPublicId);
                    } catch (deleteErr) {
                        console.error("Error deleting old file:", deleteErr);
                    }
                }

                const cloudResult = await uploadToCloudinary(
                    req.file.buffer,
                    "assignments"
                );

                assignment.originalName = req.file.originalname;
                assignment.mimeType = req.file.mimetype;
                assignment.cloudinaryPublicId = cloudResult.publicId;
                assignment.cloudinaryUrl = cloudResult.secureUrl;
                assignment.cloudinaryFormat = cloudResult.format;
                assignment.s3Url = undefined;
                assignment.fileData = null;
            }

            if (assignment.status === "Rejected") {
                assignment.status = "Draft";
                assignment.isEditable = true;
            }

            assignment.updatedAt = new Date();
            await assignment.save();

            res.json({ message: "Assignment updated successfully" });
        } catch (error) {
            console.error("Update error:", error);
            res.status(500).json({ message: "Error updating assignment" });
        }
    });
});

studentRoutes.get("/assignments/:id", auth.authMiddleware, auth.checkStudent, async (req, res) => {
    try {
        const assignment = await Assignment.findOne({
            _id: req.params.id,
            studentEmail: req.session.user.email
        })
            .populate("currentReviewer", "name email")
            .select("-fileData");

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        res.json({ assignment });
    } catch (error) {
        console.error("Error fetching assignment:", error);
        res.status(500).json({ message: "Error fetching assignment" });
    }
});

studentRoutes.delete("/assignments/:id", auth.authMiddleware, auth.checkStudent, async (req, res) => {
    try {
        const assignment = await Assignment.findOne({
            _id: req.params.id,
            studentEmail: req.session.user.email,
            status: "Draft"
        });

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found or cannot be deleted" });
        }

        if (assignment.cloudinaryPublicId) {
            try {
                await deleteFromCloudinary(assignment.cloudinaryPublicId);
            } catch (cloudErr) {
                console.error("Error deleting from Cloudinary:", cloudErr);
            }
        }

        await Assignment.findByIdAndDelete(req.params.id);
        res.json({ message: "Assignment deleted successfully" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Error deleting assignment" });
    }
});

studentRoutes.get("/assignments/:id/download", auth.authMiddleware, auth.checkStudent, async (req, res) => {
    try {
        const assignment = await Assignment.findOne({
            _id: req.params.id,
            studentEmail: req.session.user.email
        });

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        if (assignment.cloudinaryUrl) {
            return res.json({
                downloadUrl: assignment.cloudinaryUrl,
                fileName: assignment.originalName || 'assignment.pdf'
            });
        }

        if (assignment.fileData) {
            res.set({
                "Content-Type": assignment.mimeType || "application/pdf",
                "Content-Disposition": `attachment; filename="${assignment.originalName || 'assignment.pdf'}"`,
            });
            return res.send(assignment.fileData);
        }

        return res.status(404).json({ message: "File not found" });
    } catch (error) {
        console.error("Error downloading file:", error);
        res.status(500).json({ message: "Error downloading file" });
    }
});

module.exports = studentRoutes;