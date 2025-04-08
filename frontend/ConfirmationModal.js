import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Are you sure?</h2>
        <p>Do you want to log out?</p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="confirm-btn" onClick={onConfirm}>Log Out</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
