import React, { useState } from 'react';
import { X, Check, AlertCircle, Users, Building2, FileText, Clock } from 'lucide-react';
import { StatusBadge } from '../AdminShared';

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const ROLE_STYLES = {
  freelancer: { bg: '#1e293b', color: '#38bdf8' },
  agency:     { bg: '#2e1065', color: '#c084fc' },
};

function RoleChip({ role }) {
  const r = ROLE_STYLES[role] || ROLE_STYLES.freelancer;
  return (
    <span style={{ background: r.bg, color: r.color, fontSize: '0.68rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
      {role?.toUpperCase()}
    </span>
  );
}

export const RegistrationRequestDetailModal = ({ request, historyData, isLoadingHistory, onClose, onApprove, onReject, onUpdateDecision, isPending }) => {
  if (!request) return null;
  const app = request.application_data || {};
  const [isEditingDecision, setIsEditingDecision] = useState(false);
  const [newStatus, setNewStatus] = useState(request.status);
  const [rejectReason, setRejectReason] = useState(request.rejection_reason || '');
  const [noReason, setNoReason] = useState(false);
  const [cooldownOption, setCooldownOption] = useState('30');
  const [customDate, setCustomDate] = useState('');

  const handleOpenEditDecision = () => {
    setNewStatus(request.status);
    setRejectReason(request.rejection_reason || '');
    setIsEditingDecision(true);
    if (request.can_reapply_at) {
      const diffDays = Math.ceil((new Date(request.can_reapply_at) - Date.now()) / (1000 * 60 * 60 * 24));
      if ([7, 14, 30, 90].includes(diffDays)) setCooldownOption(String(diffDays));
      else {
        setCooldownOption('custom');
        setCustomDate(new Date(request.can_reapply_at).toISOString().split('T')[0]);
      }
    } else setCooldownOption('30');
  };

  const handleSaveDecisionUpdate = (e) => {
    e.preventDefault();
    let calculatedDate = null;
    if (newStatus === 'rejected') {
      if (cooldownOption === 'none') calculatedDate = new Date(Date.now() - 1000).toISOString();
      else if (cooldownOption === 'custom') calculatedDate = customDate ? new Date(customDate).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      else calculatedDate = new Date(Date.now() + (parseInt(cooldownOption) || 30) * 24 * 60 * 60 * 1000).toISOString();
    }
    onUpdateDecision(request.id, { status: newStatus, rejectionReason: newStatus === 'rejected' ? (noReason ? '' : rejectReason.trim()) : null, canReapplyAt: calculatedDate });
  };

  const S = {
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 600 },
    modal: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '90vw', maxWidth: '800px', background: '#181818', border: '1px solid #2c2c2c', borderRadius: '12px', overflow: 'hidden', zIndex: 601, boxShadow: '0 20px 60px rgba(0,0,0,0.8)', animation: 'modalIn 0.2s ease-out' },
    header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '24px', borderBottom: '1px solid #2c2c2c' },
    sectionCard: { background: '#1c1c20', border: '1px solid #2c2c2c', borderRadius: '8px', padding: '16px' },
    sectionTitle: { fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#70d64d', margin: '0 0 12px', paddingBottom: '8px', borderBottom: '1px solid #2c2c2c' },
    row: { display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', borderBottom: '1px solid #1e1e1e', padding: '5px 0' },
    closeBtn: { background: 'transparent', border: '1px solid #2c2c2c', color: '#8a8a8a', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
    btn: { display: 'inline-flex', alignItems: 'center', gap: '5px', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', border: 'none' },
    textarea: { width: '100%', background: '#1f1f1f', border: '1px solid #2c2c2c', borderRadius: '6px', color: '#fff', fontSize: '0.85rem', padding: '10px 12px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' },
  };

  return (
    <>
      <div onClick={onClose} style={S.overlay} />
      <div style={S.modal}>
        <div style={S.header}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 8px' }}>
              {request.full_name}
            </h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <RoleChip role={request.role} />
              <StatusBadge status={request.status} />
              {request.status === 'rejected' && request.can_reapply_at && (
                <span style={{ fontSize: '0.72rem', background: '#3b2314', color: '#f59e0b', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                  Cooldown until: {fmtDate(request.can_reapply_at)}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} style={S.closeBtn}><X size={16} /></button>
        </div>

        <div style={{ maxHeight: '68vh', overflowY: 'auto', padding: '24px' }}>
          {!isEditingDecision ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Left */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={S.sectionCard}>
                  <p style={S.sectionTitle}>Personal & Contact</p>
                  <div style={S.row}><strong>Email:</strong> <span>{request.email}</span></div>
                  <div style={S.row}><strong>Mobile:</strong> <span>{request.mobile}</span></div>
                  <div style={S.row}><strong>Designation:</strong> <span>{app.designation || app.title || 'N/A'}</span></div>
                  <div style={S.row}><strong>Location:</strong> <span>{app.location || app.headquarters || 'N/A'}</span></div>
                  {app.linkedinUrl && <div style={S.row}><strong>LinkedIn:</strong> <a href={app.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: '#70d64d' }}>View Profile</a></div>}
                  {app.website && <div style={S.row}><strong>Website:</strong> <a href={app.website} target="_blank" rel="noreferrer" style={{ color: '#70d64d' }}>{app.website}</a></div>}
                </div>
                <div style={S.sectionCard}>
                  <p style={S.sectionTitle}>Legal & Identification</p>
                  {request.role === 'freelancer' ? (<>
                    <div style={S.row}><strong>Legal Name (PAN):</strong> <span>{app.legalNamePan || 'N/A'}</span></div>
                    <div style={S.row}><strong>Personal PAN:</strong> <span style={{ textTransform: 'uppercase' }}>{app.personalPan || 'N/A'}</span></div>
                  </>) : (<>
                    <div style={S.row}><strong>Registered Name:</strong> <span>{app.registeredName || 'N/A'}</span></div>
                    <div style={S.row}><strong>Auth. Person:</strong> <span>{app.authPersonName || 'N/A'}</span></div>
                    <div style={S.row}><strong>Company PAN:</strong> <span style={{ textTransform: 'uppercase' }}>{app.companyPan || 'N/A'}</span></div>
                    <div style={S.row}><strong>GSTIN:</strong> <span style={{ textTransform: 'uppercase' }}>{app.gstNumber || 'N/A'}</span></div>
                    <div style={S.row}><strong>CIN:</strong> <span style={{ textTransform: 'uppercase' }}>{app.cin || 'N/A'}</span></div>
                  </>)}
                </div>
                <div style={S.sectionCard}>
                  <p style={S.sectionTitle}>Availability & Sign-off</p>
                  <div style={S.row}><strong>Availability:</strong> <span>{app.availability || 'Project basis'}</span></div>
                  <div style={S.row}><strong>Notice Period:</strong> <span>{app.noticePeriod || 'Immediate'}</span></div>
                  {request.role === 'agency' && <div style={S.row}><strong>Team Size:</strong> <span>{app.teamSize || 'N/A'} employees</span></div>}
                  <div style={S.row}><strong>Signee:</strong> <span>{app.signatureName || 'N/A'}</span></div>
                  <div style={S.row}><strong>Declaration:</strong> <span style={{ color: app.declarationAccepted ? '#70d64d' : '#ef4444', fontWeight: 600 }}>{app.declarationAccepted ? 'Accepted' : 'Declined'}</span></div>
                </div>
              </div>
              {/* Right */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={S.sectionCard}>
                  <p style={S.sectionTitle}>Services & Capability</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    {(app.selectedServices || []).map(srv => (
                      <span key={srv} style={{ background: '#1e293b', color: '#38bdf8', fontSize: '0.72rem', fontWeight: 600, padding: '3px 8px', borderRadius: '4px' }}>{srv}</span>
                    ))}
                  </div>
                  {app.portfolioUrl && <div><strong style={{ fontSize: '0.82rem' }}>Portfolio: </strong><a href={app.portfolioUrl} target="_blank" rel="noreferrer" style={{ color: '#70d64d', fontSize: '0.82rem' }}>Open Link</a></div>}
                </div>
                <div style={S.sectionCard}>
                  <p style={S.sectionTitle}>Commercial Rates</p>
                  <div style={S.row}><strong>Base Rate:</strong> <span>INR {app.baseRate || 'N/A'}</span></div>
                  <div style={S.row}><strong>Billing Basis:</strong> <span>{app.billingBasis || 'Hourly'}</span></div>
                  <div style={S.row}><strong>Commercial Basis:</strong> <span>{app.commercialBasis || 'N/A'}</span></div>
                </div>
                {/* History */}
                {isLoadingHistory ? (
                  <div style={S.sectionCard}><p style={S.sectionTitle}>Attempts & History</p><p style={{ color: '#888', fontSize: '0.8rem' }}>Loading...</p></div>
                ) : historyData && (
                  <div style={S.sectionCard}>
                    <p style={S.sectionTitle}>Attempts & History</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                      {[['Total Attempts', historyData.tracker?.total_attempts || 0, '#fff'], ['Rejections', historyData.tracker?.rejection_count || 0, '#ef4444']].map(([l, v, c]) => (
                        <div key={l} style={{ background: '#121215', border: '1px solid #2c2c2c', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                          <p style={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>{l}</p>
                          <p style={{ fontSize: '1.2rem', color: c, fontWeight: 800, margin: '4px 0 0' }}>{v}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                      {(historyData.history || []).map(log => {
                        const c = log.action === 'REJECTED' ? '#ef4444' : log.action === 'SUBMITTED' ? '#3b82f6' : log.action === 'DECISION_CHANGED' ? '#f59e0b' : '#70d64d';
                        return (
                          <div key={log.id} style={{ borderLeft: `2px solid ${c}`, paddingLeft: '10px', fontSize: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <strong style={{ color: c }}>{log.action}</strong>
                              <span style={{ color: '#6b7280', fontSize: '0.65rem' }}>{new Date(log.created_at).toLocaleDateString()}</span>
                            </div>
                            <div style={{ color: '#d1d5db', marginTop: '2px' }}>
                              {log.action === 'SUBMITTED' ? 'Submitted application' : <>Reviewed by <strong>{log.performer?.full_name || 'Admin'}</strong></>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* Decision card */}
                <div style={{ ...S.sectionCard, border: '1px dashed #2c2c2c' }}>
                  <p style={S.sectionTitle}>Status & Reviews</p>
                  <div style={S.row}><strong>Current State:</strong> <span>{request.status?.toUpperCase()}</span></div>
                  {request.status === 'rejected' && <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#ef4444' }}><strong>Rejection Reason:</strong> {request.rejection_reason || 'None.'}</div>}
                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={handleOpenEditDecision} style={{ ...S.btn, background: 'transparent', border: '1px solid #70d64d', color: '#70d64d', padding: '7px 14px' }}>
                      Change Decision / Cooldown
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveDecisionUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, margin: '0 0 10px' }}>Change Decision & Cooldown</h3>
              <div style={{ display: 'flex', gap: '20px' }}>
                {['approved', 'rejected'].map(v => (
                  <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', cursor: 'pointer' }}>
                    <input type="radio" name="newStatus" value={v} checked={newStatus === v} onChange={() => setNewStatus(v)} />
                    {v.charAt(0).toUpperCase() + v.slice(1)} Request
                  </label>
                ))}
              </div>
              {newStatus === 'rejected' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#1c1c20', padding: '16px', borderRadius: '8px' }}>
                  <div>
                    <label style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Cooldown Period</label>
                    <select value={cooldownOption} onChange={e => setCooldownOption(e.target.value)} style={{ ...S.textarea, height: '38px', padding: '6px 10px' }}>
                      {[['7','7 Days'],['14','14 Days'],['30','30 Days (Standard)'],['90','90 Days'],['none','No Cooldown'],['custom','Custom Date']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                  {cooldownOption === 'custom' && (
                    <div>
                      <label style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Re-apply Date</label>
                      <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)} style={{ ...S.textarea, height: '38px', padding: '6px 10px' }} required />
                    </div>
                  )}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={noReason} onChange={e => setNoReason(e.target.checked)} />
                    Do not provide a rejection reason
                  </label>
                  {!noReason && (
                    <div>
                      <label style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Reason for Rejection</label>
                      <textarea rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Describe why..." style={S.textarea} />
                    </div>
                  )}
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="submit" style={{ ...S.btn, background: '#70d64d', color: '#000', padding: '9px 18px' }} disabled={isPending}>
                  {isPending ? 'Saving…' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setIsEditingDecision(false)} style={{ ...S.btn, background: 'transparent', border: '1px solid #23232a', color: '#8a8a8a', padding: '9px 18px' }}>
                  Back to Profile
                </button>
              </div>
            </form>
          )}
        </div>

        {!isEditingDecision && request.status === 'pending' && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #2c2c2c', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button style={{ ...S.btn, background: '#70d64d', color: '#000', padding: '9px 18px' }} onClick={() => onApprove(request.id)} disabled={isPending}>
              <Check size={14} /> Approve
            </button>
            <button style={{ ...S.btn, background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '9px 18px' }} onClick={() => onReject(request)} disabled={isPending}>
              <X size={14} /> Reject
            </button>
          </div>
        )}
      </div>
    </>
  );
};
export default RegistrationRequestDetailModal;
