import React, { useState } from 'react';
import GalleryDialog from './GalleryDialog';
import { checkAuth } from "../AuthTracker";

const ChangeGallery = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null); 
  const [fileName, setFileName] = useState('');
  const [isSaving, setIsSaving] = useState(false); 
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
    if (isSaving) return; // 이미 저장 중이라면 실행 막기
    setIsSaving(true); // 저장 중 상태로 설정
  
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
    }finally{
      setIsSaving(false);
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
              className="new-input" 
              onChange={handleFileChange} 
              />
            </div>
          </>
        }
        onClose={onClose}
        onSave={handleSave}
        isSaving = {isSaving}
      />
    )
  );
};

export default ChangeGallery;