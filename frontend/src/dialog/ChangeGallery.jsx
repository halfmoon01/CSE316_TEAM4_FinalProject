import React, { useState } from 'react';
import GalleryDialog from './GalleryDialog';
import { checkAuth } from "../AuthTracker";

const ChangeGallery = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null); 
  const [fileName, setFileName] = useState('');
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
  
    try {
      const response = await fetch("http://localhost:8080/add-image", {
        method: "POST",
        body: formData, 
      });
  
      if (response.ok) {
        const data = await response.json();
        alert("Image added successfully!");
        window.location.reload();
        onClose(); 
      } else {
        const data = await response.json();
        alert(data.message || "Failed to add image.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while adding the image.");
    }
  };
  
  
  return (
    //isOpen -> open dialog
    isOpen && (
      <GalleryDialog
        title="Add New Image"
        content={
          <>
            <div className="line2">
              <input 
              type="file" 

              id="fileInput" 
              className="file-select" 
              onChange={handleFileChange} 
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

export default ChangeGallery;