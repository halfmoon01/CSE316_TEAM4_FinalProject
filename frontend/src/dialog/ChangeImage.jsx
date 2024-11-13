import React, { useState } from 'react';
import Dialog from './Dialog';
import { checkAuth } from "../AuthTracker";
const ChangeImage = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const {memberId} = checkAuth();
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name); 
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      alert("Please select an image file.");
      return;
    }
  
    const formData = new FormData();
    formData.append("image", selectedFile); 
    formData.append("id", memberId); 
  
    try {
      const response = await fetch("http://localhost:8080/change-image", {
        method: "POST",
        body: formData, 
      });
  
      if (response.ok) {
        alert("Image changed successfully!");
        window.location.reload();
        onClose(); 
      } else {
        const data = await response.json();
        alert(data.message || "Failed to change image.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while changing the image.");
    }
  };
  
  return (
    //isOpen -> open dialog
    isOpen && (
      <Dialog
        title="Change your image"
        content={
          <>
            <label>New Image</label><br />
            <div className="line2">
              <label htmlFor="fileInput" className="choose-file">Choose File</label>
              <input type="file" id="fileInput" className="file-select" onChange={handleFileChange} />
              <span id="fileName">{fileName}</span>
            </div>
          </>
        }
        onClose={onClose}
        onSave={handleSave}
      />
    )
  );
};

export default ChangeImage;
