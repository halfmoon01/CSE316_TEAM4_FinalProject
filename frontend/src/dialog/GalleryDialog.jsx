import React from 'react';
import "../css_files/dialog.css";

const Dialog = ({ title, content, onClose, onSave , isSaving}) => {
  return (
    <div className="dialog" onClick={onClose}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        {/* Close Icon */}
        <span className="close-icon" onClick={onClose}>
          &times;
        </span>
        <p className="dialog-title">{title}</p>
        <hr className="gallery-line"/>
        {content}
        <hr className="gallery-line"/>
        <div className="button-group">
          <button type="button" className="close-button" onClick={onClose}>
            Discard
          </button>
          <button type="button" className="save-button" onClick={onSave} disabled = {isSaving}>
            {isSaving ? "Saving.." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;