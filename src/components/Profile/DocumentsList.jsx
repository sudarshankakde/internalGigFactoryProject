import React from 'react';
import { Plus, FileText } from 'lucide-react';

export const DocumentsList = ({ isFreelancer, resumeUrl, verifications }) => {
  return (
    <div className="pane-content-card">
      <div className="card-header-flex-row">
        <h3>{isFreelancer ? 'Verified Documents' : 'Agency Documents'}</h3>
        <button className="add-document-action-trigger">
          <Plus size={14} /> Add
        </button>
      </div>

      {isFreelancer && resumeUrl ? (
        <div className="empty-documents-status-placeholder text-left flex flex-col gap-2">
          <p className="primary-empty-msg flex items-center gap-2">
            <FileText size={16} color="#70d64d" /> Resume Document
          </p>
          <a href={resumeUrl} target="_blank" rel="noreferrer" className="text-[0.85rem] text-[#70d64d] underline font-semibold">
            View Resume / CV
          </a>
        </div>
      ) : !isFreelancer && verifications && verifications.length > 0 ? (
        <div className="empty-documents-status-placeholder text-left flex flex-col gap-2">
          {verifications.map((v) => (
            <div key={v.id} className="flex justify-between border-b border-white/5 pb-1.5">
              <span className="text-[0.85rem] text-white">{v.document_type}</span>
              <span className={`text-[0.75rem] ${v.verification_status === 'verified' ? 'text-[#70d64d]' : 'text-[#f59e0b]'}`}>
                {v.verification_status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-documents-status-placeholder">
          <p className="primary-empty-msg">
            {isFreelancer ? 'No documents uploaded yet' : 'No legal documents uploaded yet'}
          </p>
          <p className="secondary-empty-msg">
            {isFreelancer ? 'Upload resumes, certifications, or identity documentation files.' : 'Upload verification NDAs, MSAs, or W9 tax files here.'}
          </p>
        </div>
      )}
    </div>
  );
};
