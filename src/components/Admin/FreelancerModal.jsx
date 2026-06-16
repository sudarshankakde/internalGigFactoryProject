import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, FileText, Globe, ExternalLink } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { api } from '../../utils/api';
import { CompletionBar, STATUS_CFG, ActivityHistoryView } from '../AdminShared';


// Import Profile Detailed View subcomponents
import { ProfileHeader } from '../Profile/ProfileHeader';
import { ProfileStats } from '../Profile/ProfileStats';
import { ProfileAbout } from '../Profile/ProfileAbout';
import { WorkHistory } from '../Profile/WorkHistory';
import { CapabilityCloud } from '../Profile/CapabilityCloud';
import { ServiceSpecs } from '../Profile/ServiceSpecs';
import { DocumentsList } from '../Profile/DocumentsList';
import '../../pages/Profile/Profile.css';

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

const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const FreelancerModal = ({ freelancer, onClose }) => {
  const [suspendReason, setSuspendReason] = useState('');
  const [showSuspendInput, setShowSuspendInput] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const suspendMutation = useMutation({
    mutationFn: () => api.post(`/admin/users/${freelancer?.id}/suspend`, { reason: suspendReason }),
    onSuccess: (res) => {
      toast.success(res.message || 'Account suspended.');
      queryClient.invalidateQueries({ queryKey: ['admin-freelancers'] });
      if (freelancer) freelancer.account_status = 'suspended';
      setShowSuspendInput(false);
      setSuspendReason('');
    },
    onError: (err) => {
      toast.error(err.message || 'Suspension failed.');
    }
  });

  const reactivateMutation = useMutation({
    mutationFn: () => api.post(`/admin/users/${freelancer?.id}/unsuspend`),
    onSuccess: (res) => {
      toast.success(res.message || 'Account reactivated.');
      queryClient.invalidateQueries({ queryKey: ['admin-freelancers'] });
      if (freelancer) freelancer.account_status = 'approved';
    },
    onError: (err) => {
      toast.error(err.message || 'Reactivation failed.');
    }
  });

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => {
                onClose();
                navigate(`/admin/users/${freelancer.id}/profile`);
              }}
              style={{
                background: 'rgba(112,214,77,0.1)', border: '1px solid rgba(112,214,77,0.3)',
                color: '#70d64d', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              Open Full View <ExternalLink size={12} />
            </button>
            <button onClick={onClose} style={S.closeBtn}><X size={16} /></button>
          </div>
        </div>

        {/* Tab Strip */}
        <div style={{ display: 'flex', borderBottom: '1px solid #23232a', background: '#0c0c0e', padding: '0 24px' }}>
          <button 
            onClick={() => setActiveTab('overview')} 
            style={{
              background: 'transparent', border: 'none', borderBottom: activeTab === 'overview' ? '2px solid #70d64d' : '2px solid transparent',
              color: activeTab === 'overview' ? '#70d64d' : '#8a8a8a', padding: '12px 16px', fontSize: '0.85rem', fontWeight: activeTab === 'overview' ? 700 : 500, cursor: 'pointer', outline: 'none', transition: 'all 0.15s'
            }}
          >
            Admin Overview
          </button>
          <button 
            onClick={() => setActiveTab('profile')} 
            style={{
              background: 'transparent', border: 'none', borderBottom: activeTab === 'profile' ? '2px solid #70d64d' : '2px solid transparent',
              color: activeTab === 'profile' ? '#70d64d' : '#8a8a8a', padding: '12px 16px', fontSize: '0.85rem', fontWeight: activeTab === 'profile' ? 700 : 500, cursor: 'pointer', outline: 'none', transition: 'all 0.15s'
            }}
          >
            Detailed Profile View
          </button>
          <button 
            onClick={() => setActiveTab('activity')} 
            style={{
              background: 'transparent', border: 'none', borderBottom: activeTab === 'activity' ? '2px solid #70d64d' : '2px solid transparent',
              color: activeTab === 'activity' ? '#70d64d' : '#8a8a8a', padding: '12px 16px', fontSize: '0.85rem', fontWeight: activeTab === 'activity' ? 700 : 500, cursor: 'pointer', outline: 'none', transition: 'all 0.15s'
            }}
          >
            Activity & History
          </button>
        </div>

        {/* Content */}
        <div style={{ maxHeight: '68vh', overflowY: 'auto', padding: '24px' }}>
          
          {activeTab === 'overview' && (
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

                {/* Account Management Actions */}
                <div style={{ ...S.sectionCard, border: '1px solid #ef444433', background: '#1c0c0e' }}>
                  <p style={{ ...S.sectionTitle, color: '#ef4444', borderColor: '#ef444433' }}>Account Management</p>
                  {freelancer.account_status === 'suspended' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: 0 }}>This account is currently suspended.</p>
                      <button
                        disabled={reactivateMutation.isPending}
                        onClick={() => reactivateMutation.mutate()}
                        style={{ background: '#70d64d', color: '#000', border: 'none', borderRadius: '6px', padding: '10px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', textAlign: 'center', width: '100%' }}
                      >
                        {reactivateMutation.isPending ? 'Reactivating...' : 'REACTIVATE ACCOUNT'}
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {!showSuspendInput ? (
                        <button
                          onClick={() => setShowSuspendInput(true)}
                          style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', padding: '10px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', textAlign: 'center', width: '100%' }}
                        >
                          SUSPEND ACCOUNT
                        </button>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <input
                            type="text"
                            placeholder="Reason for suspension..."
                            value={suspendReason}
                            onChange={e => setSuspendReason(e.target.value)}
                            style={{ background: '#000', border: '1px solid #ef4444', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                          />
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => setShowSuspendInput(false)}
                              style={{ flex: 1, background: '#1c1c20', border: '1px solid #23232a', color: '#8a8a8a', borderRadius: '6px', padding: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              disabled={suspendMutation.isPending}
                              onClick={() => {
                                if (!suspendReason.trim()) {
                                  toast.error('Please enter a suspension reason.');
                                  return;
                                }
                                suspendMutation.mutate();
                              }}
                              style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              {suspendMutation.isPending ? 'Suspending...' : 'Confirm Suspend'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
                  <div style={S.row}><strong>Registered On:</strong> <span>{fmtDate(freelancer.created_at)}</span></div>
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
          )}

          {activeTab === 'profile' && (
            <div className="profile-workspace-view animate-fade-in" style={{ padding: '0', background: 'transparent' }}>
              <ProfileHeader
                isFreelancer={true}
                name={freelancer.full_name}
                avatar={freelancer.profile_photo}
                subtitle={fp.title}
                emailVal={freelancer.email}
                phoneVal={freelancer.mobile}
                locationVal={fp.city && fp.country ? `${fp.city}, ${fp.country}` : 'Not Specified'}
                webVal={fp.portfolio_url}
                initials={getInitials(freelancer.full_name)}
                availability={fp.availability}
                hideEditButton={true}
              />

              <ProfileStats
                isFreelancer={true}
                totalProjects={fp.total_projects}
                hourlyRate={fp.hourly_rate}
                commercialBasis={fp.commercial_basis}
              />

              <div className="profile-details-split-grid" style={{ marginTop: '20px' }}>
                <div className="profile-details-left-pane">
                  <ProfileAbout
                    isFreelancer={true}
                    bio={fp.bio}
                  />
                  <WorkHistory workHistory={freelancer.work_history} />
                </div>

                <div className="profile-details-right-pane">
                  <CapabilityCloud
                    isFreelancer={true}
                    skills={fp.freelancer_skills || []}
                  />
                  <ServiceSpecs serviceDetails={fp.service_details} />
                  <DocumentsList
                    isFreelancer={true}
                    resumeUrl={fp.resume_url}
                    verifications={freelancer.verifications}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <ActivityHistoryView id={freelancer.id} />
          )}

        </div>
      </div>
    </>
  );
};
export default FreelancerModal;
