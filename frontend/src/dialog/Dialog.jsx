import React from 'react';
import '@/css_files/Dialog.css';

const Dialog = ({ title, content, onClose, onSave , isSaving}) => {
  return (
    <div className="dialog" onClick={onClose}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        {/* Close Icon */}
        <span className="close-icon" onClick={onClose}>
          &times;
        </span>
        <p className="dialog-title">{title}</p>
        <hr className="line"/>
        {content}
        <hr className="line"/>
        <div className="button-group">
          <button type="button" className="close-button" onClick={onClose}>
            Close
          </button>
          <button type="button" className="save-button" onClick={onSave} disabled = {isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;