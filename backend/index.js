require('dotenv').config();

const express = require("express");
const app = express();
const session = require("express-session");
const cors = require("cors");

const connectDB = require("./config/db"); // Adjusted path
const { verifyConnection } = require("./utils/emailService"); // Adjusted path

const authRoutes = require("./routes/authRoute"); // Adjusted path
const adminRoutes = require("./routes/adminRoute"); // Adjusted path
const studentRoutes = require("./routes/studentRoute"); // Adjusted path
const professorRoutes = require("./routes/professorRoute"); // Adjusted path
const hodRoutes = require("./routes/hodRoute"); // Adjusted path

connectDB();

const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, '');

app.use(cors({
    origin: clientUrl,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/student", studentRoutes);
app.use("/professor", professorRoutes);
app.use("/hod", hodRoutes);

app.get("/", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;

// Vercel serverless environment doesn't use app.listen
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, async () => {
        console.log(`Server started on port ${PORT}`);
        await verifyConnection();
    });
}

// Export the Express API for Vercel
module.exports = app;
