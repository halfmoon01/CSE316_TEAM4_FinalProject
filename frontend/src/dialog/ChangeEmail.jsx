import React, { useState } from 'react';
import Dialog from './Dialog';
import { checkAuth } from "../AuthTracker";


const ChangeEmail = ({ isOpen, onClose }) => {
  const [newEmail, setNewEmail] = useState('');
  const {memberId} = checkAuth();

  const handleSave = async () => {
    if (!newEmail.trim()) {
      alert('Email cannot be empty');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8080/change-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newEmail, memberId}), 
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
    isOpen && (
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
