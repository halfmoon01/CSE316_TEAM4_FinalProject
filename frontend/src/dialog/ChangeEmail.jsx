import React, { useState } from 'react';
import Dialog from './Dialog';
import { checkAuth } from "../AuthTracker";


const ChangeEmail = ({ isOpen, onClose }) => {
  const [newEmail, setNewEmail] = useState(''); // State to manage the new email input
  const {memberId} = checkAuth();

  const handleSave = async () => {
    if (!newEmail.trim()) {
      alert('Email cannot be empty');  // Alert if the email is not provided
      return;
    }
 // Regular expression to validate email format

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      alert('Please enter a valid email address.'); // Alert if the email is invalid
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8080/change-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newEmail, memberId}), // Include the new email and memberId in the request body
      });
  
      if (response.ok) {
        alert('Email changed successfully!');
        window.location.reload();
        onClose();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to change email.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while changing the email.');
    }
  };
  
  return (
    isOpen && ( // Render the dialog only if `isOpen` is true
      <Dialog
        title="Change your Email"
        content={
          <>
            <div className="line2">
              <input
                type="email"
                placeholder="Enter the new email"
                id="newEmail"
                className="new-input"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              {/* Inline validation message for invalid email */}
              {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail) && newEmail.length > 0 && (
                <p style={{ color: 'red' }}>Please enter a valid email address.</p>
              )}
            </div>
          </>
        }
        onClose={onClose}
        onSave={handleSave}
      />
    )
  );
};

export default ChangeEmail;
