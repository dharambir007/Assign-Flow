const user = require("../models/User")
const Assignment = require("../models/Assignment");
const multer = require('multer');
const path = require('path');

module.exports.studentLoginPageGet = (req, res) => {
    res.render("userLogin",{error: ""});
}

module.exports.studentLoginPost = async(req, res) => {
    const { email, password } = req.body;
    let userFound = await user.findOne({email: email})
    if(userFound){
        if(userFound.password === password){
            req.session.user = { 
                email: email, 
                role: userFound.role 
            };
            return res.redirect("/student/dashboard");
        }else{
            return res.render('userLogin', { error: "Invalid password" });
        }
    }else{
        return res.render('userLogin', { error: "Invalid email" });
    }
    
}


module.exports.studentDashboardPageServe = async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.email) {
            return res.status(401).send("Please login first");
        }

        const email = req.session.user.email;

        const counts = await Assignment.aggregate([
            { $match: { studentEmail: email } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        let draftCount = 0, submittedCount = 0, approved = 0, rejected = 0;

        counts.forEach(item => {
            if (item._id === "Draft") draftCount = item.count;
            if (item._id === "Submitted") submittedCount = item.count;
            if (item._id === "Approved") approved = item.count;
            if (item._id === "Rejected") rejected = item.count;
        });

        const recentAssignments = await Assignment.find({ studentEmail: email })
            .sort({ uploadedAt: -1 })
            .limit(5);

        const professors = [
            { _id: "p1", name: "Dr. Amit Sharma", department: "Computer Science" },
            { _id: "p2", name: "Prof. Neha Verma", department: "Information Technology" },
            { _id: "p3", name: "Dr. Rajeev Bansal", department: "Electronics" }
        ];

        res.render("studentDashboard", {
            email,
            draftCount,
            submittedCount,
            approved,
            rejected,
            recentAssignments,
            professors
        });

    } catch (err) {
        console.error("Dashboard error:", err);
        res.status(500).send("Error loading dashboard");
    }
};

const upload = multer ({
    storage: multer.memoryStorage(),
    limits: {fileSize: 10*1024*1024},
    fileFilter: function(req,file,cb){
        const ext = path.extname(file.originalname).toLowerCase();
        if(ext!=".pdf"){
            return cb(new Error("Only pdf allowed"));
        }
        cb(null, true);
    }
}).single('assignmentFile');



module.exports.uploadAssignment = async (req, res) => {
    if(!req.session.user || req.session.user.role !== "student"){
        return res.status(403).send("Access denied: Only students can upload assignments");
    }
    upload(req, res, async function(err){
        if(err){
            return res.status(400).send(err.message);
        }
        try {
            const { title, description, category } = req.body;
            if(!title || !description || !category){
                return res.status(400).send("All fields required");
            }
            if(!req.file){
                return res.status(400).send("PDF file required");
            }
            const newAssignment = new Assignment({
                studentEmail: req.session.user.email,
                title,
                description,
                category,
                fileData: req.file.buffer,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                status: "Draft",
                uploadedAt: new Date()
            });
            await newAssignment.save();
            res.send("Assignment uploaded successfully");
        } catch (error) {
            console.error("Assignment save error:", error);
            res.status(500).send("Error saving assignment");
        }
    });
};

const uploadMultiple = multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: 10*1024*1024},
    fileFilter: (req,file,cb)=>{
        if(path.extname(file.originalname).toLowerCase()!==".pdf"){
            return cb(new Error("Only pdf allowed"));
        }
        cb(null, true);
    }
}).array("files",10);

module.exports.bulkUploadPageServe = (req, res) => {
    if(!req.session.user || req.session.user.role !== "student"){
        return res.status(403).send("Only students can access this page");
    }
    res.render("bulkUpload");
};

module.exports.bulkUploadAssignments = async(req,res)=>{
    if(!req.session.user || req.session.user.role!=="student"){
        return res.status(403).send("Access denied");
    }
    uploadMultiple(req,res,async(err)=>{
        if(err) return res.status(400).send("Access denied");
        const {description, category} = req.body;
        if(!req.files || req.files.length==0) return res.status(400).send("At least one file required");
        let uploaded = [];
        for(let file of req.files){
            const newAssignment = new Assignment({
                studentEmail: req.session.user.email,
                title: file.originalname,
                description,
                category: category || "Assignment",
                fileData: file.buffer,
                originalName: file.originalname,
                mimeType: file.mimetype,
                status: "Submitted",
                uploadedAt: new Date(),
            });
            await newAssignment.save();
            uploaded.push(newAssignment);
        }
        return res.send(`${uploaded.length} assignment(s) uploaded successfully`);
    });
};

module.exports.uploadAssignmentPageServe = (req,res)=>{
    if(!req.session.user || req.session.user.role !== "student"){
        return res.status(403).send("Only students can access this page");
    }
    res.render("uploadAssignment");
};

module.exports.viewAllAssignments = async (req, res) =>{
    try {
        if(!req.session.user || req.session.user.role !== "student"){
            return res.status(403).send("Only students can access this page");
        }
        const email = req.session.user.email;

        const statusFilter = req.query.status || "All";
        const sortOrder = req.query.sort === "asc" ? 1:-1;
        let filterQuery = {studentEmail: email};
        if(statusFilter!=="All"){
            filterQuery.status = statusFilter;
        }
        const assignments = await Assignment.find(filterQuery)
            .populate('currentReviewer', "name email")
            .sort({uploadedAt: sortOrder});
        res.render("my-assignments", {
            email,
            assignments,
            statusFilter,
            sortOrder
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading assignments");
    }
};


module.exports.submitAssignmentForReview = async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.email) {
            return res.status(401).send("Please login first");
        }

        const assignmentId = req.params.id;
        const { professorId } = req.body;

        if (!professorId) {
            return res.status(400).send("Professor is required");
        }

        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).send("Assignment not found");
        }

        if (assignment.studentEmail !== req.session.user.email) {
            return res.status(403).send("You are not allowed to submit this assignment");
        }

        if (assignment.status !== "Draft") {
            return res.status(400).send("Only draft assignments can be submitted");
        }

        assignment.status = "Submitted";
        assignment.currentReviewer = professorId;
        assignment.isEditable = false;
        assignment.submittedAt = new Date();

        await assignment.save();

        return res.redirect("/student/dashboard");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error submitting assignment");
    }
};

