const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
dotenv.config();

// const citizenRoutes = require('./routes/citizenRoutes');
const citizenRoutes = require("./routes/citizenRoutes");
const complaintRoutes = require('./routes/complaintRoutes');
const staffRoutes = require("./routes/staffRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files as static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer config for complaint images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// Single image upload endpoint
app.post("/api/upload/image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `http://localhost:${process.env.PORT || 5000}/uploads/${
    req.file.filename
  }`;
  res.json({ imageUrl });
});

app.use('/api/users', citizenRoutes);
app.use('/api/complaints', complaintRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.get('/', (req, res) => res.send('Shree-Ganesh backend running!'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Backend server started on port ${port}`));
