import React from 'react';
import { X, FileText, Globe, ExternalLink } from 'lucide-react';
import { CompletionBar, STATUS_CFG } from '../AdminShared';

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

function Avatar({ name, photo, size = 40 }) {
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  return photo ? (
    <img src={photo} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid #23232a' }} />
  ) : (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg,#1e293b,#2563eb22)', border: '1px solid #23232a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${size * 0.35}px`, fontWeight: 800, color: '#38bdf8', flexShrink: 0 }}>
      {initials}
    </div>
  );
}

export const FreelancerModal = ({ freelancer, onClose }) => {
  if (!freelancer) return null;
  const fp = freelancer.freelancer_profile || {};
  const skills = fp?.freelancer_skills?.map(s => s.skill_name) || [];

  const S = {
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', zIndex: 600 },
    modal: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '90vw', maxWidth: '800px', background: '#121215', border: '1px solid #23232a', borderRadius: '12px', overflow: 'hidden', zIndex: 601, boxShadow: '0 20px 60px rgba(0,0,0,0.8)', animation: 'modalIn 0.2s ease-out' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderBottom: '1px solid #23232a', background: '#0c0c0e' },
    sectionCard: { background: '#0c0c0e', border: '1px solid #23232a', borderRadius: '8px', padding: '18px' },
    sectionTitle: { fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#70d64d', margin: '0 0 14px', paddingBottom: '6px', borderBottom: '1px solid #23232a' },
    row: { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: '1px solid #1a1a22', padding: '7px 0', color: '#d1d5db' },
    closeBtn: { background: 'transparent', border: '1px solid #23232a', color: '#8a8a8a', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
    badge: { display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 },
  };

  const statusCfg = STATUS_CFG[freelancer.account_status] || STATUS_CFG.pending;

  return (
    <>
      <div onClick={onClose} style={S.overlay} />
      <div style={S.modal}>
        {/* Header */}
        <div style={S.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Avatar name={freelancer.full_name} photo={freelancer.profile_photo} size={50} />
            <div>
              <h2 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>
                {freelancer.full_name}
              </h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ ...S.badge, background: statusCfg.bg, color: statusCfg.color }}>
                  {freelancer.account_status?.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {freelancer.is_verified ? '✓ VERIFIED USER' : 'UNVERIFIED USER'}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={S.closeBtn}><X size={16} /></button>
        </div>

        {/* Content */}
        <div style={{ maxHeight: '68vh', overflowY: 'auto', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
            
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* About */}
              <div style={S.sectionCard}>
                <p style={S.sectionTitle}>About / Bio</p>
                <p style={{ color: '#8a8a8a', fontSize: '0.88rem', lineHeight: '1.5', margin: 0 }}>
                  {fp.bio || 'No bio provided.'}
                </p>
              </div>

              {/* Profile Details */}
              <div style={S.sectionCard}>
                <p style={S.sectionTitle}>Profile Overview</p>
                <div style={S.row}><strong>Designation:</strong> <span>{fp.title || '—'}</span></div>
                <div style={S.row}><strong>Experience:</strong> <span>{fp.experience_years ? `${fp.experience_years} Years` : '—'}</span></div>
                <div style={S.row}><strong>Availability:</strong> <span style={{ color: fp.availability === 'AVAILABLE' ? '#70d64d' : '#8a8a8a' }}>{fp.availability || '—'}</span></div>
                <div style={S.row}><strong>Notice Period:</strong> <span>{fp.notice_period || '—'}</span></div>
                <div style={S.row}><strong>Commercial Basis:</strong> <span>{fp.commercial_basis || '—'}</span></div>
                {fp.legal_name_pan && <div style={S.row}><strong>Legal Name (PAN):</strong> <span>{fp.legal_name_pan}</span></div>}
                {fp.personal_pan && <div style={S.row}><strong>Personal PAN:</strong> <span style={{ textTransform: 'uppercase' }}>{fp.personal_pan}</span></div>}
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Key Rates & Stats */}
              <div style={S.sectionCard}>
                <p style={S.sectionTitle}>Rates & Completion</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>HOURLY RATE</span>
                  <span style={{ fontSize: '1.2rem', color: '#70d64d', fontWeight: 800 }}>{fp.hourly_rate ? `₹${fp.hourly_rate}/hr` : '—'}</span>
                </div>
                <CompletionBar value={fp.profile_completion || 0} />
              </div>

              {/* Contact Information */}
              <div style={S.sectionCard}>
                <p style={S.sectionTitle}>Contact Info</p>
                <div style={S.row}><strong>Email:</strong> <span>{freelancer.email}</span></div>
                <div style={S.row}><strong>Phone:</strong> <span>{freelancer.mobile || '—'}</span></div>
                <div style={S.row}><strong>Location:</strong> <span>{fp.city && fp.country ? `${fp.city}, ${fp.country}` : '—'}</span></div>
                <div style={S.row}><strong>Joined Date:</strong> <span>{fmtDate(freelancer.created_at)}</span></div>
                <div style={S.row}><strong>Last Login:</strong> <span>{fmtDate(freelancer.last_login)}</span></div>
              </div>

              {/* Skills */}
              <div style={S.sectionCard}>
                <p style={S.sectionTitle}>Skills</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {skills.map(s => (
                    <span key={s} style={{ background: '#1e293b', color: '#38bdf8', fontSize: '0.72rem', fontWeight: 600, padding: '3px 8px', borderRadius: '4px' }}>
                      {s}
                    </span>
                  ))}
                  {skills.length === 0 && <span style={{ color: '#4b4b57', fontSize: '0.8rem', fontStyle: 'italic' }}>No skills listed.</span>}
                </div>
              </div>

              {/* Documents & Links */}
              <div style={S.sectionCard}>
                <p style={S.sectionTitle}>Links & Attachments</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {fp.resume_url && (
                    <a
                      href={fp.resume_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        background: '#70d64d',
                        color: '#000',
                        textDecoration: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        padding: '8px',
                        borderRadius: '6px',
                        textAlign: 'center'
                      }}
                    >
                      <FileText size={14} /> View Resume / CV
                    </a>
                  )}
                  {fp.portfolio_url && (
                    <a
                      href={fp.portfolio_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        border: '1px solid #23232a',
                        color: '#fff',
                        textDecoration: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        padding: '8px',
                        borderRadius: '6px',
                        textAlign: 'center',
                        background: '#0c0c0e'
                      }}
                    >
                      <Globe size={14} /> Portfolio Site <ExternalLink size={11} />
                    </a>
                  )}
                  {fp.linkedin_url && (
                    <a
                      href={fp.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        border: '1px solid #23232a',
                        color: '#fff',
                        textDecoration: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        padding: '8px',
                        borderRadius: '6px',
                        textAlign: 'center',
                        background: '#0c0c0e'
                      }}
                    >
                      LinkedIn Profile <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
};
export default FreelancerModal;
