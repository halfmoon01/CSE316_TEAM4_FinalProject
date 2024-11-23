const express = require("express");
const mysql = require("mysql2");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const stream = require("stream");

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
        return res.status(401).json({ error: "Invalid ID or password" });
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

app.post("/change-name", (req, res) => {
  const { newName, memberId } = req.body;

  if (!newName) {
    return res
      .status(400)
      .json({ message: "Invalid name. Name cannot be empty." });
  }

  const query = "UPDATE members SET name = ? WHERE memberId = ?";

  db.query(query, [newName.trim(), memberId], (err, result) => {
    if (err) {
      console.error("Error updating name:", err);
      return res
        .status(500)
        .json({ message: "An error occurred while updating the name." });
    }

    return res
      .status(200)
      .json({ message: "Name changed successfully!", updatedName: newName });
  });
});

app.post("/change-email", (req, res) => {
  const { newEmail, memberId } = req.body;

  if (!newEmail || typeof newEmail !== "string" || !newEmail.trim()) {
    return res
      .status(400)
      .json({ message: "Invalid email. Email cannot be empty." });
  }

  if (!memberId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  const query = "UPDATE members SET email = ? WHERE memberId = ?";

  db.query(query, [newEmail.trim(), memberId], (err, result) => {
    if (err) {
      console.error("Error updating email:", err);
      return res
        .status(500)
        .json({ message: "An error occurred while updating the email." });
    }
    return res
      .status(200)
      .json({ message: "Email changed successfully!", updatedEmail: newEmail });
  });
});

// Endpoint to change password
app.post("/change-password", (req, res) => {
  const { oldHashedPassword, newHashedPassword, memberId } = req.body;

  console.log("Received Request Body:", req.body); // Debugging

  if (!oldHashedPassword || !newHashedPassword) {
    return res.status(400).json({ message: "Passwords cannot be empty." });
  }

  // Fetch current hashed password
  const fetchQuery = "SELECT password FROM members WHERE memberId = ?";

  db.query(fetchQuery, [memberId], (fetchErr, fetchResult) => {
    if (fetchErr) {
      console.error("Error fetching current password:", fetchErr);
      return res
        .status(500)
        .json({ message: "An error occurred while verifying the password." });
    }

    if (fetchResult.length === 0) {
      return res.status(404).json({ message: "Member not found." });
    }

    const currentHashedPassword = fetchResult[0].password;

    // Validate old password
    if (currentHashedPassword !== oldHashedPassword.trim()) {
      return res.status(401).json({ message: "Old password is incorrect." });
    }

    // Update with the new hashed password
    const updateQuery = "UPDATE members SET password = ? WHERE memberId = ?";
    db.query(
      updateQuery,
      [newHashedPassword.trim(), memberId],
      (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Error updating password:", updateErr);
          return res.status(500).json({
            message: "An error occurred while updating the password.",
          });
        }

        return res
          .status(200)
          .json({ message: "Password changed successfully!" });
      }
    );
  });
});

app.post("/change-phone", (req, res) => {
  const { newPhone, memberId } = req.body;

  if (!newPhone) {
    return res
      .status(400)
      .json({ message: "Invalid password. Password cannot be empty." });
  }

  const query = "UPDATE members SET phoneNumber = ? WHERE memberId = ?";

  db.query(query, [newPhone, memberId], (err, result) => {
    if (err) {
      console.error("Error updating password:", err);
      return res
        .status(500)
        .json({ message: "An error occurred while updating the password." });
    }
    return res.status(200).json({ message: "Password changed successfully!" });
  });
});

app.post("/change-image", upload.single("image"), async (req, res) => {
  const { id } = req.body;
  const file = req.file;

  if (!file || !id) {
    return res.status(400).json({ message: "Image and ID are required." });
  }

  try {
    const uploadResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "user_images", public_id: `user_${id}` },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);
      bufferStream.pipe(uploadStream);
    });

    const imageUrl = uploadResponse.secure_url;

    const query = "UPDATE members SET  profileImageUrl = ? WHERE memberId = ?";
    db.query(query, [imageUrl, id], (err) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ message: "Failed to update database." });
      }

      res.status(200).json({
        message: "Image uploaded and saved successfully!",
        imageUrl,
      });
    });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ message: "Failed to upload image." });
  }
});

app.get("/api/get-announcement", (req, res) => {
  db.query("SELECT * FROM announcement", (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Internal Server Error" });
    }

    const announcementData = results[0];
    return res.status(200).json({ announcementData });
  });
});

app.post("/api/edit-announcement", (req, res) => {
  const { title, content } = req.body;

  const query = "UPDATE announcement SET title = ?, content = ?";

  db.query(query, [title, content], (err, result) => {
    if (err) {
      console.error("Error updating announcement:", err);

      const columnErrorMap = {
        title: "Title is too long!",
        content: "Content is too long!",
      };

      const matchedColumn = Object.keys(columnErrorMap).find((column) =>
        err.sqlMessage?.includes(`Data too long for column '${column}'`)
      );

      if (matchedColumn) {
        return res.status(400).json({ error: columnErrorMap[matchedColumn] });
      }

      return res.status(500).json({ error: "Database update error" });
    }

    res.status(200).json({ message: "Updated announcement successfully!" });
  });
});

app.post("/add-image", upload.single("image"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "Image file is required." });
  }

  try {
    const uploadResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "gallery_images" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);
      bufferStream.pipe(uploadStream);
    });

    const imageUrl = uploadResponse.secure_url;

    const query = "INSERT INTO galleryitems (imageUrl) VALUES (?)";
    db.query(query, [imageUrl], (err) => {
      if (err) {
        console.error("Database query error:", err);
        return res
          .status(500)
          .json({ message: "Failed to save image to database." });
      }

      res.status(200).json({
        message: "Image uploaded and added to database successfully!",
        imageUrl,
      });
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    res.status(500).json({ message: "Failed to upload image." });
  }
});

