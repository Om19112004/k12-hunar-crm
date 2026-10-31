
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import cookieParser from "cookie-parser";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

//API Routes
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/auth", authRoutes);

// Test API
app.get("/", (req, res) => {
  res.send("K12 Hunar CRM Backend is running!");
});

// Start server
// Database health check
app.get("/api/health/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      message: "Supabase database connected successfully!",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection error:", error.message);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});