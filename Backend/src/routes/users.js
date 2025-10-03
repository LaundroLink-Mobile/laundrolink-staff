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
      `
      SELECT 
        u.UserID, 
        u.UserEmail, 
        u.UserRole, 
        s.ShopID,
        sh.ShopName 
      FROM 
        User u 
      JOIN 
        Staff s ON u.UserID = s.StaffID
      JOIN
        Laundry_Shop sh ON s.ShopID = sh.ShopID
      WHERE 
        u.UserRole = 'Staff' AND u.UserEmail = ? AND u.UserPassword = ?
      `,
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials or not a staff account" });
    }

    res.json({
      success: true,
      user: rows[0], // The user object will now include the ShopID
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