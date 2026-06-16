import React from 'react';
import { Mail, Phone, Calendar, FileText, Edit2, Trash2 } from 'lucide-react';

const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const MemberCard = ({ member, onEdit, onDelete }) => {
  const userName = member.full_name || 'Placeholder User';
  const userEmail = member.email || 'N/A';
  const userPhone = member.mobile || 'Not Provided';

  return (
    <div className="member-card">
      <div className="member-card-header">
        <div className="member-avatar">
          {getInitials(userName)}
        </div>
        <div className="member-identity">
          <h3 className="member-name">{userName}</h3>
          <span className="designation-badge">{member.designation || 'Team Member'}</span>
        </div>
      </div>

      <div className="member-details-list">
        <div className="detail-item" title={userEmail}>
          <Mail size={14} />
          <span className="detail-text">{userEmail}</span>
        </div>
        <div className="detail-item">
          <Phone size={14} />
          <span className="detail-text">{userPhone}</span>
        </div>
        <div className="detail-item">
          <Calendar size={14} />
          <span className="detail-text">Added: {formatDate(member.joined_at)}</span>
        </div>
        {member.resume_url && (
          <div className="detail-item">
            <FileText size={14} />
            <a
              href={member.resume_url}
              download={`${userName.replace(/\s+/g, '_')}_Resume`}
              target="_blank"
              rel="noreferrer"
              className="detail-text"
              style={{ color: '#b5ff14', textDecoration: 'underline', fontWeight: '600' }}
            >
              View CV / Resume
            </a>
          </div>
        )}
      </div>

      <div className="member-card-actions">
        <button className="card-action-btn" onClick={() => onEdit(member)}>
          <Edit2 size={12} />
          <span>Edit Details</span>
        </button>
        <button className="card-action-btn danger-btn" onClick={() => onDelete(member)}>
          <Trash2 size={12} />
          <span>Remove</span>
        </button>
      </div>

      <div className="member-status-indicator">
        <span className={`status-dot-badge ${member.status === 'active' ? 'active' : 'pending'}`}>
          {member.status || 'active'}
        </span>
      </div>
    </div>
  );
};
