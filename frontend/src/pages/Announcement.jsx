import { useState, useRef, useEffect } from "react";
import "@/css_files/announcement.css";
import { checkAuth } from "../AuthTracker";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Announcement = () => {

  // Set the page title
  useEffect(() => {
    document.title = "Announcement Page";
  }, []);

  // Destructure authentication status
  const { isLoggedIn, isLoading } = checkAuth();

  // State for announcement title and content
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();

  // To avoid duplicate alerts
  const alerted = useRef(false);

  // Navigates unauthenticated users to the login page
  useEffect(() => {
    if (!isLoading && !isLoggedIn && !alerted.current) {
      alerted.current = true;
      alert(
        "You have to sign in first in order to access the page!\nNavigating to the Login Page..."
      );
      navigate("/LogIn");
    }
  }, [isLoading, isLoggedIn, navigate]);

  // Fetch announcement data from the server on component mount
  useEffect(() => {
    const loadAnnouncement = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/get-announcement"
        );
        const announcementContents = response.data.announcementData;
        setTitle(announcementContents.title);
        setContent(announcementContents.content);
      } catch (error) {
        console.error("Error loading announcement:", error);
        alert("Failed to load announcement. Please try again.");
      }
    };

    loadAnnouncement();
  }, []);

  // Show loading screen or deny access if conditions are not met
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!isLoggedIn) {
    return <h1>No Permission!</h1>;
  }

  return (
    <div className="announcement-container">
      <h1>{title}</h1>
      <hr />
      <div>{content}</div>
    </div>
  );
};

export default Announcement;
