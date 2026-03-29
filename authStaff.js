const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

async function staffAuth(req, res, next) {
const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 1) verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    // decoded should contain staff id (from your staffLogin)

    // 2) load staff from DB (optional but good)
    const [rows] = await pool.query(
      "SELECT id, name FROM staff WHERE id = ?",
      [decoded.id]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Staff not found" });
    }

    // 3) attach to req.user
    req.user = {
      id: rows[0].id,
      name: rows[0].name,
      role: "staff",
    };

    next();
  } catch (err) {
    console.error("staffAuth error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { staffAuth };
