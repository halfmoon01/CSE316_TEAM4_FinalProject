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
    origin: "http://localhost:5173", // React 앱의 도메인
    credentials: true, // 인증 정보를 포함하는 요청 허용
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

app.listen(8080, () => {
  console.log("Server is running on port 8080.");
});
