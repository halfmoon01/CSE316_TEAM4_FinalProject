import React from 'react';
import "../css_files/dialog.css";

const Dialog = ({ title, content, onClose, onSave , isSaving}) => {
  return (
    <div className="dialog" onClick={onClose}>
      {/* Dialog box content */}
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        {/* Close Icon */}
        <span className="close-icon" onClick={onClose}>
          &times;  {/* Unicode character for "X" to close */}
        </span>
        {/* Dialog Title */}
        <p className="dialog-title">{title}</p>
         {/* Divider line */}
        <hr className="gallery-line"/>
        {/* Dynamic Content */}
        {content}
        <hr className="gallery-line"/>
        {/* Button Group */}
        <div className="button-group">
          {/* Discard Button */}
          <button type="button" className="close-button" onClick={onClose}>
            Discard {/* Text for the discard button */}
          </button>
          {/* Save Button */}
          <button 
            type="button" 
            className="save-button" 
            onClick={onSave} 
            disabled = {isSaving} // Disable button while saving
            >
            {isSaving ? "Saving.." : "Save"} {/* Dynamic text based on saving state */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;