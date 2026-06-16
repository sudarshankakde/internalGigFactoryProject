import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export const DeleteMemberModal = ({ isOpen, onClose, deletingMember, onSubmit, isSaving }) => {
  if (!isOpen || !deletingMember) return null;

  return createPortal(
    <div className="team-modal-overlay">
      <div className="team-modal-card">
        <div className="team-modal-header">
          <h2>Remove Team Member</h2>
          <button className="team-modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form className="team-modal-form" onSubmit={onSubmit}>
          <div className="team-modal-body">
            <p className="text-[#cbd5e1] text-[0.9rem] leading-[1.5] m-0">
              Are you sure you want to remove <strong>{deletingMember.full_name}</strong> from your agency team? This action will sever their association with your agency.
            </p>
          </div>
          <div className="team-modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save bg-[#ff4d4d] text-white" disabled={isSaving}>
              {isSaving ? 'Removing...' : 'Remove Member'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
