import React from 'react';
import "../css_files/gallerydialog.css";

const GalleryDialog = ({ title, content, onClose, onSave }) => {
  return (
    <div className="dialog">
      <div className="content">
        <span className="close-icon" onClick={onClose}>&times;</span>
        <p className="dialog-title">{title}</p>
        <hr className="line"/>
        {content}
        <div className="button-group">
          <button type="button" className="close-button" onClick={onClose}>
            Discard
          </button>
          <button type="button" className="save-button" onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default GalleryDialog;