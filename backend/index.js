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

app.post("/api/signupvalidation", async (req, res) => {
  const { email, memberId, phoneNumber } = req.body;

  if (!email || !memberId || !phoneNumber) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid input. Please provide email, memberId, and phoneNumber.",
    });
  }

  try {
    const memberIdResults = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM members WHERE memberId = ?",
        [memberId],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    if (memberIdResults.length > 0) {
      return res.status(200).json({
        success: false,
        message: "Member ID already exists",
      });
    }

    const phoneNumberResults = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM members WHERE phoneNumber = ?",
        [phoneNumber],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    if (phoneNumberResults.length > 0) {
      return res.status(200).json({
        success: false,
        message: "Phone Number already exists",
      });
    }

    const emailResults = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM members WHERE email = ?",
        [email],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    if (emailResults.length > 0) {
      return res.status(200).json({
        success: false,
        message: "Email already exists",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Validation passed",
    });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

app.post("/signup", (req, res) => {
  const {
    memberId,
    email,
    password,
    name,
    phoneNumber,
    profileImageUrl,
    position,
  } = req.body;

  const query =
    "INSERT INTO members (memberId, email, password, name, phoneNumber, profileImageUrl, position) VALUES (?, ?, ?, ?, ?, ?, ?)";

  const values = [
    memberId,
    email,
    password,
    name,
    phoneNumber,
    profileImageUrl || null,
    position || "member",
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Database insert error:", err);

      const columnErrorMap = {
        phoneNumber: "Phone number too long!",
        memberId: "ID too long!",
        password: "Password too long!",
        name: "Name too long!",
        email: "Email too long!",
      };

      const matchedColumn = Object.keys(columnErrorMap).find((column) =>
        err.sqlMessage?.includes(`Data too long for column '${column}'`)
      );

      if (matchedColumn) {
        return res.status(400).json({ error: columnErrorMap[matchedColumn] });
      }

      return res.status(500).json({ error: "Database insert error" });
    }

    res.status(201).json({ message: "User registered successfully!" });
  });
});

app.post("/signin", (req, res) => {
  const { memberId, password } = req.body;

  db.query(
    "SELECT * FROM members WHERE memberId = ?",
    [memberId],
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid ID or password" });
      }

      const member = results[0];

      if (member.password !== password) {
        return res.status(401).json({ error: "Invalid ID or password" }); // 비밀번호 불일치
      }

      const memberCookie = JSON.stringify({
        id: member.id,
      });

      res.cookie("member", memberCookie, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        message: "Login successful",
      });
    }
  );
});

app.listen(8080, () => {
  console.log("Server is running on port 8080.");
});
