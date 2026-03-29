const pool = require("../config/db");
const { addXpToCitizen, addXpToStaff } = require("./xpController");

// 1) Create new complaint (citizen) + give XP
exports.createComplaint = async (req, res) => {
  const { user_id, category, description, image_url, location, is_public } = req.body;

  if (!user_id || !category || !description) {
    return res.status(400).json({ message: "Required fields missing." });
  }

  try {
    await pool.query(
      "INSERT INTO complaints (user_id, category, description, image_url, location, status, is_public, votes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [user_id, category, description, image_url || "", location || "", "pending", is_public ? 1 : 0, 0,]
    );

    let xpToAdd = 5;
    if (image_url) {
      xpToAdd += 3;
    }

    await addXpToCitizen(user_id, xpToAdd);

    res.status(201).json({ message: "Complaint submitted." });
  } catch (err) {
    console.error("createComplaint error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 2) Get all complaints of one citizen
exports.getUserComplaints = async (req, res) => {
  const { user_id } = req.params;

  try {
    const [complaints] = await pool.query(
      "SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC",
      [user_id]
    );
    res.json(complaints);
  } catch (err) {
    console.error("getUserComplaints error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 3) Get all complaints (for staff)
exports.getAllComplaints = async (req, res) => {
  try {
    const [complaints] = await pool.query(
      "SELECT c.*, u.name AS user_name FROM complaints c JOIN citizens u ON c.user_id = u.id ORDER BY c.votes DESC, c.created_at DESC"
    );
    res.json(complaints);
  } catch (err) {
    console.error("getAllComplaints error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 4) Update complaint status (for staff)
exports.updateComplaintStatus = async (req, res) => {
  const { complaint_id } = req.params;
  const { status } = req.body;

  const staffId = req.user.id; // from staff auth middleware

  // allow only these status values
  const allowedStatuses = ["pending", "solved", "fake"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    // 1) If staff marks complaint as fake, subtract 15 XP from the citizen
    if (status === "fake") {
      const [rows] = await pool.query(
        "SELECT user_id FROM complaints WHERE id = ?",
        [complaint_id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      const citizenId = rows[0].user_id;
      await addXpToCitizen(citizenId, -15);
    }

    // 2) Update complaint status
    await pool.query("UPDATE complaints SET status = ? WHERE id = ?", [
      status,
      complaint_id,
    ]);

    // 3) Existing logic: reward solved complaints
    if (status === "solved") {
      const [rows] = await pool.query(
        "SELECT user_id FROM complaints WHERE id = ?",
        [complaint_id]
      );

      if (rows.length > 0) {
        const citizenId = rows[0].user_id;
        await addXpToCitizen(citizenId, 10);
      }

      if (staffId) {
        await addXpToStaff(staffId, 10);
      }
    }

    res.json({ message: "Complaint status updated." });
  } catch (err) {
    console.error("updateComplaintStatus error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 5) Citizen deletes own complaint (simple: uses user_id from body)
exports.deleteComplaint = async (req, res) => {
  try {
    const complaintId = req.params.complaint_id;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const [result] = await pool.query(
      "DELETE FROM complaints WHERE id = ? AND user_id = ?",
      [complaintId, user_id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Complaint not found for this user" });
    }

    res.json({ message: "Complaint deleted" });
  } catch (err) {
    console.error("deleteComplaint error:", err);
    res.status(500).json({ message: "Could not delete complaint" });
  }
};


// Get all public complaints (for citizens), ordered by votes then newest
exports.getPublicComplaints = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, u.name AS user_name
       FROM complaints c
       JOIN citizens u ON c.user_id = u.id
       WHERE c.is_public = 1 
       AND c.status <> 'fake'
       ORDER BY c.votes DESC, c.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("getPublicComplaints error:", err);
    res.status(500).json({ message: "Could not load public complaints" });
  }
};

// Citizen votes / supports a public complaint (+1)
exports.voteComplaint = async (req, res) => {
  try {
    const complaintId = req.params.complaint_id;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    // 1) Prevent multiple votes by same user on same complaint
    try {
      await pool.query(
        "INSERT INTO complaint_votes (complaint_id, user_id) VALUES (?, ?)",
        [complaintId, user_id]
      );
    } catch (err) {
      // Duplicate vote (UNIQUE constraint)
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "You already voted" });
      }
      throw err;
    }

    // 2) Increment votes count on complaint
    await pool.query(
      "UPDATE complaints SET votes = votes + 1 WHERE id = ?",
      [complaintId]
    );

    // 3) Get new vote count to send back
    const [rows] = await pool.query(
      "SELECT votes FROM complaints WHERE id = ?",
      [complaintId]
    );

    res.json({ message: "Vote recorded", votes: rows[0].votes });
  } catch (err) {
    console.error("voteComplaint error:", err);
    res.status(500).json({ message: "Could not record vote" });
  }
};

// Citizen makes an existing complaint public
exports.makeComplaintPublic = async (req, res) => {
  try {
    const complaintId = req.params.complaint_id;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    // Update only if complaint belongs to this user
    const [result] = await pool.query(
      "UPDATE complaints SET is_public = 1 WHERE id = ? AND user_id = ?",
      [complaintId, user_id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Complaint not found for this user" });
    }

    res.json({ message: "Complaint made public" });
  } catch (err) {
    console.error("makeComplaintPublic error:", err);
    res.status(500).json({ message: "Could not make complaint public" });
  }
};
