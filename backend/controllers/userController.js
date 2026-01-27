const User = require("../models/User");
const Department = require("../models/Department");

module.exports.createUserForm = async (req, res) => {
    try {
        const departments = await Department.find({});
        res.render("admin/createUser", { departments });
    } catch (err) {
        console.error(err);
        res.send("Error");
    }
};

module.exports.createUser = async (req, res) => {
    try {
        const { name, email, phone, role, department, password } = req.body;
        await User.create({
            name,
            email,
            phone,
            role,
            department,
            password: password || "user123"
        });
        res.redirect("/admin/createUser");
    } catch (error) {
        console.error(error);
        res.send("Error");
    }
};

module.exports.viewUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * 10;
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
        const totalUsers = total;

        res.render("admin/viewUser", { users, totalUsers, page, currentPage: page, query: req.query });
    } catch (error) {
        console.error(error);
        res.send("Error fetching users");
    }
};

module.exports.editUserForm = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const departments = await Department.find({});
        if (!user) {
            return res.send("User not found");
        }
        res.render("admin/editUser", { user, departments });
    } catch (error) {
        console.error(error);
        res.send("Error loading user");
    }
};

module.exports.updateUsers = async (req, res) => {
    try {
        const { name, email, phone, role, department } = req.body;
        await User.findByIdAndUpdate(req.params.id, {
            name,
            email,
            phone,
            role,
            department,
        });
        res.redirect("/admin/viewUser");
    } catch (error) {
        console.error(error);
        res.send("Error Updating User");
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const User = require("../models/User");
        await User.findByIdAndDelete(req.params.id);
        res.redirect("/admin/viewUser");
    } catch (error) {
        console.error(error);
        res.send("Error deleting user");
    }
};
