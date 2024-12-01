import React, { useState } from 'react';
import Dialog from './Dialog';
import { checkAuth } from "../AuthTracker";


const ChangeName = ({ isOpen, onClose }) => {
  const [newName, setNewName] = useState('');
  const {memberId} = checkAuth();
  
  const handleSave = async () => {
    if(!newName.trim()){
      alert('Name cannot be empty');
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/change-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newName, memberId}), // Include the new name and user ID in the request body
      });
  
      if (response.ok) {
        alert('Name changed successfully!');
        window.location.reload(); // Reload the page to reflect changes
        onClose(); // Close the dialog
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to change name.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while changing the name.');
    }
  }

  return (
     // Render the dialog only if `isOpen` is true
    isOpen && (
      <Dialog
        title="Change your name"
        content={
          <>
            <div className="line2">
            <input
              type="text"
              placeholder="Enter the new name"
              id="newName"
              className="new-input"
              value={newName}
              onChange={(e) => setNewName(e.target.value)} // Update state on input change
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

export default ChangeName;
