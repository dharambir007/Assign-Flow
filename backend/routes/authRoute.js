const { Router } = require("express");
const User = require("../models/User");
const Department = require("../models/Department");
const { createToken } = require("../utils/jwt");
const auth = require("../middlewares/authMiddleware");
const { sendOTPEmail } = require("../utils/emailService");

const authRoutes = Router();

const otpStore = new Map();

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

authRoutes.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        req.session.user = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name
            }
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
});

authRoutes.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Could not log out" });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true, message: "Logged out successfully" });
    });
});

authRoutes.get("/me", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    res.json({ user: req.session.user });
});

authRoutes.get("/departments", async (req, res) => {
    try {
        const departments = await Department.find({}).select("_id departmentName");
        res.json({ departments });
    } catch (error) {
        console.error("Error fetching departments:", error);
        res.status(500).json({ message: "Error fetching departments" });
    }
});

authRoutes.post("/signup", async (req, res) => {
    try {
        const { name, email, phone, password, department } = req.body;

        if (!name || !email || !phone || !password || !department) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const dept = await Department.findById(department);
        if (!dept) {
            return res.status(400).json({ message: "Invalid department" });
        }

        const newUser = new User({
            name,
            email,
            phone,
            password,
            department,
            role: "student"
        });

        await newUser.save();

        res.status(201).json({ 
            success: true,
            message: "Account created successfully" 
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Error creating account" });
    }
});

authRoutes.post("/admin-signup", async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const newAdmin = new User({
            name,
            email,
            phone,
            password,
            role: "admin"
        });

        await newAdmin.save();

        res.status(201).json({ 
            success: true,
            message: "Admin account created successfully" 
        });

    } catch (error) {
        console.error("Admin signup error:", error.message);
        console.error("Full error:", error);
        
        // Handle specific MongoDB errors
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already registered" });
        }
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        
        res.status(500).json({ message: "Error creating admin account: " + error.message });
    }
});

authRoutes.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No account found with this email" });
        }

        const otp = generateOTP();
        
        otpStore.set(email, {
            otp,
            expiry: Date.now() + 5 * 60 * 1000
        });

        const emailResult = await sendOTPEmail(email, otp);
        
        if (!emailResult.success) {
            console.error("Email send failed:", emailResult.error);
            return res.status(500).json({ message: "Failed to send OTP email. Please try again." });
        }

        res.json({ 
            success: true,
            message: "OTP sent to your email"
        });

    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Error sending OTP" });
    }
});

authRoutes.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const storedData = otpStore.get(email);

        if (!storedData) {
            return res.status(400).json({ message: "OTP expired or not found. Please request a new one." });
        }

        if (Date.now() > storedData.expiry) {
            otpStore.delete(email);
            return res.status(400).json({ message: "OTP expired. Please request a new one." });
        }

        if (storedData.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        res.json({ 
            success: true,
            message: "OTP verified successfully" 
        });

    } catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ message: "Error verifying OTP" });
    }
});

authRoutes.post("/reset-password", async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        if (!email || !otp || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const storedData = otpStore.get(email);

        if (!storedData || storedData.otp !== otp) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        if (Date.now() > storedData.expiry) {
            otpStore.delete(email);
            return res.status(400).json({ message: "OTP expired" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.password = password;
        await user.save();

        otpStore.delete(email);

        res.json({ 
            success: true,
            message: "Password reset successfully" 
        });

    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Error resetting password" });
    }
});

authRoutes.get("/profile", auth.authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id)
            .populate("department")
            .select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Error fetching profile" });
    }
});

authRoutes.put("/profile", auth.authMiddleware, async (req, res) => {
    try {
        const { name, phone } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.session.user.id,
            { name, phone },
            { new: true }
        )
            .populate("department")
            .select("-password");

        res.json({ 
            message: "Profile updated successfully",
            user: updatedUser 
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Error updating profile" });
    }
});

authRoutes.put("/change-password", auth.authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both current and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters" });
        }

        const user = await User.findById(req.session.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.password !== currentPassword) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Error changing password" });
    }
});

module.exports = authRoutes;
