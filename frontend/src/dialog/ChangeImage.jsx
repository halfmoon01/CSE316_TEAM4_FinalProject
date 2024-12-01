import React, { useState } from 'react';
import Dialog from './Dialog';
import { checkAuth } from "../AuthTracker";
const ChangeImage = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [isSaving, setIsSaving] = useState(false); // State to track saving status
  const {memberId} = checkAuth();
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];  // Get the first selected file
    if (file) {
      // Validate if the selected file is an image
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file (e.g., .jpg, .png).");
        return;
      }
      setSelectedFile(file);
      setFileName(file.name); 
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      alert("Please select an image file.");
      return;
    }
    if (isSaving) return;  // Prevent multiple save actions
    setIsSaving(true);  // Set saving status to true
  
    const formData = new FormData();  // Create a FormData object for file upload
    formData.append("image", selectedFile);  // Append the selected file
    formData.append("id", memberId);  // Append the authenticated user ID
  
    try {
      const response = await fetch("http://localhost:8080/change-image", {
        method: "POST",
        body: formData, 
      });
  
      if (response.ok) {
        alert("Image changed successfully!");
        window.location.reload();  // Reload the page to reflect changes
        onClose(); 
      } else {
        const data = await response.json();
        alert(data.message || "Failed to change image.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while changing the image.");
    }finally {
      setIsSaving(false);  // Reset saving status
    }
  };
  
  return (
    //isOpen -> open dialog
     // Render the dialog only if `isOpen` is true
    isOpen && (
      <Dialog
        title="Change your image"
        content={
          <>
            <div className="line2">
            <input 
              type="file" 
              id="fileInput" 
              className="new-input" 
              onChange={handleFileChange} 
              accept="image/*" // Restrict file types to images
              />
            </div>
          </>
        }
        onClose={onClose}
        onSave={handleSave}
        isSaving = {isSaving} // Pass the saving state to the dialog
      />
    )
  );
};

export default ChangeImage;
