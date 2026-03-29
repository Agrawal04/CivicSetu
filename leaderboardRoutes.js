const express = require("express");
const router = express.Router();
const { getCitizenLeaderboard , getTopStaff } = require("../controllers/leaderboardController");

// Citizens leaderboard
router.get("/citizens", getCitizenLeaderboard);

// Staff leaderboard
router.get("/staff", getTopStaff);     // NEW route


module.exports = router;
