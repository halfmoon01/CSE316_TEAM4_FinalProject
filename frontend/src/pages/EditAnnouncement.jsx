import { useState, useRef, useEffect } from "react";
import "@/css_files/announcement.css";
import { checkAuth } from "../AuthTracker";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditAnnouncement = () => {
  useEffect(() => {
    document.title = "Edit Announcement Page";
  }, []);

  const { isLoggedIn, isLoading, isExecutives } = checkAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const alerted = useRef(false);

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

  useEffect(() => {
    // 로그인 상태 확인
    if (!isLoading && !isLoggedIn && !alerted.current) {
      alerted.current = true; // 알림 중복 방지
      alert(
        "You have to sign in first in order to access the page!\nNavigating to the Login Page..."
      );
      navigate("/LogIn");
    }
  }, [isLoading, isLoggedIn, navigate]);

  useEffect(() => {
    // 관리자 권한 확인
    if (!isLoading && isLoggedIn && isExecutives <= 0 && !alerted.current) {
      alerted.current = true; // 알림 중복 방지
      alert(
        "Only executives can access this page!\nNavigating to the Home Screen..."
      );
      navigate("/HomeScreen");
    }
  }, [isLoading, isLoggedIn, isExecutives, navigate]);

  if(isExecutives <= 0 || !isLoggedIn){
    return <h1>No Permission!</h1>
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const changeAnnouncement = async (event) => {
    event.preventDefault();

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
      window.location.reload();
      return;
    }

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