app.get("/api/get-gallery", (req, res) => {
  db.query("SELECT * FROM galleryitems", (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Internal Server Error" });
    }

    const galleryData = results;
    return res.status(200).json({ galleryData });
  });
});

app.delete("/api/gallery-delete/:imageId", (req, res) => {
  const { imageId } = req.params;

  const query = "DELETE FROM galleryitems WHERE imageId = ?";
  db.query(query, [imageId], (err, result) => {
    if (err) {
      console.error("Error deleting image from database:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.status(200).json({ message: "Image deleted successfully" });
  });
});

app.get("/members/:id", (req, res) => {
  const userId = parseInt(req.params.id);

  const query = 'SELECT * FROM members WHERE not id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching members:", err);
      return res.status(500).json({ message: "Failed to fetch members." });
    }
    const memberList = results;
    return res.status(200).json({
      message: "Success!",
      memberList,
    });
  });
});

app.delete('/members/:id', (req, res) => {
  const memberId = parseInt(req.params.id, 10); 

  if (isNaN(memberId)) {
    return res.status(400).json({ message: 'Invalid member ID.' });
  }

  const checkExecutiveQuery = 'SELECT isExecutives FROM members WHERE id = ?';

  db.query(checkExecutiveQuery, [memberId], (err, results) => {
    if (err) {
      console.error('Error deleting member:', err);
      return res.status(500).json({ message: 'Failed to check member rank' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Member not found.' });
    }
    
    const memberRank = results[0].isExecutives;
    // reject deletion of Cheif Executive
    if(memberRank === 2){
      return res.status(403).json({message: 'Cannot delete a Chief Executive. '});
    }

    const deleteQuery = 'DELETE FROM members WHERE id = ?';
    db.query(deleteQuery, [memberId], (err, result) => {
      if (err) {
        console.error('Error deleting member:', err);
        return res.status(500).json({ message: 'Failed to delete member.' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Member not found.' });
      }
      return res.status(200).json({ message: 'Member deleted successfully.' });
    });
  });
});


app.get("/manage-account/members/:memberId", (req, res) => {
  const { memberId } = req.params;

  const getMemberQuery = "SELECT id, isExecutives, position FROM members WHERE id = ?";
  db.query(getMemberQuery, [memberId], (err, results) => {
    if (err) {
      console.error("Error fetching member data:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(results[0]);
  });
});


app.put("/manage-account/members/:memberId/position", (req, res) => {
  const { memberId } = req.params;
  const { position, isExecutive } = req.body;
  const loggedInUserId = req.id;
  const loggedInUserIsExecutives = req.isExecutives;

  if (!position || isExecutive === undefined) {
    return res.status(400).json({ message: "Position and isExecutive are required." });
  }

  const getCurrentMemberQuery = "SELECT id, isExecutives FROM members WHERE id = ?";
  db.query(getCurrentMemberQuery, [memberId], (err, results) => {
    if (err) {
      console.error("Error fetching member data:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Member not found" });
    }

    const currentMember = results[0];

    // if it is has higher or same isExecutives level than the logged in person -> reject
    if (currentMember.isExecutives >= loggedInUserIsExecutives) {
      return res.status(403).json({
        message: "You can only modify the position of someone with the lower rank than you.",
      });
    }

    // member cannot be Cheif Executive right away 
    if (currentMember.isExecutives === 0 && isExecutive === 2) {
      return res.status(403).json({ message: "Cannot change directly from Member to Chief Executive." });
    }

    // Chief Executive promotion
    if (isExecutive === 2) {
      const checkChiefQuery = "SELECT id FROM members WHERE isExecutives = 2";
      db.query(checkChiefQuery, (err, chiefResults) => {
        if (err) {
          console.error("Error checking Chief Executive Manager:", err);
          return res.status(500).json({ message: "Failed to check Chief Executive Manager." });
        }

        const existingChiefId = chiefResults.length > 0 ? chiefResults[0].id : null;
        // downgrade loggedin member
        if (existingChiefId && existingChiefId !== parseInt(memberId, 10)) {
          const downgradeQuery =
            "UPDATE members SET isExecutives = 1, position = 'Executive Manager' WHERE id = ?";
          db.query(downgradeQuery, [existingChiefId], (err) => {
            if (err) {
              console.error("Error downgrading Chief Executive:", err);
              return res.status(500).json({ message: "Failed to downgrade Chief Executive." });
            }

            const downgraded = {
              id: existingChiefId,
              position: "Executive Manager",
              isExecutives: 1,
            };

            updatePosition(memberId, position, isExecutive, res, downgraded);
          });
        } else {
          updatePosition(memberId, position, isExecutive, res);
        }
      });
    } else {
      updatePosition(memberId, position, isExecutive, res);
    }
  });

  const updatePosition = (memberId, position, isExecutive, res, downgraded = null) => {
    const updateQuery = "UPDATE members SET position = ?, isExecutives = ? WHERE id = ?";
    db.query(updateQuery, [position, isExecutive, memberId], (err) => {
      if (err) {
        console.error("Error updating position:", err);
        return res.status(500).json({ message: "Failed to update position." });
      }

      const response = { message: "Position updated successfully." };
      if (downgraded) {
        response.downgraded = downgraded;
      }

      res.status(200).json(response);
    });
  };
});


app.listen(8080, () => {
  console.log("Server is running on port 8080.");
});
