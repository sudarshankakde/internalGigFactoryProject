import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { DesignationSelect } from './DesignationSelect';

export const EditMemberModal = ({ isOpen, onClose, editingMember, setEditingMember, onSubmit, isSaving, handleEditResumeChange }) => {
  if (!isOpen || !editingMember) return null;

  return createPortal(
    <div className="team-modal-overlay">
      <div className="team-modal-card">
        <div className="team-modal-header">
          <h2>Edit Team Member</h2>
          <button className="team-modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form className="team-modal-form" onSubmit={onSubmit}>
          <div className="team-modal-body">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                disabled
                value={editingMember.email}
                placeholder="name@company.com"
              />
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                value={editingMember.fullName}
                onChange={(e) => setEditingMember({ ...editingMember, fullName: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                required
                value={editingMember.mobile}
                onChange={(e) => setEditingMember({ ...editingMember, mobile: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            <div className="form-group">
              <label>Designation</label>
              <DesignationSelect
                value={editingMember.designation}
                onChange={(val) => setEditingMember({ ...editingMember, designation: val })}
                placeholder="Select or type designation…"
              />
            </div>
            <div className="form-group">
              <label>Update Resume / CV (PDF, DOC, DOCX)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleEditResumeChange}
              />
              <div className="field-hint-text">
                Upload a new CV/Resume to replace the existing one (optional).
              </div>
            </div>
          </div>
          <div className="team-modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
