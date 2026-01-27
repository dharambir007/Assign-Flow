const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/assignmentApproval");
        console.log("MongoDB Connected");
    } catch (error) {
        console.log("Connection failed", error);
    }
};

module.exports = connectDB;
