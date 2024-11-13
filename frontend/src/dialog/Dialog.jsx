import React from 'react';
import '@/css_files/Dialog.css';

const Dialog = ({ title, content, onClose, onSave }) => {
  return (
    <div className="dialog">
      <div className="content">
        <span className="close-icon" onClick={onClose}>&times;</span>
        <p className="dialog-title">{title}</p>
        <hr className="line"/>
        {content}
        <hr className="line"/>
        <div className="button-group">
          <button type="button" className="close-button" onClick={onClose}>
            Close
          </button>
          <button type="button" className="save-button" onClick={onSave}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;