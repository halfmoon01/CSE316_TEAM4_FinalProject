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
        body: JSON.stringify({ newName, memberId}),
      });
  
      if (response.ok) {
        alert('Name changed successfully!');
        window.location.reload();
        onClose();
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
    isOpen && (
      <Dialog
        title="Change your name"
        content={
          <>
            <label htmlFor="newName">New Name</label><br />
            <div className="line2">
            <input
              type="text"
              placeholder="Enter the new name"
              id="newName"
              className="new-input"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
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
