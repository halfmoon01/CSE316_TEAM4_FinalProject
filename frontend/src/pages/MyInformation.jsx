import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ChangePwd from "../dialog/ChangePwd";
import ChangeImage from "@/dialog/ChangeImage";
import ChangeName from "@/dialog/ChangeName";
import ChangeEmail from "@/dialog/ChangeEmail";
import ChangePhone from "@/dialog/ChangePhone";
import UserIcon from "../../public/user.png";

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

  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isPwdOpen, setIsPwdOpen] = useState(false);
  const [isNameOpen, setIsNameOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const alerted = useRef(false);

  useEffect(() => {
    document.title = "My Information Page";
  }, []);

  useEffect(() => {
    if (!isLoading && !isLoggedIn && !alerted.current) {
      alerted.current = true;
      alert(
        "You have to sign in first in order to access the page!\nNavigating to the Login Page..."
      );
      navigate("/LogIn");
    }
  }, [isLoading, isLoggedIn, navigate]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  
  if (!isLoggedIn) {
    return <h1>No Permission!</h1>;
  }

  return (
    <>
     <div className="myinfo-heading">
          <h1 className="myInfo-title">User Information</h1>
          <hr />
      </div>

    <div className="myInfo-container">
      <div className="info-block">
        <div className="profile-section">
          <img
            src={profileImageUrl || UserIcon}
            className="profile-image"
            alt="Profile"
          />
          <button
            className="change-button"
            onClick={() => setIsImageOpen(true)}
          >
            Change Image
          </button>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <p className="info-label">Name</p>
          <p className="info-value">{name}</p>
          <button className="change-button" onClick={() => setIsNameOpen(true)}>
            Edit
          </button>
        </div>
        <div className="info-card">
          <p className="info-label">Email</p>
          <p className="info-value">{email}</p>
          <button
            className="change-button"
            onClick={() => setIsEmailOpen(true)}
          >
            Edit
          </button>
        </div>
        <div className="info-card">
          <p className="info-label">Phone</p>
          <p className="info-value">{phoneNumber}</p>
          <button
            className="change-button"
            onClick={() => setIsPhoneOpen(true)}
          >
            Edit
          </button>
        </div>
        <div className="info-card">
          <p className="info-label">Password</p>
          <p className="info-value">•••••••</p>
          <button className="change-button" onClick={() => setIsPwdOpen(true)}>
            Edit
          </button>
        </div>
        <div className="info-card">
          <p className="info-label">Position</p>
          <p className="info-value">{position}</p>
        </div>
        <div className="info-card">
          <p className="info-label">Member ID</p>
          <p className="info-value">{memberId}</p>
        </div>
      </div>

      {/* Dialog components */}
      <ChangeImage isOpen={isImageOpen} onClose={() => setIsImageOpen(false)} />
      <ChangePwd isOpen={isPwdOpen} onClose={() => setIsPwdOpen(false)} />
      <ChangeName isOpen={isNameOpen} onClose={() => setIsNameOpen(false)} />
      <ChangeEmail isOpen={isEmailOpen} onClose={() => setIsEmailOpen(false)} />
      <ChangePhone isOpen={isPhoneOpen} onClose={() => setIsPhoneOpen(false)} />
    </div>
    </>
  );
};

export default MyInformation;
