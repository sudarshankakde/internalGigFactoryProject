import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload } from 'lucide-react';

export const UploadDocumentModal = ({ onClose }) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !file) return;
    onSave({ name: name.trim(), url: URL.createObjectURL(file), uploadedAt: new Date().toISOString() });
    onClose();
  };

  return createPortal(
    <div className="profile-modal-overlay">
      <div className="profile-modal-card max-w-md">
        <div className="profile-modal-header">
          <h2>Upload Document</h2>
          <button type="button" className="profile-modal-close-btn" onClick={onClose}>&times;</button>
        </div>
        <form className="profile-modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Document Name</label>
            <input
              type="text"
              value={name}

              onChange={(e) => setName(e.target.value)}
              placeholder="Resume, PAN, Certification..."
              required
            />
          </div>
          <div className="form-group">
            <label>Upload File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="edit-profile-action-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="edit-profile-action-btn bg-[#70d64d] border-none text-black flex items-center gap-2">
              <Upload size={16} /> Upload
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
