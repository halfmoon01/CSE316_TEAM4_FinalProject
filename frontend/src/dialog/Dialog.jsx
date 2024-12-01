import React from 'react';
import '@/css_files/Dialog.css';

const Dialog = ({ title, content, onClose, onSave , isSaving}) => {
  return (
    <div className="dialog" onClick={onClose}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        {/* Close Icon */}
        <span className="close-icon" onClick={onClose}>
          &times; {/* Unicode character for "X" */}
        </span>
         {/* Dialog Title */}
        <p className="dialog-title">{title}</p>
        {/* Divider Line */}
        <hr className="line"/>
        {/* Dialog Content */}
        {content}
        <hr className="line"/>
        {/* Button Group */}
        <div className="button-group">
          {/* Save Button */}
          <button type="button" className="close-button" onClick={onClose}>
            Close
          </button>
          <button 
            type="button" 
            className="save-button" 
            onClick={onSave} 
            disabled = {isSaving} // Disable the button while saving
            > 
          {isSaving ? "Saving..." : "Save changes"} {/* Dynamic text based on saving state */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;