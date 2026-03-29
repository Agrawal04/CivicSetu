const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin-only: create a staff account (use from Postman, not public UI)
exports.createStaff = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, password required." });
  }

  try {
    const [existing] = await pool.query(
      "SELECT id FROM staff WHERE email = ?",
      [email]
    );
    if (existing.length) {
      return res.status(400).json({ message: "Email already used for staff." });
    }

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO staff (name, email, password) VALUES (?, ?, ?)",
      [name, email, hash]
    );

    res.status(201).json({ message: "Staff created successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Staff login
exports.staffLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required." });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM staff WHERE email = ?",
      [email]
    );
    if (!rows.length) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const staff = rows[0];
    const valid = await bcrypt.compare(password, staff.password);
    if (!valid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: staff.id, role: "staff" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: "staff",
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET /api/staff/xp/me  (for logged-in staff)
exports.getMyStaffXp = async (req, res) => {
  try {
    const staffId = req.user.id; // comes from staffAuth

    const [rows] = await pool.query(
      "SELECT name, xp, level FROM staff WHERE id = ?",
      [staffId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const staff = rows[0];

    res.json({
      title: "Problem Solver",
      xp: staff.xp,
      level: staff.level
    });
  } catch (err) {
    console.error("getMyStaffXp error:", err);
    res.status(500).json({ message: "Could not load staff XP" });
  }
};
