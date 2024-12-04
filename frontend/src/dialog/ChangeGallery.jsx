import React, { useState } from 'react';
import GalleryDialog from './GalleryDialog';

const ChangeGallery = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null); 
  const [fileName, setFileName] = useState('');
  const [isSaving, setIsSaving] = useState(false);  // State to track saving status
  
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file) {
      setSelectedFile(file); // Update the selected file state
      setFileName(file.name);  // Update the file name state
    }
  };
  
  const handleSave = async () => {
    if (!selectedFile) {
      alert("Please select an image file."); // Alert if no file is selected
      return;
    }
    if (isSaving) return;  // Prevent multiple save actions
    setIsSaving(true); // Set saving status to true
  
    const formData = new FormData();
    formData.append("image", selectedFile); 
  
    try {
      const response = await fetch("http://localhost:8080/add-image", {
        method: "POST",
        body: formData, 
      });
  
      if (response.ok) {
        alert("Image added successfully!");
        onClose();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to add image.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while adding the image.");
    }finally{
      setIsSaving(false);
      setSelectedFile(null);
    }
  };
  
  const handleClose = () => {
    setSelectedFile(null); // Reset selected file
    setFileName(''); // Reset file name
    onClose(); // Call the parent close handler
  };
  
  return (
    //isOpen -> open dialog
    // Render the dialog only if `isOpen` is true
    isOpen && (
      <GalleryDialog
        title="Add New Image"
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
        onClose={handleClose}
        onSave={handleSave}
        isSaving = {isSaving} // Pass the saving state to the dialog
      />
    )
  );
};

export default ChangeGallery;