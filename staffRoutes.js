const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");
const { staffAuth } = require("../middleware/authStaff"); // import middleware

// Admin-only: create staff (call via Postman)
router.post("/create", staffController.createStaff);

// Staff login
router.post("/login", staffController.staffLogin);

// NEW: staff XP
router.get("/xp/me", staffAuth, staffController.getMyStaffXp);

module.exports = router;
