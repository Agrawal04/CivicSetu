const express = require('express');
const router = express.Router();
const citizenController = require('../controllers/citizenController');

router.post('/register', citizenController.register);
router.post('/login', citizenController.login);

// NEW: profile with XP + level
router.get("/me" , citizenController.getMyProfile);

// NEW: update profile
router.put('/update/:id', citizenController.updateProfile);

module.exports = router;
