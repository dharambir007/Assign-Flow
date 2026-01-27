const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
    studentEmail: String,
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        default: null
    },
    title: String,
    description: String,
    category: String,
    filePath: String,
    fileData: Buffer,
    originalName: String,
    mimeType: String,

    cloudinaryPublicId: { type: String, default: null },
    cloudinaryUrl: { type: String, default: null },
    cloudinaryFormat: { type: String, default: null },
    cloudinaryResourceType: { type: String, default: "raw" },

    status: {
        type: String,
        enum: ["Draft", "PendingProfessor", "ProfessorApproved", "Submitted", "Rejected"],
        default: "Draft"
    },
    currentLevel: {
        type: String,
        enum: ["professor", "hod", "completed"],
        default: "professor"
    },
    uploadedAt: Date,
    submittedAt: { type: Date, default: null },

    currentReviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    isEditable: {
        type: Boolean,
        default: true
    },

    professorReviewedAt: { type: Date, default: null },
    professorRemarks: { type: String, default: "" },
    professorReviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    hodReviewedAt: { type: Date, default: null },
    hodRemarks: { type: String, default: "" },
    hodReviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    reviewComments: { type: String, default: "" },
    rejectedBy: { type: String, default: "" },

    reviewedAt: { type: Date, default: null },
    reviewRemarks: { type: String, default: "" },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
});

module.exports = mongoose.model("Assignment", assignmentSchema);
