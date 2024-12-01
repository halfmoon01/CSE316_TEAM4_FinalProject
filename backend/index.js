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

//db connection configuration
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

//cloudianry connection configuration
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
  const member = req.cookies.member; // Retrieve the 'member' cookie from the request

  if (member) {
    try {
      // Parse the 'member' cookie to extract user data
      const memberData = JSON.parse(member);
      return res.status(200).json({
        loggedIn: true, // Indicates the user is logged in
        id: memberData.id, // Include the user's ID in the response
      });
    } catch (error) {
      // Handle invalid JSON format in the cookie
      console.error("Invalid user cookie format:", error);
      return res.status(400).json({ error: "Invalid cookie format" }); // Return an error response
    }
  }

  // If no 'member' cookie is found, assume the user is not logged in
  return res.status(200).json({
    loggedIn: false, // Indicates the user is not logged in
    userId: null, // No user ID available
  });
});

app.get("/api/get-member-info", (req, res) => {
  const { id } = req.query; // Extract the `id` parameter from the query string

  // Validate the `id` parameter
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid or missing id" }); // Return a 400 response for invalid or missing IDs
  }

  // Query the database for the member's information using the provided `id`
  db.query("SELECT * FROM members WHERE id = ?", [id], (err, results) => {
    if (err) {
      // Log and return a 500 response for database errors
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      // Return a 404 response if no member is found
      return res.status(404).json({ error: "Member not found" });
    }

    // If a member is found, return their information in the response
    const memberInfo = results[0];
    return res.status(200).json({ memberInfo });
  });
});

app.post("/api/logout", (req, res) => {
  // Clear the "member" cookie to log the user out
  res.clearCookie("member");

  // Send a response indicating successful logout
  res.status(200).json({ message: "Logged out" });
});

app.post("/api/signupvalidation", async (req, res) => {
  const { email, memberId, phoneNumber } = req.body;

  // Check if all required fields are provided
  if (!email || !memberId || !phoneNumber) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid input. Please provide email, memberId, and phoneNumber.",
    });
  }

  try {
    // Validate if memberId already exists
    const memberIdResults = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM members WHERE memberId = ?",
        [memberId],
        (err, results) => {
          if (err) reject(err); // Reject promise on error
          else resolve(results); // Resolve promise with query results
        }
      );
    });

    if (memberIdResults.length > 0) {
      return res.status(200).json({
        success: false,
        message: "Member ID already exists",
      });
    }

    // Validate if phoneNumber already exists
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

    // Validate if email already exists
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
  } = req.body; // Extract user-provided data from the request body

  // SQL query to insert user data into the members table
  const query =
    "INSERT INTO members (memberId, email, password, name, phoneNumber, profileImageUrl, position) VALUES (?, ?, ?, ?, ?, ?, ?)";

  // Array of values to pass into the query
  const values = [
    memberId,
    email,
    password,
    name,
    phoneNumber,
    profileImageUrl || null, // Default to `null` if no profile image is provided
    position || "member", // Default to "member" if no position is specified
  ];

  // Execute the query
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Database insert error:", err);

      // Map specific column errors to user-friendly messages
      const columnErrorMap = {
        phoneNumber: "Phone number too long!",
        memberId: "ID too long!",
        password: "Password too long!",
        name: "Name too long!",
        email: "Email too long!",
      };

      // Check if the error message matches a known column issue
      const matchedColumn = Object.keys(columnErrorMap).find((column) =>
        err.sqlMessage?.includes(`Data too long for column '${column}'`)
      );

      // Return a user-friendly error message if a match is found
      if (matchedColumn) {
        return res.status(400).json({ error: columnErrorMap[matchedColumn] });
      }

      // Return a generic error message for other database issues
      return res.status(500).json({ error: "Database insert error" });
    }

    // Return a success message if the insert is successful
    res.status(201).json({ message: "User registered successfully!" });
  });
});

app.post("/signin", (req, res) => {
  // Extract login credentials from the request body
  const { memberId, password } = req.body;

  // Query the database for a user with the given memberId
  db.query(
    "SELECT * FROM members WHERE memberId = ?",
    [memberId],
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // If no user is found, return a 401 Unauthorized response
      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid ID or password" });
      }

      // Get the user data from the query result
      const member = results[0];

      if (member.password !== password) {
        // Return 401 if the password is incorrect
        return res.status(401).json({ error: "Invalid ID or password" });
      }

      // Create a cookie to store user session information
      const memberCookie = JSON.stringify({
        id: member.id,
      });

      res.cookie("member", memberCookie, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (1 day)
      });

      // Respond with a success message
      res.status(200).json({
        message: "Login successful",
      });
    }
  );
});

