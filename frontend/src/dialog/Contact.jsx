import React from 'react';
import '@/css_files/contact.css';
import UserIcon from '../../public/user.png';
const Contact = ({ isOpen, onClose, selectedExecutive }) => {
  if (!isOpen || !selectedExecutive) return null;

  return (
    <div className="contact-dialog-box" onClick={(e) => e.stopPropagation()}>
  {/* Close Icon */}
  <span className="close-icon" onClick={onClose}>
    &times;
  </span>

  {/* Upper Section */}
  <div className="upper-section">
    <img
      src={selectedExecutive.profileImageUrl || UserIcon}
      className="contact-image"
      alt="Profile"
    />
    <div className="text-section">
      <h2 className="contact-name">{selectedExecutive.name}</h2>
      <h4 className="contact-position">{selectedExecutive.position}</h4>
    </div>
  </div>

  {/* Divider Line */}
  <hr className="line" />

  {/* Lower Section */}
  <p className="contact-info">
    <strong>Phone Number:</strong> {selectedExecutive.phoneNumber}
  </p>
  <p className="contact-info">
    <strong>E-Mail Address:</strong> {selectedExecutive.email}
  </p>
</div>

  );
};

export default Contact;