
import express from "express";
import pool from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const allowedCategories = [
  "Scholarship",
  "Concert",
  "Admission",
  "General Query",
];

const allowedUserTypes = ["Parent", "Student", "School"];

const allowedStatuses = ["new", "in_progress", "resolved"];

// PUBLIC: Submit inquiry
router.post("/", async (req, res) => {
  try {
    const {
      user_type,
      category,
      name,
      email,
      phone,
      message,
    } = req.body;

    if (
      !user_type ||
      !category ||
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!allowedUserTypes.includes(user_type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user type",
      });
    }

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    const result = await pool.query(
      `INSERT INTO inquiries
       (user_type, category, name, email, phone, message)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        user_type,
        category,
        name.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        message.trim(),
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully!",
      inquiry: result.rows[0],
    });
  } catch (error) {
    console.error("Inquiry submission error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to submit inquiry",
    });
  }
});

// PROTECTED: Get inquiries with filters and search
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { category, userType, search, status } = req.query;

    const conditions = [];
    const values = [];

    const addCondition = (sql, value) => {
      values.push(value);
      conditions.push(`${sql} $${values.length}`);
    };

    if (category) {
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
        });
      }
      addCondition("category =", category);
    }

    if (userType) {
      if (!allowedUserTypes.includes(userType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user type",
        });
      }
      addCondition("user_type =", userType);
    }

    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }
      addCondition("status =", status);
    }

    if (search?.trim()) {
      values.push(`%${search.trim()}%`);
      const index = values.length;
      conditions.push(
        `(name ILIKE $${index} OR phone ILIKE $${index})`
      );
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const result = await pool.query(
      `SELECT id, name, email, phone, user_type,
              category, message, status, created_at
       FROM inquiries
       ${whereClause}
       ORDER BY created_at DESC`,
      values
    );

    return res.json({
      success: true,
      count: result.rows.length,
      inquiries: result.rows,
    });
  } catch (error) {
    console.error("Fetch inquiries error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch inquiries",
    });
  }
});

// PROTECTED: Update inquiry status
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const result = await pool.query(
      `UPDATE inquiries
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    return res.json({
      success: true,
      message: "Inquiry status updated successfully",
      inquiry: result.rows[0],
    });
  } catch (error) {
    console.error("Update status error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update inquiry status",
    });
  }
});

export default router;