// Endpoint to update a user's name
app.post("/change-name", (req, res) => {
  const { newName, memberId } = req.body; // Extract new name and member ID

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

// Endpoint to update a user's email
app.post("/change-email", (req, res) => {
  const { newEmail, memberId } = req.body;

  // Validate newEmail and memberId
  if (!newEmail || typeof newEmail !== "string" || !newEmail.trim()) {
    return res
      .status(400)
      .json({ message: "Invalid email. Email cannot be empty." });
  }

  if (!memberId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  // Check if email already exists
  const checkEmailQuery = "SELECT * FROM members WHERE email = ?";
  db.query(checkEmailQuery, [newEmail], (err, result) => {
    if (err) {
      console.error("Error checking email:", err);
      return res
        .status(500)
        .json({ message: "An error occurred while checking the email." });
    }

    if (result.length > 0) {
      return res.status(409).json({ message: "Email already exists." });
    }

    // Update email if no conflict
    const updateEmailQuery = "UPDATE members SET email = ? WHERE memberId = ?";
    db.query(updateEmailQuery, [newEmail.trim(), memberId], (err, result) => {
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

  // Validate input
  if (!newPhone) {
    return res
      .status(400)
      .json({ message: "Invalid phone number. Phone number cannot be empty." });
  }

  // Check if the phone number already exists
  const checkPhoneQuery = "SELECT * FROM members WHERE phoneNumber = ?";
  db.query(checkPhoneQuery, [newPhone], (err, result) => {
    if (err) {
      console.error("Error checking phone number:", err);
      return res
        .status(500)
        .json({ message: "An error occurred while checking the phone number." });
    }

    if (result.length > 0) {
      return res.status(409).json({ message: "Phone Number already exists." });
    }

    // Update phone number if it does not already exist
    const updatePhoneQuery = "UPDATE members SET phoneNumber = ? WHERE memberId = ?";
    db.query(updatePhoneQuery, [newPhone, memberId], (err, result) => {
      if (err) {
        console.error("Error updating phone number:", err);
        return res
          .status(500)
          .json({ message: "An error occurred while updating the phone number." });
      }

      return res
        .status(200)
        .json({ message: "Phone number changed successfully!" });
    });
  });
});


app.post("/change-image", upload.single("image"), async (req, res) => {
  const { id } = req.body;
  const file = req.file;

  if (!id) {
    return res.status(400).json({ message: "ID is required." });
  }

  try {
    let imageUrl;

    if (!file) {
      // If no file is uploaded, use the default image URL
      imageUrl = "/user.png"; // Ensure this path is accessible in your application
    }else{
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

    imageUrl = uploadResponse.secure_url;
  }
    const query = "UPDATE members SET  profileImageUrl = ? WHERE memberId = ?";
    db.query(query, [imageUrl, id], (err) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ message: "Failed to update database." });
      }

      res.status(200).json({
        message: file
          ? "Image uploaded and saved successfully!"
          : "Default image set successfully!",
        imageUrl,
      });
    });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ message: "Failed to upload image." });
  }
});

app.get("/api/get-announcement", (req, res) => {
  // Execute a query to fetch all rows from the `announcement` table
  db.query("SELECT * FROM announcement", (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if the query returned any results
    if (results.length === 0) {
      // Return a 404 response if no announcement data is found
      return res.status(404).json({ error: "Internal Server Error" });
    }

    // Extract the first announcement entry (assuming it's the latest or only entry)
    const announcementData = results[0];

    // Return the announcement data with a 200 OK response
    return res.status(200).json({ announcementData });
  });
});

app.post("/api/edit-announcement", (req, res) => {
  // Extract `title` and `content` from the request body
  const { title, content } = req.body;

  // SQL query to update the `announcement` table
  const query = "UPDATE announcement SET title = ?, content = ?";

  // Execute the query with the provided `title` and `content`
  db.query(query, [title, content], (err, result) => {
    if (err) {
      console.error("Error updating announcement:", err);

      // Map specific column errors to user-friendly messages
      const columnErrorMap = {
        title: "Title is too long!",
        content: "Content is too long!",
      };

      // Check if the error matches any known column issues
      const matchedColumn = Object.keys(columnErrorMap).find((column) =>
        err.sqlMessage?.includes(`Data too long for column '${column}'`)
      );

      // Return a 400 Bad Request with a specific error message if applicable
      if (matchedColumn) {
        return res.status(400).json({ error: columnErrorMap[matchedColumn] });
      }

      // Return a generic 500 Internal Server Error for other issues
      return res.status(500).json({ error: "Database update error" });
    }

    // Respond with success if the update is successful
    res.status(200).json({ message: "Updated announcement successfully!" });
  });
});

app.post("/add-image", upload.single("image"), async (req, res) => {
  const file = req.file;

  // Check if an image file is provided
  if (!file) {
    return res.status(400).json({ message: "Image file is required." });
  }

  try {
    // Upload the image file to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "gallery_images" }, // Specify the folder in Cloudinary
        (error, result) => {
          if (error) reject(error); // Handle upload error
          else resolve(result); // Handle upload success
        }
      );

      // Create a buffer stream to pipe the file to Cloudinary
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);

      // Pipe the image file buffer
      bufferStream.pipe(uploadStream);
    });

    // Get the uploaded image URL
    const imageUrl = uploadResponse.secure_url;

    // Insert the image URL into the database
    const query = "INSERT INTO galleryitems (imageUrl) VALUES (?)";
    db.query(query, [imageUrl], (err) => {
      if (err) {
        console.error("Database query error:", err);
        return res
          .status(500)
          .json({ message: "Failed to save image to database." });
      }

      // Send success response with the image URL
      res.status(200).json({
        message: "Image uploaded and added to database successfully!",
        imageUrl,
      });
    });
  } catch (error) {
    // Handle errors during Cloudinary upload
    console.error("Error uploading to Cloudinary:", error);
    res.status(500).json({ message: "Failed to upload image." });
  }
});

