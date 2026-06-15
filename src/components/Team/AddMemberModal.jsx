import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export const AddMemberModal = ({ isOpen, onClose, formData, setFormData, onSubmit, isSaving, handleResumeChange }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="team-modal-overlay">
      <div className="team-modal-card">
        <div className="team-modal-header">
          <h2>Add Team Member</h2>
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
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@company.com"
              />
              <div className="field-hint-text">
                This member profile is for internal tracking only and will not have platform access.
              </div>
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="Enter phone number (e.g. +91 9876543210)"
              />
            </div>
            <div className="form-group">
              <label>Designation</label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Lead UI Designer"
              />
            </div>
            <div className="form-group">
              <label>Resume / CV (PDF, DOC, DOCX) *</label>
              <input
                type="file"
                required
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
              />
              <div className="field-hint-text">
                Upload the member's professional CV/Resume (Required).
              </div>
            </div>
          </div>
          <div className="team-modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={isSaving}>
              {isSaving ? 'Adding...' : 'Add Team Member'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
