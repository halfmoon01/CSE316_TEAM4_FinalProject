import React from 'react';
import '@/css_files/contact.css';
const Contact = ({ isOpen, onClose, selectedExecutive }) => {
  // If the modal is not open or no executive is selected, return null
  if (!isOpen || !selectedExecutive) return null;

  return (
    <div className="modal" onClick={onClose}>
      {/* Backdrop */}
      <div className="backdrop"></div>

      <div className="contact-dialog-box" onClick={(e) => e.stopPropagation()}>
      {/* Close Icon */}
      <span className="close-icon" onClick={onClose}>
        &times;
      </span>

      {/* Upper Section */}
      <div className="upper-section">
        {/* Profile Image */}
        <img
          src={selectedExecutive.profileImageUrl || '/user.png'}
          className="contact-image"
          alt="Profile"
        />
        {/* Name and Position */}
      <div className="text-section">
        <h2 className="contact-name">{selectedExecutive.name}</h2>
        <h4 className="contact-position">{selectedExecutive.position}</h4>
      </div>
    </div>

    {/* Divider Line */}
    <hr className="line" />

    {/* Lower Section */}
    <p className="contact-info">
      <strong>Phone Number:</strong> {selectedExecutive.phoneNumber} {/* Executive's phone number */}
    </p>
    <p className="contact-info">
      <strong>E-Mail Address:</strong> {selectedExecutive.email} {/* Executive's email */}
    </p>
  </div>
</div>
  );
};

export default Contact;