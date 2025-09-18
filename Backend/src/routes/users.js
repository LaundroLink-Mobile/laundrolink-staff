import express from "express";
import db from "../db.js";

const router = express.Router();

/**
 * ✅ Staff Login (User Table)
 * POST /users/login
 * Body: { email, password }
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const [rows] = await db.query(
      "SELECT UserID, UserEmail, UserRole FROM User WHERE UserEmail = ? AND UserPassword = ?",
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      success: true,
      user: rows[0],
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error, please try again later" });
  }
});

/**
 * ✅ (Optional) Fetch all users — for testing only
 * GET /users
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT UserID, UserEmail, UserRole FROM User");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
