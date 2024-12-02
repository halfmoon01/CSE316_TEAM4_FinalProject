import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ChangePwd from "../dialog/ChangePwd";
import ChangeImage from "@/dialog/ChangeImage";
import ChangeName from "@/dialog/ChangeName";
import ChangeEmail from "@/dialog/ChangeEmail";
import ChangePhone from "@/dialog/ChangePhone";
import { Person, Email, Phone, Lock, Work, Badge } from "@mui/icons-material";

import { checkAuth } from "../AuthTracker";
import "@/css_files/MyInformation.css";

const MyInformation = () => {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    isLoading,
    memberId,
    email,
    name,
    phoneNumber,
    profileImageUrl,
    position,
  } = checkAuth();

  // State variables for managing dialog visibility
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isPwdOpen, setIsPwdOpen] = useState(false);
  const [isNameOpen, setIsNameOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const alerted = useRef(false);

  // Set the page title
  useEffect(() => {
    document.title = "My Information Page";
  }, []);

  // Navigates unauthenticated users to the login page
  useEffect(() => {
    if (!isLoading && !isLoggedIn && !alerted.current) {
      alerted.current = true;
      alert(
        "You have to sign in first in order to access the page!\nNavigating..."
      );
      navigate("/LogIn");
    }
  }, [isLoading, isLoggedIn, navigate]);

  // Show loading screen or deny access if conditions are not met
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!isLoggedIn) {
    return <h1>No Permission!</h1>;
  }

  return (
    <>
    {/* Page Header */}
      <div className="myinfo-heading">
        <h1 className="myInfo-title">My Information</h1>
        <hr />
      </div>
       {/* User information container */}
      <div className="myInfo-container">
        <div className="info-block">
          <div className="profile-section">
            <img
              src={profileImageUrl || "/user.png"} // Display user's profile image or default image
              className="profile-image"
              alt="Profile"
            />
            <button
              className="change-button"
              onClick={() => setIsImageOpen(true)} // Open image change dialog
            >
              Change Image
            </button>
          </div>
        </div>
        {/* Information grid */}
        <div className="info-grid">
          <div className="info-card">
            <h2 className="info-label">
              <Person className="icon" /> Name
            </h2>
            <p className="info-value">{name}</p>
            <button
              className="change-button"
              onClick={() => setIsNameOpen(true)}  // Open name change dialog
            >
              Edit
            </button>
          </div>
          <div className="info-card">
            <h2 className="info-label">
              <Email className="icon" /> Email
            </h2>
            <p className="info-value">{email}</p>
            <button
              className="change-button"
              onClick={() => setIsEmailOpen(true)} // Open email change dialog
            >
              Edit
            </button>
          </div>
          <div className="info-card">
            <h2 className="info-label">
              <Phone className="icon" /> Phone
            </h2>
            <p className="info-value">{phoneNumber}</p>
            <button
              className="change-button"
              onClick={() => setIsPhoneOpen(true)} // Open phone change dialog
            >
              Edit
            </button>
          </div>
          <div className="info-card">
            <h2 className="info-label">
              <Lock className="icon" /> Password
            </h2>
            <p className="info-value">•••••••</p> {/* Masked password */}
            <button
              className="change-button"
              onClick={() => setIsPwdOpen(true)} // Open password change dialog
            >
              Edit
            </button>
          </div>
          <div className="info-card">
            <h2 className="info-label">
              <Work className="icon" /> Position
            </h2>
            <p className="info-value">{position}</p>
          </div>
          <div className="info-card">
            <h2 className="info-label">
              <Badge className="icon" /> Member ID
            </h2>
            <p className="info-value">{memberId}</p>
          </div>
        </div>

        {/* Dialog components */}
        <ChangeImage
          isOpen={isImageOpen}
          onClose={() => setIsImageOpen(false)}
        />
        <ChangePwd isOpen={isPwdOpen} onClose={() => setIsPwdOpen(false)} />
        <ChangeName isOpen={isNameOpen} onClose={() => setIsNameOpen(false)} />
        <ChangeEmail
          isOpen={isEmailOpen}
          onClose={() => setIsEmailOpen(false)}
        />
        <ChangePhone
          isOpen={isPhoneOpen}
          onClose={() => setIsPhoneOpen(false)}
        />
      </div>
    </>
  );
};

export default MyInformation;
