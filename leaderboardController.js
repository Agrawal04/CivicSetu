// controllers/leaderboardController.js
const db = require("../config/db");

// Get top 10 citizens by XP
exports.getCitizenLeaderboard = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const [rows] = await db.query(      // <- IMPORTANT: db.query, not pool.query
      "SELECT id, name, xp FROM citizens ORDER BY xp DESC LIMIT ?",
      [limit]
    );

    const leaderboard = rows.map((row, index) => ({
      rank: index + 1,
      id: row.id,
      name: row.name,
      xp: row.xp,
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error("getCitizenLeaderboard error:", err);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};

// Top staff by XP
exports.getTopStaff = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;

    const [rows] = await db.query(
      `SELECT id, name, xp
       FROM staff
       ORDER BY xp DESC, id ASC
       LIMIT ?`,
      [limit]
    );

    const ranked = rows.map((row, index) => ({
      rank: index + 1,
      id: row.id,
      name: row.name,
      xp: row.xp,
    }));

    res.json(ranked);
  } catch (err) {
    console.error("getTopStaff error:", err);
    res.status(500).json({ message: "Could not load staff leaderboard" });
  }
};
