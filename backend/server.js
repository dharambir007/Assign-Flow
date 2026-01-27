require('dotenv').config();
const express = require("express");
const app = express();
const session = require("express-session");
const cors = require("cors");
const connectDB = require("./config/db");
const { verifyConnection } = require("./utils/emailService");

const authRoutes = require("./routes/authRoute");
const adminRoutes = require("./routes/adminRoute");
const studentRoutes = require("./routes/studentRoute");
const professorRoutes = require("./routes/professorRoute");
const hodRoutes = require("./routes/hodRoute");

connectDB();

// Remove trailing slash from CLIENT_URL if present
const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, '');

app.use(cors({
    origin: clientUrl,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy for Vercel/production
app.set('trust proxy', 1);

app.use(session({
    secret: process.env.SESSION_SECRET || "secretkey@567",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/professor", professorRoutes);
app.use("/api/hod", hodRoutes);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;

// Only listen if not in serverless environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, async () => {
        console.log(`Server started on port ${PORT}`);
        await verifyConnection();
    });
}

// Export for Vercel serverless
module.exports = app;