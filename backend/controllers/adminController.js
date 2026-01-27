const User = require("../models/User");
const {createToken, verifyToken} = require("../utils/jwt");
module.exports.adminLoginPageServe = (req,res)=>{
    res.render("login",{error:null});
}

module.exports.adminCreateDepartmentPageServe =  (req, res)=>{
    res.render("./admin/createDepartment")
}

module.exports.dashboardPageServe = (req,res)=>{
    const totalDepartments = 5;
    const totalStudents = 300;
    const totalProfessors = 10;
    const totalHODs = 5;
    
    res.render("admin/dashboard",{
        email:req.session.user.email,
        totalDepartments,
        totalProfessors,
        totalStudents,
        totalHODs
    });
}

module.exports.homePageServe = (req,res)=>{
    res.render("home", {email:req.session.user.email});
}

module.exports.loginPageServe = async (req,res) =>{
    try {
        const {email , password} = req.body;

        if (email === "admin@gmail.com" && password === "admin123") {
            req.session.user = { 
                email: email, 
                role: "admin" 
            };
            return res.redirect("/admin/dashboard");
        }

        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.render("login", { error: "Invalid email or password" });
        }

        req.session.user = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        if (user.role === "student") return res.redirect("/student/dashboard");
        if (user.role === "professor") return res.redirect("/professor/dashboard");
        if (user.role === "hod") return res.redirect("/hod/dashboard");

        return res.redirect("/");

    } catch (err) {
        console.error("Login error:", err);
        res.render("login", { error: "Something went wrong" });
    }
};

module.exports.editDepartmentPageServe = async (req, res) => {
    try {
        const Department = require("../models/Department");
        const department = await Department.findById(req.params.id);
        res.render("admin/editdepartment", { department });
    } catch (error) {
        console.error(error);
        res.send("Error loading department");
    }
}

module.exports.updateDepartment = async (req,res)=>{
    try {
        const Department = require("../models/Department");
        const {departmentName, programType, address} = req.body;
        await Department.findByIdAndUpdate(req.params.id, {
            departmentName,
            programType,
            address,
        });
        res.redirect("/admin/departments");
    } catch (error) {
        console.error(error);
        res.send("Error updating department");
    }
}

module.exports.deleteDepartment = async (req,res)=>{
    try {
        const Department = require("../models/Department");
        await Department.findByIdAndDelete(req.params.id);
        res.redirect("/admin/departments");
    }
    catch (error) {
        console.error(error);
        res.send("Error deleting department");
    }
}
