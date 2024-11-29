import React, { useState } from 'react';
import Dialog from './Dialog';
import { checkAuth } from "../AuthTracker";


const ChangePhone = ({ isOpen, onClose }) => {
  const [newPhone, setNewPhone] = useState('');
  const { memberId } = checkAuth(); 

  const handleSave = async () => {
    if (!newPhone.trim()) {
      alert('Phone number cannot be empty');
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/change-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPhone, memberId }),
      });

      if (response.ok) {
        alert('Phone number changed successfully!');
        window.location.reload();
        onClose(); 
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to change phone number.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while changing the phone number.');
    }
  };

  return (
    isOpen && (
      <Dialog
        title="Change your Phone Number"
        content={
          <>
            <div className="line2">
              <input
                type="tel"
                placeholder="Enter the new phone number"
                id="newPhone"
                className="new-input"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
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

export default ChangePhone;
