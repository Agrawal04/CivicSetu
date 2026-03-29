const pool = require('../config/db');
const { getCitizenLevel } = require("./xpController");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// CITIZEN signup
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields.' });
  }
  try {
    const [existing] = await pool.query(
      'SELECT * FROM citizens WHERE email = ?',
      [email]
    );
    if (existing.length) {
      return res.status(400).json({ message: 'Email already registered.' });
    }
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO citizens (name, email, password) VALUES (?, ?, ?)',
      [name, email, hash]
    );
    res.status(201).json({ message: 'Citizen registered successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CITIZEN login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Fill all fields.' });
  }
  try {
    const [rows] = await pool.query(
      'SELECT * FROM citizens WHERE email = ?',
      [email]
    );
    if (!rows.length) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    const citizen = rows[0];
    const valid = await bcrypt.compare(password, citizen.password);
    if (!valid) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    const token = jwt.sign(
      { id: citizen.id, role: 'citizen' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({
      token,
      user: {
        id: citizen.id,
        name: citizen.name,
        email: citizen.email,
        role: 'citizen'
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateProfile = async (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  try {
    // check if email is already used by another user
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? AND id <> ?',
      [email, userId]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already in use by another account.' });
    }

    // build query dynamically with or without password
    let query = 'UPDATE users SET name = ?, email = ?';
    const params = [name, email];

    if (password && password.trim() !== '') {
      const hash = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hash);
    }

    query += ' WHERE id = ?';
    params.push(userId);

    await pool.query(query, params);

    // return updated basic user info (without password)
    res.json({
      message: 'Profile updated successfully.',
      user: { id: Number(userId), name, email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get profile for a citizen (TEMP: read id from query) + badges
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.query.id;

    if (!userId) {
      return res.status(400).json({ message: "Citizen id is required (?id=...)" });
    }

    // 1) Basic citizen info
    const [rows] = await pool.query(
      "SELECT id, name, email, xp FROM citizens WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Citizen not found" });
    }

    const citizen = rows[0];
    const levelInfo = getCitizenLevel(citizen.xp);

    // 2) Fetch this citizen's complaints for badge logic
    const [complaints] = await pool.query(
      "SELECT category, image_url FROM complaints WHERE user_id = ?",
      [userId]
    );

    // 3) Compute badge conditions
    let potholeCount = 0;
    let photoCount = 0;
    const categorySet = new Set();

    complaints.forEach((c) => {
      if (c.category === "pothole") {
        potholeCount += 1;
      }
      if (c.image_url && c.image_url.trim() !== "") {
        photoCount += 1;
      }
      if (c.category) {
        categorySet.add(c.category);
      }
    });

    const badges = [];

    if (potholeCount >= 3) {
      badges.push({
        id: "pothole_reporter",
        name: "Pothole Reporter",
        description: "Reported at least 3 pothole issues.",
      });
    }

    if (photoCount >= 4) {
      badges.push({
        id: "photo_reporter",
        name: "Photo Reporter",
        description: "Submitted 4 complaints with photos.",
      });
    }

    if (categorySet.size >= 3) {
      badges.push({
        id: "all_round_citizen",
        name: "All‑Round Citizen",
        description: "Reported issues in 3 or more categories.",
      });
    }

    // 4) Return profile with XP, level, and badges
    res.json({
      id: citizen.id,
      name: citizen.name,
      email: citizen.email,
      xp: citizen.xp,
      level: levelInfo.level,
      title: levelInfo.title,
      nextLevelXp: levelInfo.nextLevelXp,
      badges, // NEW
    });
  } catch (err) {
    console.error("getMyProfile error:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};
