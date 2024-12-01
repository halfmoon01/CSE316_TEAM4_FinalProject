import React, { useState } from 'react';
import Dialog from './Dialog';
import { checkAuth } from "../AuthTracker";


const ChangePhone = ({ isOpen, onClose }) => {
  const [newPhone, setNewPhone] = useState('');
  const { memberId } = checkAuth(); 

  const handleSave = async () => {
    // Regular expression to validate Korean phone number format
    const phoneRegex = /^[0-9]{3}-[0-9]{4}-[0-9]{4}$/;
    if (!phoneRegex.test(newPhone)) {
      alert("Please enter a valid phone number (e.g., 010-1234-5678)."); // Alert for invalid phone number
    return; 
  }

    if (!newPhone.trim()) {
      alert('Phone number cannot be empty'); // Alert if the phone number is empty
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
        alert('Phone number changed successfully!'); // Notify the user of success
        window.location.reload(); // Reload the page to reflect changes
        onClose(); 
      } else {
        // Handle unsuccessful responses
        const data = await response.json();
        alert(data.message || 'Failed to change phone number.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while changing the phone number.');
    }
  };

  return (
    // Render the dialog only if `isOpen` is true
    isOpen && (
      <Dialog
        title="Change your Phone Number"
        content={
          <>
            <div className="line2">
              <input
                type="tel"
                placeholder="Enter the new phone number (e.g., 010-1234-5678)"
                id="newPhone"
                className="new-input"
                value={newPhone}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^[0-9-]*$/.test(input)) {
                    setNewPhone(input); // Allow only numbers and hyphens
                  }
                }}
                pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}" // Pattern to validate Korean phone number format
                required
              />
               {/* Inline validation message for invalid phone number format */}
              {!/^[0-9]{3}-[0-9]{4}-[0-9]{4}$/.test(newPhone) && newPhone.length > 0 && (
              <p style={{ color: "red" }}>Invalid phone number format. Use 010-1234-5678.</p>
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

export default ChangePhone;