app.get("/api/get-gallery", (req, res) => {
  // Query the database to retrieve all gallery items
  db.query("SELECT * FROM galleryitems", (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      // Return a 500 Internal Server Error if the query fails
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if the query returned no results
    if (results.length === 0) {
      // Return a 404 Not Found if the gallery is empty
      return res.status(404).json({ error: "Internal Server Error" });
    }

    // Store the query results in a variable
    const galleryData = results;

    // Return the gallery data with a 200 OK response
    return res.status(200).json({ galleryData });
  });
});

app.delete("/api/gallery-delete/:imageId", (req, res) => {
  // Extract the imageId from the route parameters
  const { imageId } = req.params;

  const query = "DELETE FROM galleryitems WHERE imageId = ?";
  db.query(query, [imageId], (err, result) => {
    if (err) {
      // SQL query to delete the image by ID
      console.error("Error deleting image from database:", err);

      // Return a 500 Internal Server Error if the query fails
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // Check if any rows were affected (i.e., if the image was found and deleted)
    if (result.affectedRows === 0) {
      // Return a 404 Not Found if no matching image ID exists in the database
      return res.status(404).json({ message: "Image not found" });
    }

    // Return a success response if the image was deleted
    res.status(200).json({ message: "Image deleted successfully" });
  });
});

app.get("/members/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  // get member list without logined person
  const query = "SELECT * FROM members WHERE not id = ?";

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

app.delete("/members/:id", (req, res) => {
  const memberId = parseInt(req.params.id, 10);

  if (isNaN(memberId)) {
    return res.status(400).json({ message: "Invalid member ID." });
  }

  const checkExecutiveQuery = "SELECT isExecutives FROM members WHERE id = ?";

  db.query(checkExecutiveQuery, [memberId], (err, results) => {
    if (err) {
      console.error("Error deleting member:", err);
      return res.status(500).json({ message: "Failed to check member rank" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Member not found." });
    }

    const memberRank = results[0].isExecutives;
    // reject deletion of Cheif Executive
    if (memberRank === 2) {
      return res
        .status(403)
        .json({ message: "Cannot delete a Chief Executive. " });
    }

    const deleteQuery = "DELETE FROM members WHERE id = ?";
    db.query(deleteQuery, [memberId], (err, result) => {
      if (err) {
        console.error("Error deleting member:", err);
        return res.status(500).json({ message: "Failed to delete member." });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Member not found." });
      }
      return res.status(200).json({ message: "Member deleted successfully." });
    });
  });
});

app.get("/manage-account/members/:memberId", (req, res) => {
  const { memberId } = req.params;

  const getMemberQuery =
    "SELECT id, isExecutives, position FROM members WHERE id = ?";
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
    return res
      .status(400)
      .json({ message: "Position and isExecutive are required." });
  }

  const getCurrentMemberQuery =
    "SELECT id, isExecutives FROM members WHERE id = ?";
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
        message:
          "You can only modify the position of someone with the lower rank than you.",
      });
    }

    // member cannot be Cheif Executive right away
    if (currentMember.isExecutives === 0 && isExecutive === 2) {
      return res.status(403).json({
        message: "Cannot change directly from Member to Chief Executive.",
      });
    }

    // Chief Executive promotion
    if (isExecutive === 2) {
      const checkChiefQuery = "SELECT id FROM members WHERE isExecutives = 2";
      db.query(checkChiefQuery, (err, chiefResults) => {
        if (err) {
          console.error("Error checking Chief Executive Manager:", err);
          return res
            .status(500)
            .json({ message: "Failed to check Chief Executive Manager." });
        }

        const existingChiefId =
          chiefResults.length > 0 ? chiefResults[0].id : null;
        // downgrade loggedin member
        if (existingChiefId && existingChiefId !== parseInt(memberId, 10)) {
          const downgradeQuery =
            "UPDATE members SET isExecutives = 1, position = 'Executive Manager' WHERE id = ?";
          db.query(downgradeQuery, [existingChiefId], (err) => {
            if (err) {
              console.error("Error downgrading Chief Executive:", err);
              return res
                .status(500)
                .json({ message: "Failed to downgrade Chief Executive." });
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

  const updatePosition = (
    memberId,
    position,
    isExecutive,
    res,
    downgraded = null
  ) => {
    const updateQuery =
      "UPDATE members SET position = ?, isExecutives = ? WHERE id = ?";
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

app.get("/executives", (req, res) => {
  const query =
    // only get executives (where level is 1 or 2)
    "SELECT * FROM members WHERE isExecutives = 1 or isExecutives = 2 ORDER BY isExecutives DESC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Failed to fetch executives." });
    }
    res.status(200).json(results);
  });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080.");
});
