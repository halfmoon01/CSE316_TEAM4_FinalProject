const express = require("express");
const mysql = require("mysql2");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();

require("dotenv").config();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
    return;
  }
  console.log("MySQL connection successful!");
});

app.get("/api/login-track", (req, res) => {
  const member = req.cookies.member;
  if (member) {
    try {
      const memberData = JSON.parse(member);
      return res.status(200).json({
        loggedIn: true,
        id: memberData.id,
      });
    } catch (error) {
      console.error("Invalid user cookie format:", error);
      return res.status(400).json({ error: "Invalid cookie format" });
    }
  }

  return res.status(200).json({
    loggedIn: false,
    userId: null,
  });
});

app.get("/api/get-member-info", (req, res) => {
  const { id } = req.query;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid or missing id" });
  }

  db.query("SELECT * FROM members WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Member not found" });
    }

    const memberInfo = results[0];
    return res.status(200).json({ memberInfo });
  });
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("member");
  res.status(200).json({ message: "Logged out" });
});


app.listen(8080, () => {
  console.log("Server is running on port 8080.");
});
