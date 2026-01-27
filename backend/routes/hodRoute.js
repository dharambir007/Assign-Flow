const { Router } = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const Assignment = require("../models/Assignment");
const auth = require("../middlewares/authMiddleware");
const { getCloudinaryUrl, getDownloadUrl } = require("../utils/cloudinaryService");
const axios = require('axios');

const hodRoutes = Router();

hodRoutes.get("/dashboard", auth.authMiddleware, auth.isHOD, async (req, res) => {
    try {
        const hodId = new mongoose.Types.ObjectId(req.session.user.id);
        const hod = await User.findById(hodId);

        const pendingCount = await Assignment.countDocuments({
            currentReviewer: hodId,
            status: "ProfessorApproved",
            currentLevel: "hod"
        });

        const hodReviewed = await Assignment.aggregate([
            {
                $match: {
                    hodReviewedBy: hodId
                }
            },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        let approvedCount = 0, rejectedCount = 0;
        hodReviewed.forEach(item => {
            if (item._id === "Submitted") approvedCount = item.count;
            if (item._id === "Rejected") rejectedCount = item.count;
        });

        const recentAssignments = await Assignment.find({
            currentReviewer: hodId,
            status: "ProfessorApproved",
            currentLevel: "hod"
        })
            .populate("professorReviewedBy", "name email")
            .sort({ professorReviewedAt: -1 })
            .limit(5)
            .select("-fileData");

        res.json({
            hodId,
            email: req.session.user.email,
            department: hod.department,
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

hodRoutes.get("/assignments/pending", auth.authMiddleware, auth.isHOD, async (req, res) => {
    try {
        const hodId = new mongoose.Types.ObjectId(req.session.user.id);

        const assignments = await Assignment.find({
            currentReviewer: hodId,
            status: "ProfessorApproved",
            currentLevel: "hod"
        })
            .populate("professorReviewedBy", "name email")
            .populate("studentId", "name email")
            .sort({ professorReviewedAt: -1 })
            .select("-fileData");

        res.json({ assignments });
    } catch (error) {
        console.error("Error fetching assignments:", error);
        res.status(500).json({ message: "Error fetching assignments" });
    }
});

hodRoutes.get("/assignments/reviewed", auth.authMiddleware, auth.isHOD, async (req, res) => {
    try {
        const hodId = new mongoose.Types.ObjectId(req.session.user.id);

        const assignments = await Assignment.find({
            hodReviewedBy: hodId,
            currentLevel: "completed"
        })
            .populate("professorReviewedBy", "name email")
            .populate("studentId", "name email")
            .sort({ hodReviewedAt: -1 })
            .select("-fileData");

        res.json({ assignments });
    } catch (error) {
        console.error("Error fetching assignments:", error);
        res.status(500).json({ message: "Error fetching assignments" });
    }
});

hodRoutes.get("/assignments", auth.authMiddleware, auth.isHOD, async (req, res) => {
    try {
        const hodId = new mongoose.Types.ObjectId(req.session.user.id);
        const hod = await User.findById(hodId);
        const { status, page = 1, limit = 10 } = req.query;

        let query = { department: hod.department };

        if (status === "pending") {
            query = {
                currentReviewer: hodId,
                status: "ProfessorApproved",
                currentLevel: "hod"
            };
        } else if (status === "reviewed") {
            query = { hodReviewedBy: hodId };
        } else if (status) {
            query.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const assignments = await Assignment.find(query)
            .populate("professorReviewedBy", "name email")
            .populate("studentId", "name email")
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

hodRoutes.get("/assignments/:id", auth.authMiddleware, auth.isHOD, async (req, res) => {
    try {
        const hodId = new mongoose.Types.ObjectId(req.session.user.id);
        const hod = await User.findById(hodId);

        const assignment = await Assignment.findOne({
            _id: req.params.id,
            department: hod.department
        })
            .populate("professorReviewedBy", "name email")
            .populate("studentId", "name email department")
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

hodRoutes.get("/assignments/:id/download", auth.authMiddleware, auth.isHOD, async (req, res) => {
    try {
        const hodId = new mongoose.Types.ObjectId(req.session.user.id);
        const hod = await User.findById(hodId);

        const assignment = await Assignment.findOne({
            _id: req.params.id,
            department: hod.department
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

hodRoutes.post("/assignments/:id/approve", auth.authMiddleware, auth.isHOD, async (req, res) => {
    try {
        const hodId = new mongoose.Types.ObjectId(req.session.user.id);
        const { remarks } = req.body;

        const assignment = await Assignment.findOne({
            _id: req.params.id,
            currentReviewer: hodId,
            status: "ProfessorApproved",
            currentLevel: "hod"
        });

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found or already reviewed" });
        }

        // Final approval - status becomes Submitted (final approved)
        assignment.status = "Submitted";
        assignment.currentLevel = "completed";
        assignment.currentReviewer = null;
        assignment.hodReviewedAt = new Date();
        assignment.hodRemarks = remarks || "";
        assignment.hodReviewedBy = hodId;
        assignment.isEditable = false;
        await assignment.save();

        res.json({ message: "Assignment submitted successfully (Final Approved)" });
    } catch (error) {
        console.error("Error approving assignment:", error);
        res.status(500).json({ message: "Error approving assignment" });
    }
});

hodRoutes.post("/assignments/:id/reject", auth.authMiddleware, auth.isHOD, async (req, res) => {
    try {
        const hodId = new mongoose.Types.ObjectId(req.session.user.id);
        const { remarks } = req.body;

        if (!remarks) {
            return res.status(400).json({ message: "Rejection remarks are required" });
        }

        const assignment = await Assignment.findOne({
            _id: req.params.id,
            currentReviewer: hodId,
            status: "ProfessorApproved",
            currentLevel: "hod"
        });

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found or already reviewed" });
        }

        assignment.status = "Rejected";
        assignment.currentLevel = "completed";
        assignment.currentReviewer = null;
        assignment.hodReviewedAt = new Date();
        assignment.hodRemarks = remarks;
        assignment.hodReviewedBy = hodId;
        assignment.reviewComments = remarks;
        assignment.rejectedBy = "HOD";
        assignment.isEditable = true;
        await assignment.save();

        res.json({ message: "Assignment rejected by HOD" });
    } catch (error) {
        console.error("Error rejecting assignment:", error);
        res.status(500).json({ message: "Error rejecting assignment" });
    }
});

hodRoutes.get("/stats", auth.authMiddleware, auth.isHOD, async (req, res) => {
    try {
        const hodId = req.session.user.id;
        const hod = await User.findById(hodId).populate("department");

        const studentCount = await User.countDocuments({
            role: "student",
            department: hod.department._id
        });

        const professorCount = await User.countDocuments({
            role: "professor",
            department: hod.department._id
        });

        const assignmentStats = await Assignment.aggregate([
            { $match: { department: hod.department._id } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const stats = {
            department: hod.department,
            studentCount,
            professorCount,
            assignments: {}
        };

        assignmentStats.forEach(item => {
            stats.assignments[item._id] = item.count;
        });

        res.json(stats);
    } catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).json({ message: "Error fetching statistics" });
    }
});

hodRoutes.get("/professors", auth.authMiddleware, auth.isHOD, async (req, res) => {
    try {
        const hodId = req.session.user.id;
        const hod = await User.findById(hodId);

        const professors = await User.find({
            role: "professor",
            department: hod.department
        }).select("-password");

        res.json({ professors });
    } catch (error) {
        console.error("Error fetching professors:", error);
        res.status(500).json({ message: "Error fetching professors" });
    }
});

hodRoutes.get("/students", auth.authMiddleware, auth.isHOD, async (req, res) => {
    try {
        const hodId = req.session.user.id;
        const hod = await User.findById(hodId);

        const students = await User.find({
            role: "student",
            department: hod.department
        }).select("-password");

        res.json({ students });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Error fetching students" });
    }
});

module.exports = hodRoutes;
