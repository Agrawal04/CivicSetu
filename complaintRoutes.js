const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { staffAuth } = require('../middleware/authStaff');

// router.put("/test", (req, res) => {
//   res.json({ ok: true });
// });

// Citizen creates a complaint
router.post('/create', complaintController.createComplaint);
// Get complaints by user
router.get('/user/:user_id', complaintController.getUserComplaints);
// Staff: get all complaints
router.get('/all', complaintController.getAllComplaints);
// Public complaints for all citizens
router.get("/public/all", complaintController.getPublicComplaints);
// Citizen: make an existing complaint public
router.put("/:complaint_id/public",complaintController.makeComplaintPublic);
// Citizen votes for a complaint
router.post("/:complaint_id/vote", complaintController.voteComplaint);
// Staff: update complaint status (pending / solved / fake)
router.put("/:complaint_id/status",staffAuth,complaintController.updateComplaintStatus);
// Citizen: delete own complaint (simple version using user_id in body)
router.delete("/:complaint_id", complaintController.deleteComplaint);

module.exports = router;
