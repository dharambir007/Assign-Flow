module.exports.authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Please login first" });
    }
    next();
};

module.exports.checkStudent = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== "student") {
        return res.status(403).json({ message: "Access Denied: Students only" });
    }
    next();
};

module.exports.isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === "admin") {
        return next();
    }
    return res.status(403).json({ message: "Access Denied: Admin only" });
};

module.exports.isProfessor = (req, res, next) => {
    if (req.session.user && req.session.user.role === "professor") {
        return next();
    }
    return res.status(403).json({ message: "Access Denied: Professor only" });
};

module.exports.isHOD = (req, res, next) => {
    if (req.session.user && req.session.user.role === "hod") {
        return next();
    }
    return res.status(403).json({ message: "Access Denied: HOD only" });
};