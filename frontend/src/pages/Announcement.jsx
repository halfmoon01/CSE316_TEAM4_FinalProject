import { useState, useRef, useEffect } from "react";
import "@/css_files/announcement.css";
import { checkAuth } from "../AuthTracker";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Announcement = () => {
  useEffect(() => {
    document.title = "Announcement Page";
  }, []);

  const { isLoggedIn, isLoading } = checkAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const alerted = useRef(false);

  useEffect(() => {
    if (!isLoading && !isLoggedIn && !alerted.current) {
      alerted.current = true;
      alert(
        "You have to sign in first in order to access the page!\nNavigating to the Login Page..."
      );
      navigate("/LogIn");
    }
  }, [isLoading, isLoggedIn, navigate]);


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

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="announcement-container">
      <h2>{title}</h2>
      <hr />
      <div>{content}</div>
    </div>
  );
};

export default Announcement;
