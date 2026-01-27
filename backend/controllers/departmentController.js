const Department = require("../models/Department");

exports.createDepartment = async (req, res) => {
    try {
        const { departmentName, programType, address } = req.body;

        await Department.create({
            departmentName,
            programType,
            address
        });
        res.redirect("/admin/createDepartment");
    } catch (error) {
        console.error(error);
        res.send("Error creating department");
    }
};

exports.viewDepartments = async (req, res) => {
    try{
        const page = parseInt(req.query.page)||1;
        const limit = 10;
        const skip = (page - 1) * 10

        const search = req.query.search || "";
        const filterType = req.query.type || "";

        const match = {};

        if(search){
            match.departmentName = search;
        }
        if(filterType){
            match.programType = filterType;
        }
        const departments = await Department.aggregate([
            { $match: match },
            { $skip: skip },
            { $limit: limit }
        ]);

        const total = await Department.countDocuments(match);
        const totalDepartments = total;

        res.render("admin/departmentList", {
            currentPage: page,
            totalPages: Math.ceil(totalDepartments / limit),
            search,
            filterType,
            departments 
        });

    } catch (error) {
        console.error(error);
        res.send("Error");
    }
};

exports.editDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);

        if(!department){
            return res.send("Department not found");
        }
        res.render("admin/editDepartment",{department});
    } catch (error) {
        console.error(error);
        res.send("Department not found");
    }
};

exports.deleteDepartment = async(req,res)=>{
    try {
        const department = await Department.findByIdAndDelete(req.params.id);
        if(!department){
            return res.send("Department not found");
        }
        res.redirect("/admin/departments");
    } catch (error) {
        console.error(error);
        res.send(error);
    }
}
