const { Router } = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const Assignment = require("../models/Assignment");
const auth = require("../middlewares/authMiddleware");
const { getCloudinaryUrl, getDownloadUrl } = require("../utils/cloudinaryService");
const axios = require('axios');

const professorRoutes = Router();

professorRoutes.get("/dashboard", auth.authMiddleware, auth.isProfessor, async (req, res) => {
    try {
        const professorId = new mongoose.Types.ObjectId(req.session.user.id);

        const pendingCount = await Assignment.countDocuments({
            currentReviewer: professorId,
            status: "PendingProfessor"
        });

        const reviewedCounts = await Assignment.aggregate([
            { $match: { professorReviewedBy: professorId } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        let approvedCount = 0, rejectedCount = 0;
        reviewedCounts.forEach(item => {
            if (item._id === "ProfessorApproved" || item._id === "Submitted") approvedCount += item.count;
            if (item._id === "Rejected") rejectedCount = item.count;
        });

        const recentAssignments = await Assignment.find({
            currentReviewer: professorId,
            status: "PendingProfessor"
        })
            .sort({ submittedAt: -1 })
            .limit(5)
            .select("-fileData");

        res.json({
            professorId,
            email: req.session.user.email,
            pendingCount,
            approvedCount,
            rejectedCount,
            totalReviewed: approvedCount + rejectedCount,
            recentAssignments
        });

    } catch (err) {
        console.error("Dashboard error:", err);
        res.status(500).json({ message: "Error loading dashboard" });
    }
});

professorRoutes.get("/assignments/pending", auth.authMiddleware, auth.isProfessor, async (req, res) => {
    try {
        const professorId = new mongoose.Types.ObjectId(req.session.user.id);

        const assignments = await Assignment.find({
            currentReviewer: professorId,
            status: "PendingProfessor"
        })
            .sort({ submittedAt: -1 })
            .select("-fileData");

        res.json({ assignments });
    } catch (error) {
        console.error("Error fetching assignments:", error);
        res.status(500).json({ message: "Error fetching assignments" });
    }
});

professorRoutes.get("/assignments/reviewed", auth.authMiddleware, auth.isProfessor, async (req, res) => {
    try {
        const professorId = new mongoose.Types.ObjectId(req.session.user.id);

        const assignments = await Assignment.find({
            professorReviewedBy: professorId,
            status: { $in: ["ProfessorApproved", "Submitted", "Rejected"] }
        })
            .sort({ submittedAt: -1 })
            .select("-fileData");

        res.json({ assignments });
    } catch (error) {
        console.error("Error fetching assignments:", error);
        res.status(500).json({ message: "Error fetching assignments" });
    }
});

professorRoutes.get("/assignments", auth.authMiddleware, auth.isProfessor, async (req, res) => {
    try {
        const professorId = new mongoose.Types.ObjectId(req.session.user.id);
        const { status, page = 1, limit = 10 } = req.query;

        let query;
        if (status) {
            if (status === "PendingProfessor") {
                query = { currentReviewer: professorId, status: "PendingProfessor" };
            } else {
                query = { professorReviewedBy: professorId, status: status };
            }
        } else {
            query = {
                $or: [
                    { currentReviewer: professorId, status: "PendingProfessor" },
                    { professorReviewedBy: professorId }
                ]
            };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const assignments = await Assignment.find(query)
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select("-fileData");

        const total = await Assignment.countDocuments(query);

        res.json({
            assignments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalAssignments: total
            }
        });
    } catch (error) {
        console.error("Error fetching assignments:", error);
        res.status(500).json({ message: "Error fetching assignments" });
    }
});

professorRoutes.get("/assignments/:id", auth.authMiddleware, auth.isProfessor, async (req, res) => {
    try {
        const professorId = new mongoose.Types.ObjectId(req.session.user.id);

        const assignment = await Assignment.findOne({
            _id: req.params.id,
            $or: [
                { currentReviewer: professorId },
                { professorReviewedBy: professorId }
            ]
        }).select("-fileData");

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found or not assigned to you" });
        }

        res.json({ assignment });
    } catch (error) {
        console.error("Error fetching assignment:", error);
        res.status(500).json({ message: "Error fetching assignment" });
    }
});

professorRoutes.get("/assignments/:id/download", auth.authMiddleware, auth.isProfessor, async (req, res) => {
    try {
        const professorId = new mongoose.Types.ObjectId(req.session.user.id);

        const assignment = await Assignment.findOne({
            _id: req.params.id,
            $or: [
                { currentReviewer: professorId },
                { professorReviewedBy: professorId }
            ]
        });

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        console.log("Download request - cloudinaryUrl:", assignment.cloudinaryUrl);

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

professorRoutes.post("/assignments/:id/approve", auth.authMiddleware, async (req, res) => {

    if (!req.session.user || req.session.user.role !== "professor") {
        return res.status(403).json({ message: "Access Denied: Professor only" });
    }

    try {
        const professorId = new mongoose.Types.ObjectId(req.session.user.id);
        const { remarks } = req.body;

        const assignment = await Assignment.findOne({
            _id: req.params.id,
            currentReviewer: professorId,
            status: "PendingProfessor",
            currentLevel: "professor"
        });

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found or already reviewed" });
        }

        const professor = await User.findById(professorId);
        const hod = await User.findOne({
            role: "hod",
            department: professor.department
        });

        if (!hod) {
            return res.status(400).json({ message: "No HOD found for this department" });
        }

        assignment.status = "ProfessorApproved";
        assignment.currentLevel = "hod";
        assignment.currentReviewer = hod._id;
        assignment.professorReviewedAt = new Date();
        assignment.professorRemarks = remarks || "";
        assignment.professorReviewedBy = professorId;
        await assignment.save();

        res.json({
            message: "Assignment approved and forwarded to HOD",
            forwardedTo: hod.name
        });
    } catch (error) {
        console.error("Error approving assignment:", error);
        res.status(500).json({ message: "Error approving assignment" });
    }
});

professorRoutes.post("/assignments/:id/reject", auth.authMiddleware, auth.isProfessor, async (req, res) => {
    try {
        const professorId = new mongoose.Types.ObjectId(req.session.user.id);
        const { remarks } = req.body;

        if (!remarks) {
            return res.status(400).json({ message: "Rejection remarks are required" });
        }

        const assignment = await Assignment.findOne({
            _id: req.params.id,
            currentReviewer: professorId,
            status: "PendingProfessor",
            currentLevel: "professor"
        });

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found or already reviewed" });
        }

        assignment.status = "Rejected";
        assignment.currentLevel = "completed";
        assignment.currentReviewer = null;
        assignment.professorReviewedAt = new Date();
        assignment.professorRemarks = remarks;
        assignment.professorReviewedBy = professorId;
        assignment.reviewComments = remarks;
        assignment.rejectedBy = "Professor";
        assignment.isEditable = true;
        await assignment.save();

        res.json({ message: "Assignment rejected" });
    } catch (error) {
        console.error("Error rejecting assignment:", error);
        res.status(500).json({ message: "Error rejecting assignment" });
    }
});

professorRoutes.get("/students", auth.authMiddleware, auth.isProfessor, async (req, res) => {
    try {
        const professor = await User.findById(req.session.user.id);

        if (!professor) {
            return res.status(404).json({ message: "Professor not found" });
        }

        const students = await User.find({
            role: "student",
            department: professor.department
        }).select("-password");

        res.json({ students });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Error fetching students" });
    }
});

professorRoutes.get("/students/:email/assignments", auth.authMiddleware, auth.isProfessor, async (req, res) => {
    try {
        const professorId = new mongoose.Types.ObjectId(req.session.user.id);

        const assignments = await Assignment.find({
            studentEmail: req.params.email,
            $or: [
                { currentReviewer: professorId },
                { professorReviewedBy: professorId }
            ]
        })
            .sort({ submittedAt: -1 })
            .select("-fileData");

        res.json({ assignments });
    } catch (error) {
        console.error("Error fetching assignments:", error);
        res.status(500).json({ message: "Error fetching assignments" });
    }
});

module.exports = professorRoutes;
