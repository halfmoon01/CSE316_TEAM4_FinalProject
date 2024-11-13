import React, { useState } from 'react';
import Dialog from './Dialog'; // Dialog component
import { hashutil } from '../Hashutil.js'; // Import hashutil for password hashing
import { checkAuth } from '../AuthTracker';

const ChangePwd = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { memberId } = checkAuth(); // Get authenticated user ID

  const handleSave = async () => {
    if (!oldPassword.trim() || !newPassword.trim()) {
      alert('Both old and new passwords are required.');
      return;
    }

    try {
      // Hash both old and new passwords
      const oldHashedPassword = hashutil(memberId, oldPassword.trim());
      const newHashedPassword = hashutil(memberId, newPassword.trim());

      const requestBody = {
        oldHashedPassword,
        newHashedPassword,
        memberId,
      };

      const response = await fetch('http://localhost:8080/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        alert('Password changed successfully!');
        window.location.reload();
        onClose(); // Close dialog
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to change password.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while changing the password.');
    }
  };
  return (
    //isOpen -> open dialog
    isOpen && (
      <Dialog
        title="Change your password"
        content={
          <>
            <label htmlFor="oldPassword">Old Password</label><br />
            <div className="line2">
            <input
              type="password"
              placeholder="Enter your original password"
              id="oldPassword"
              className="new-input"
              value={oldPassword}
              onChange={(e) => 
                setOldPassword(e.target.value)
              }
            />
            </div>
            <label htmlFor="newPassword">New Password</label><br />
            <div className="line2">
            <input
              type="password"
              placeholder="Enter the new password"
              id="newPassword"
              className="new-input"
              value={newPassword}
              onChange={(e) => 
                setNewPassword(e.target.value)
              }
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

export default ChangePwd;
