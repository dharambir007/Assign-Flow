const { Router } = require("express");
const auth = require("../middlewares/authMiddleware");
const Department = require("../models/Department");
const User = require("../models/User");

const adminRoute = Router();

adminRoute.get("/dashboard", auth.authMiddleware, auth.isAdmin, async (req, res) => {
    try {
        const [totalDepartments, students, professors, hods] = await Promise.all([
            Department.countDocuments(),
            User.countDocuments({ role: "student" }),
            User.countDocuments({ role: "professor" }),
            User.countDocuments({ role: "hod" })
        ]);

        res.json({
            totalDepartments,
            totalStudents: students,
            totalProfessors: professors,
            totalHODs: hods
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching dashboard data" });
    }
});

adminRoute.get("/departments", auth.authMiddleware, auth.isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";
        const filterType = req.query.type || "";

        const match = {};
        if (search) {
            match.departmentName = { $regex: search, $options: "i" };
        }
        if (filterType) {
            match.programType = filterType;
        }

        const departments = await Department.find(match)
            .skip(skip)
            .limit(limit);

        const total = await Department.countDocuments(match);

        res.json({
            departments,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching departments" });
    }
});

adminRoute.get("/departments/:id", auth.authMiddleware, auth.isAdmin, async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.json(department);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching department" });
    }
});

adminRoute.post("/departments", auth.authMiddleware, auth.isAdmin, async (req, res) => {
    try {
        const { departmentName, programType, address } = req.body;
        await Department.create({ departmentName, programType, address });
        res.status(201).json({ message: "Department created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating department" });
    }
});

adminRoute.put("/departments/:id", auth.authMiddleware, auth.isAdmin, async (req, res) => {
    try {
        const { departmentName, programType, address } = req.body;
        const department = await Department.findByIdAndUpdate(
            req.params.id,
            { departmentName, programType, address },
            { new: true }
        );
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.json({ message: "Department updated successfully", department });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating department" });
    }
});

adminRoute.delete("/departments/:id", auth.authMiddleware, auth.isAdmin, async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.json({ message: "Department deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting department" });
    }
});

adminRoute.get("/users", auth.authMiddleware, auth.isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";
        const filterType = req.query.type || "";

        const match = {};
        if (search) {
            match.name = { $regex: search, $options: "i" };
        }
        if (filterType) {
            match.role = filterType;
        }

        const users = await User.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: "departments",
                    localField: "department",
                    foreignField: "_id",
                    as: "department"
                }
            },
            {
                $unwind: {
                    path: "$department",
                    preserveNullAndEmptyArrays: true
                }
            },
            { $skip: skip },
            { $limit: limit }
        ]);

        const total = await User.countDocuments(match);

        res.json({
            users,
            totalUsers: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching users" });
    }
});

adminRoute.get("/users/:id", auth.authMiddleware, auth.isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("department");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user" });
    }
});

adminRoute.post("/users", auth.authMiddleware, auth.isAdmin, async (req, res) => {
    try {
        const { name, email, phone, role, department, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        await User.create({
            name,
            email,
            phone,
            role,
            department,
            password: password || "user123"
        });
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user" });
    }
});

adminRoute.put("/users/:id", auth.authMiddleware, auth.isAdmin, async (req, res) => {
    try {
        const { name, email, phone, role, department, password } = req.body;

        const updateData = { name, email, phone, role, department };

        if (password && password.trim() !== '') {
            updateData.password = password;
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating user" });
    }
});

adminRoute.delete("/users/:id", auth.authMiddleware, auth.isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting user" });
    }
});

module.exports = adminRoute;
