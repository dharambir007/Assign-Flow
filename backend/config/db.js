const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/assignmentApproval", {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log("MongoDB Connected");
    } catch (error) {
        console.log("Connection failed", error);
        process.exit(1);
    }
};

module.exports = connectDB;
