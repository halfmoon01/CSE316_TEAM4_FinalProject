import { useState, useRef, useEffect } from "react";
import "@/css_files/announcement.css";
import { checkAuth } from "../AuthTracker";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditAnnouncement = () => {
  // Set the page title
  useEffect(() => {
    document.title = "Edit Announcement Page";
  }, []);

  // Destructure authentication and role information
  const { isLoggedIn, isLoading, isExecutives } = checkAuth();

  // State to manage the announcement title and content
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();

  // To avoid duplicate alerts
  const alerted = useRef(false);

  // State to track if the alert has been shown
  const [showAlert, setShowAlert] = useState(false); 

  // Fetch the current announcement data when the component mounts
  useEffect(() => {
    const loadAnnouncement = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/get-announcement"
        );
        const announcementContents = response.data.announcementData;

        // Set the fetched title
        setTitle(announcementContents.title);

        // Set the fetched content
        setContent(announcementContents.content);
      } catch (error) {
        console.error("Error loading announcement:", error);
        alert("Failed to load announcement. Please try again.");
      }
    };

    loadAnnouncement();
  }, []);

  // Navigates unauthenticated users
  useEffect(() => {
    if (!isLoading && !isLoggedIn && !alerted.current) {
      alerted.current = true;
      alert(
        "You have to sign in first in order to access the page!\nNavigating..."
      );
      navigate("/LogIn");
    }
  }, [isLoading, isLoggedIn, navigate]);

  // Navigates non-executive users to the home screen
  useEffect(() => {
    if (!isLoading && isLoggedIn && isExecutives <= 0 && !alerted.current) {
      alerted.current = true;
      alert(
        "Only executives can access this page!\nNavigating to the Home Screen..."
      );
      navigate("/HomeScreen");
    }
  }, [isLoading, isLoggedIn, isExecutives, navigate]);

  useEffect(() => {
    if (!isLoading && isLoggedIn && isExecutives > 0) {
      setShowAlert(true); // Trigger the alert once after the page loads
    }
  }, [isLoading, isLoggedIn, isExecutives]);

  useEffect(() => {
    if (showAlert) {
      alert(
        "Clicking REFRESH button or navigation to another page will delete unsaved changes without further notice."
      );
    }
  }, [showAlert]);

  // Show loading screen or deny access if conditions are not met
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isExecutives <= 0 || !isLoggedIn) {
    return <h1>No Permission!</h1>;
  }

  // Function to handle announcement submission
  const changeAnnouncement = async (event) => {
    event.preventDefault();

    // Handle cases where title or content is empty
    if (title === "" && content === "") {
      try {
        await axios.post("http://localhost:8080/api/edit-announcement", {
          title: "No Announcement Yet",
          content,
        });
        alert("Announcement Updated!\nNavigating to the Announcement Page..!");
        navigate("/Announcement");
      } catch (error) {
        alert("Failed to update. Please try again.");
      }
      return;
    } else if (
      (content === "" && title !== "") ||
      (title === "" && content !== "")
    ) {
      alert(
        "You cannot leave only one content empty. To empty announcement, clear both!"
      );
      window.location.reload(); // Reload the page to reset the state
      return;
    }

    // Update the announcement with the new title and content
    try {
      await axios.post("http://localhost:8080/api/edit-announcement", {
        title,
        content,
      });
      alert("Announcement Updated!\nNavigating to the Announcement Page..!");
      navigate("/Announcement");
    } catch (error) {
      alert("Failed to update. Please try again.");
    }
  };

  // Refresh the page
  const refreshPage = () => {
    alert("Page Refreshing...");
    window.location.reload();
  };

  return (
    <div className="announcement-container">
      <form className="editAnnouncement">
        <label htmlFor="title" className="first-child">
          <h2 className="forEdit">Title:</h2>
        </label>
        <input
          type="textarea"
          className="title-content"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={title}
          style={{ fontSize: "25px" }}
          required
        />
        <hr />
        <label htmlFor="content">
          <h2 className="forEdit">Announcement:</h2>
        </label>
        <textarea
          className="content-input"
          type="text"
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={content}
          required
        />
        <div className="edit-announcement-buttons">
          <button onClick={refreshPage} className="submit-button">
            REFRESH
          </button>
          <button onClick={changeAnnouncement} className="submit-button">
            SAVE
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAnnouncement;
