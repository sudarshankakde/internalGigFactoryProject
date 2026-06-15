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
        <div className="empty-documents-status-placeholder" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p className="primary-empty-msg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} color="#70d64d" /> Resume Document
          </p>
          <a href={resumeUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: '#70d64d', textDecoration: 'underline', fontWeight: 600 }}>
            View Resume / CV
          </a>
        </div>
      ) : !isFreelancer && verifications && verifications.length > 0 ? (
        <div className="empty-documents-status-placeholder" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {verifications.map((v) => (
            <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: '#fff' }}>{v.document_type}</span>
              <span style={{ fontSize: '0.75rem', color: v.verification_status === 'verified' ? '#70d64d' : '#f59e0b' }}>
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
