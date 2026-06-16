import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Globe, Users, Briefcase, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { api } from '../../utils/api';
import { CompletionBar, STATUS_CFG, ActivityHistoryView } from '../AdminShared';


// Import Profile Detailed View subcomponents
import { ProfileHeader } from '../Profile/ProfileHeader';
import { ProfileStats } from '../Profile/ProfileStats';
import { ProfileAbout } from '../Profile/ProfileAbout';
import { TeamStructure } from '../Profile/TeamStructure';
import { CapabilityCloud } from '../Profile/CapabilityCloud';
import { ServiceSpecs } from '../Profile/ServiceSpecs';
import { DocumentsList } from '../Profile/DocumentsList';
import '../../pages/Profile/Profile.css';

const SERVICE_LABELS = {
  BIM: 'BIM & 2D Drafting',
  Audit: 'As-Built Audit',
  Peer: 'Peer Review',
  BOQ: 'BOQ Creation',
  Viz: '3D Visualisation',
};

const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};


const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

function AgencyLogo({ name, logo, size = 42 }) {
  const initials = name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
  return logo ? (
    <img src={logo} alt={name} style={{ width: size, height: size, borderRadius: '8px', objectFit: 'cover', flexShrink: 0, border: '1px solid #23232a', background: '#1c1c20' }} />
  ) : (
    <div style={{ width: size, height: size, borderRadius: '8px', background: 'linear-gradient(135deg,#2e1065,#4c1d95)', border: '1px solid #3b2a6a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${size * 0.3}px`, fontWeight: 800, color: '#c084fc', flexShrink: 0 }}>
      {initials}
    </div>
  );
}

export const AgencyModal = ({ agency, onClose }) => {
  const [suspendReason, setSuspendReason] = useState('');
  const [showSuspendInput, setShowSuspendInput] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const suspendMutation = useMutation({
    mutationFn: () => api.post(`/admin/users/${agency?.id}/suspend`, { reason: suspendReason }),
    onSuccess: (res) => {
      toast.success(res.message || 'Account suspended.');
      queryClient.invalidateQueries({ queryKey: ['admin-agencies'] });
      if (agency) agency.account_status = 'suspended';
      setShowSuspendInput(false);
      setSuspendReason('');
    },
    onError: (err) => {
      toast.error(err.message || 'Suspension failed.');
    }
  });

  const reactivateMutation = useMutation({
    mutationFn: () => api.post(`/admin/users/${agency?.id}/unsuspend`),
    onSuccess: (res) => {
      toast.success(res.message || 'Account reactivated.');
      queryClient.invalidateQueries({ queryKey: ['admin-agencies'] });
      if (agency) agency.account_status = 'approved';
    },
    onError: (err) => {
      toast.error(err.message || 'Reactivation failed.');
    }
  });

  if (!agency) return null;
  const ap = agency.agency_profile || {};

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

  const statusCfg = STATUS_CFG[agency.account_status] || STATUS_CFG.pending;

  return (
    <>
      <div onClick={onClose} style={S.overlay} />
      <div style={S.modal}>
        {/* Header */}
        <div style={S.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <AgencyLogo name={ap?.agency_name || agency.full_name} logo={ap?.logo} size={50} />
            <div>
              <h2 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>
                {ap?.agency_name || agency.full_name}
              </h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ ...S.badge, background: statusCfg.bg, color: statusCfg.color }}>
                  {agency.account_status?.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {agency.is_verified ? '✓ VERIFIED AGENCY' : 'UNVERIFIED AGENCY'}
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => {
                onClose();
                navigate(`/admin/users/${agency.id}/profile`);
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
              {/* Description */}
              <div style={S.sectionCard}>
                <p style={S.sectionTitle}>Agency Description</p>
                <p style={{ color: '#8a8a8a', fontSize: '0.88rem', lineHeight: '1.5', margin: 0 }}>
                  {ap.description || 'No description provided.'}
                </p>
              </div>

              {/* Profile Overview */}
              <div style={S.sectionCard}>
                <p style={S.sectionTitle}>Business Overview</p>
                <div style={S.row}><strong>Primary Industry:</strong> <span>{ap.industry || '—'}</span></div>
                <div style={S.row}><strong>Founded Year:</strong> <span>{ap.founded_year || '—'}</span></div>
                <div style={S.row}><strong>Employee Count:</strong> <span>{ap.employee_count ? `${ap.employee_count} Employees` : '—'}</span></div>
                <div style={S.row}><strong>Office Location:</strong> <span>{ap.address || '—'}</span></div>
                {ap.gst_number && <div style={S.row}><strong>GSTIN / Tax ID:</strong> <span style={{ textTransform: 'uppercase' }}>{ap.gst_number}</span></div>}
                {ap.cin && <div style={S.row}><strong>Corporate Identification (CIN):</strong> <span style={{ textTransform: 'uppercase' }}>{ap.cin}</span></div>}
                {ap.company_pan && <div style={S.row}><strong>Company PAN:</strong> <span style={{ textTransform: 'uppercase' }}>{ap.company_pan}</span></div>}
              </div>

              {/* Team Members List */}
              <div style={S.sectionCard}>
                <p style={S.sectionTitle}>Team Members ({ap.team_members?.length || 0})</p>
                {(!ap.team_members || ap.team_members.length === 0) ? (
                  <p style={{ color: '#6b7280', fontSize: '0.8rem', fontStyle: 'italic', margin: 0 }}>
                    No team members listed for this agency.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {ap.team_members.map((member) => (
                      <div
                        key={member.id}
                        style={{
                          background: '#121215',
                          border: '1px solid #23232a',
                          borderRadius: '8px',
                          padding: '12px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <strong style={{ color: '#fff', fontSize: '0.88rem' }}>{member.full_name}</strong>
                            <p style={{ color: '#c084fc', fontSize: '0.72rem', fontWeight: 600, margin: '2px 0 0' }}>
                              {member.designation?.toUpperCase() || 'TEAM MEMBER'}
                            </p>
                          </div>
                          <span
                            style={{
                              background: member.status === 'active' ? 'rgba(112,214,77,0.1)' : 'rgba(245,158,11,0.1)',
                              color: member.status === 'active' ? '#70d64d' : '#f59e0b',
                              fontSize: '0.62rem',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              textTransform: 'uppercase'
                            }}
                          >
                            {member.status || 'ACTIVE'}
                          </span>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderTop: '1px solid #1a1a22', paddingTop: '8px', marginTop: '2px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8a8a8a', fontSize: '0.75rem', overflow: 'hidden' }}>
                            <Mail size={11} color="#6b7280" style={{ flexShrink: 0 }} />
                            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={member.email}>
                              {member.email}
                            </span>
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8a8a8a', fontSize: '0.75rem' }}>
                            <Phone size={11} color="#6b7280" style={{ flexShrink: 0 }} />
                            <span>{member.mobile || '—'}</span>
                          </span>
                        </div>

                        {member.resume_url && (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px dashed #1a1a22', paddingTop: '6px', marginTop: '2px' }}>
                            <a
                              href={member.resume_url}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                color: '#70d64d',
                                fontSize: '0.72rem',
                                textDecoration: 'none',
                                fontWeight: 700
                              }}
                            >
                              View CV / Resume <ExternalLink size={10} />
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              {/* Account Management Actions */}
              <div style={{ ...S.sectionCard, border: '1px solid #ef444433', background: '#1c0c0e', marginTop: '16px' }}>
                <p style={{ ...S.sectionTitle, color: '#ef4444', borderColor: '#ef444433' }}>Account Management</p>
                {agency.account_status === 'suspended' ? (
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
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Statistics */}
              <div style={S.sectionCard}>
                <p style={S.sectionTitle}>Stats & Quality Rating</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ background: '#121215', border: '1px solid #23232a', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>TEAM SIZE</p>
                    <p style={{ fontSize: '1.1rem', color: '#c084fc', fontWeight: 800, margin: '4px 0 0' }}>{ap?._count?.team_members ?? ap?.employee_count ?? 0}</p>
                  </div>
                  <div style={{ background: '#121215', border: '1px solid #23232a', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>PROJECTS</p>
                    <p style={{ fontSize: '1.1rem', color: '#70d64d', fontWeight: 800, margin: '4px 0 0' }}>{ap.total_projects ?? 0}</p>
                  </div>
                </div>
                <div style={S.row}><strong>Rating:</strong> <span>{ap.rating ? `★ ${ap.rating}` : '—'}</span></div>
                <div style={S.row}><strong>Completed Projects:</strong> <span>{ap.total_completed_projects ?? '—'}</span></div>
                <div style={{ marginTop: '12px' }}>
                  <CompletionBar value={ap.profile_completion || 0} />
                </div>
              </div>

              {/* Point of Contact & Info */}
              <div style={S.sectionCard}>
                <p style={S.sectionTitle}>Point of Contact</p>
                <div style={S.row}><strong>Authorized Signee:</strong> <span>{agency.full_name}</span></div>
                <div style={S.row}><strong>Email:</strong> <span>{agency.email}</span></div>
                <div style={S.row}><strong>Phone:</strong> <span>{agency.mobile || '—'}</span></div>
                <div style={S.row}><strong>Location:</strong> <span>{ap.city && ap.country ? `${ap.city}, ${ap.country}` : '—'}</span></div>
                <div style={S.row}><strong>Registered On:</strong> <span>{fmtDate(agency.created_at)}</span></div>
                <div style={S.row}><strong>Last Login:</strong> <span>{fmtDate(agency.last_login)}</span></div>
              </div>

              {/* Links */}
              <div style={S.sectionCard}>
                <p style={S.sectionTitle}>Corporate Links</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {ap.website && (
                    <a
                      href={ap.website}
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
                      <Globe size={14} /> Visit Corporate Website <ExternalLink size={11} color="#000" />
                    </a>
                  )}
                  {ap.linkedin_url && (
                    <a
                      href={ap.linkedin_url}
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
                isFreelancer={false}
                name={ap.agency_name || agency.full_name}
                avatar={ap.logo}
                subtitle={ap.industry || 'Digital Services Agency'}
                emailVal={agency.email}
                phoneVal={agency.mobile}
                locationVal={ap.city && ap.country ? `${ap.city}, ${ap.country}` : 'Not Specified'}
                webVal={ap.website}
                foundedYear={ap.founded_year}
                initials={getInitials(ap.agency_name || agency.full_name)}
                hideEditButton={true}
              />

              <ProfileStats
                isFreelancer={false}
                totalProjects={ap.total_projects}
                commercialBasis={ap.commercial_basis}
                employeeCount={ap.employee_count}
              />

              <div className="profile-details-split-grid" style={{ marginTop: '20px' }}>
                <div className="profile-details-left-pane">
                  <ProfileAbout
                    isFreelancer={false}
                    description={ap.description}
                  />
                  <TeamStructure employeeCount={ap.employee_count} />
                </div>

                <div className="profile-details-right-pane">
                  <CapabilityCloud
                    isFreelancer={false}
                    skills={(ap.service_details?.selectedServices || []).map(code => ({ skill_name: SERVICE_LABELS[code] || code }))}
                  />
                  <ServiceSpecs serviceDetails={ap.service_details} />
                  <DocumentsList
                    isFreelancer={false}
                    verifications={agency.verifications}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <ActivityHistoryView id={agency.id} />
          )}

        </div>
      </div>
    </>
  );
};

export default AgencyModal;

