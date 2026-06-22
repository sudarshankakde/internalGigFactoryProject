import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, FileText } from 'lucide-react';
import { DesignationSelect } from './DesignationSelect';

export const EditMemberModal = ({ isOpen, onClose, editingMember, setEditingMember, onSubmit, isSaving, handleEditResumeChange }) => {
  if (!isOpen || !editingMember) return null;

  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const numBytes = Number(bytes);
    if (isNaN(numBytes)) return 'N/A';
    if (numBytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(numBytes) / Math.log(k));
    return parseFloat((numBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleEditResumeChange({ target: { files: [file] } });
    }
  };

  return createPortal(
    <div className="team-modal-overlay">
      <div className="team-modal-card">
        <div className="team-modal-header">
          <h2>Edit Team Member</h2>
          <button type="button" className="team-modal-close-btn" onClick={onClose}>
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
              <div 
                className={`dropzone-container border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[120px] ${
                  isDragActive ? 'border-[#b5ff14] bg-[#b5ff14]/5' : 'border-[#23232a] bg-[#1c1c22] hover:border-white/20'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleEditResumeChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                
                {editingMember.resumeFile ? (
                  <div className="flex flex-col items-center gap-1">
                    <FileText size={28} className="text-[#b5ff14]" />
                    <span className="text-[0.8rem] font-bold text-white max-w-[240px] truncate">
                      {editingMember.resumeFile.name}
                    </span>
                    <span className="text-[0.68rem] text-[#6c727f]">
                      {formatFileSize(editingMember.resumeFile.size)}
                    </span>
                    <button 
                      type="button" 
                      className="mt-1 text-[0.72rem] text-[#b5ff14] hover:underline bg-transparent border-none cursor-pointer font-bold"
                    >
                      Click to replace resume
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-[#8a8f98]">
                    <Plus size={24} strokeWidth={1.5} />
                    <span className="text-[0.8rem] font-medium text-white">
                      Drag &amp; drop new resume file here, or <span className="text-[#b5ff14] font-semibold hover:underline">browse</span>
                    </span>
                    <span className="text-[0.68rem] text-gray-500">
                      Upload a new CV/Resume to replace the existing one (optional).
                    </span>
                  </div>
                )}
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
