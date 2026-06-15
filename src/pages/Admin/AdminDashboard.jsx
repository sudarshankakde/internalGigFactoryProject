import React, { useState, useMemo, useEffect } from 'react';
import {
  Users, Building2, FileText, Clock, Check, X, Eye,
  Search, RefreshCw, AlertCircle,
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { api } from '../../utils/api';

/* ─── helpers ─────────────────────────────────────────────────────────── */
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const STATUS_STYLES = {
  pending:  { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b' },
  approved: { bg: 'rgba(112,214,77,0.12)',  color: '#70d64d' },
  rejected: { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444' },
};
const ROLE_STYLES = {
  freelancer: { bg: '#1e293b', color: '#38bdf8' },
  agency:     { bg: '#2e1065', color: '#c084fc' },
};

/* ─── sub-components ──────────────────────────────────────────────────── */

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: '0.68rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
      {status.toUpperCase()}
    </span>
  );
}

function RoleChip({ role }) {
  const r = ROLE_STYLES[role] || ROLE_STYLES.freelancer;
  return (
    <span style={{ background: r.bg, color: r.color, fontSize: '0.68rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
      {role?.toUpperCase()}
    </span>
  );
}

function StatCard({ label, value, Icon, accent }) {
  return (
    <div style={{ ...styles.statCard, ...(accent ? styles.statCardAccent : {}) }}>
      <div style={styles.statHead}>
        <span style={styles.statLabel}>{label}</span>
        <Icon size={16} color={accent ? '#70d64d' : '#6b7280'} />
      </div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
}

/* Detail modal */
function DetailModal({ request, historyData, isLoadingHistory, onClose, onApprove, onReject, onUpdateDecision, isPending }) {
  if (!request) return null;
  const app = request.application_data || {};

  const [isEditingDecision, setIsEditingDecision] = useState(false);
  const [newStatus, setNewStatus] = useState(request.status);
  const [rejectReason, setRejectReason] = useState(request.rejection_reason || '');
  const [noReason, setNoReason] = useState(false);
  
  // Cooldown selection states
  const [cooldownOption, setCooldownOption] = useState('30'); // '7', '14', '30', '90', 'none', 'custom'
  const [customDate, setCustomDate] = useState('');

  // Pre-fill states when opening edit decision mode
  const handleOpenEditDecision = () => {
    setNewStatus(request.status);
    setRejectReason(request.rejection_reason || '');
    setIsEditingDecision(true);
    
    if (request.can_reapply_at) {
      const diffMs = new Date(request.can_reapply_at) - Date.now();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if ([7, 14, 30, 90].includes(diffDays)) {
        setCooldownOption(String(diffDays));
      } else {
        setCooldownOption('custom');
        setCustomDate(new Date(request.can_reapply_at).toISOString().split('T')[0]);
      }
    } else {
      setCooldownOption('30');
    }
  };

  const handleSaveDecisionUpdate = (e) => {
    e.preventDefault();
    let calculatedDate = null;
    if (newStatus === 'rejected') {
      if (cooldownOption === 'none') {
        calculatedDate = new Date(Date.now() - 1000).toISOString(); // expired (now - 1s)
      } else if (cooldownOption === 'custom') {
        calculatedDate = customDate ? new Date(customDate).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      } else {
        const days = parseInt(cooldownOption) || 30;
        calculatedDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
      }
    }

    onUpdateDecision(request.id, {
      status: newStatus,
      rejectionReason: newStatus === 'rejected' ? (noReason ? '' : rejectReason.trim()) : null,
      canReapplyAt: calculatedDate
    });
  };

  return (
    <>
      <div onClick={onClose} style={styles.modalOverlay} />
      <div style={styles.profileModal}>
        <div style={styles.modalHeader}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                Registration Profile: {request.full_name}
              </h2>
              <button onClick={onClose} style={styles.drawerClose}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <RoleChip role={request.role} />
              <StatusBadge status={request.status} />
              {request.status === 'rejected' && request.can_reapply_at && (
                <span style={{ fontSize: '0.72rem', background: '#3b2314', color: '#f59e0b', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                  Cooldown until: {fmtDate(request.can_reapply_at)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '24px' }}>
          {/* Main profile view */}
          {!isEditingDecision ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Left Column: Info cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* 1. Contact & Designation Card */}
                <div style={styles.profileSectionCard}>
                  <h3 style={styles.profileSectionTitle}>Personal & Contact Details</h3>
                  <div style={styles.profileRow}><strong>Email:</strong> <span>{request.email}</span></div>
                  <div style={styles.profileRow}><strong>Mobile:</strong> <span>{request.mobile}</span></div>
                  <div style={styles.profileRow}><strong>Designation:</strong> <span>{app.designation || app.title || 'N/A'}</span></div>
                  <div style={styles.profileRow}><strong>Location:</strong> <span>{app.location || app.headquarters || 'N/A'}</span></div>
                  {app.linkedinUrl && (
                    <div style={styles.profileRow}>
                      <strong>LinkedIn:</strong> 
                      <a href={app.linkedinUrl} target="_blank" rel="noreferrer" style={styles.profileLink}>View Profile</a>
                    </div>
                  )}
                  {app.website && (
                    <div style={styles.profileRow}>
                      <strong>Website:</strong> 
                      <a href={app.website} target="_blank" rel="noreferrer" style={styles.profileLink}>{app.website}</a>
                    </div>
                  )}
                </div>

                {/* 2. Legal Details Card */}
                <div style={styles.profileSectionCard}>
                  <h3 style={styles.profileSectionTitle}>Legal & Identification</h3>
                  {request.role === 'freelancer' ? (
                    <>
                      <div style={styles.profileRow}><strong>Legal Name (PAN):</strong> <span>{app.legalNamePan || 'N/A'}</span></div>
                      <div style={styles.profileRow}><strong>Personal PAN:</strong> <span style={{ textTransform: 'uppercase' }}>{app.personalPan || 'N/A'}</span></div>
                    </>
                  ) : (
                    <>
                      <div style={styles.profileRow}><strong>Registered Name:</strong> <span>{app.registeredName || 'N/A'}</span></div>
                      <div style={styles.profileRow}><strong>Authorized Person:</strong> <span>{app.authPersonName || 'N/A'}</span></div>
                      <div style={styles.profileRow}><strong>Company PAN:</strong> <span style={{ textTransform: 'uppercase' }}>{app.companyPan || 'N/A'}</span></div>
                      <div style={styles.profileRow}><strong>GSTIN:</strong> <span style={{ textTransform: 'uppercase' }}>{app.gstNumber || 'N/A'}</span></div>
                      <div style={styles.profileRow}><strong>CIN:</strong> <span style={{ textTransform: 'uppercase' }}>{app.cin || 'N/A'}</span></div>
                    </>
                  )}
                </div>

                {/* 3. Availability & Sign-off Card */}
                <div style={styles.profileSectionCard}>
                  <h3 style={styles.profileSectionTitle}>Availability & Sign-off</h3>
                  <div style={styles.profileRow}><strong>Availability:</strong> <span>{app.availability || 'Project basis'}</span></div>
                  <div style={styles.profileRow}><strong>Notice Period:</strong> <span>{app.noticePeriod || 'Immediate'}</span></div>
                  {request.role === 'agency' && (
                    <div style={styles.profileRow}><strong>Team Size:</strong> <span>{app.teamSize || 'N/A'} employees</span></div>
                  )}
                  <div style={styles.profileRow}><strong>Signee Name:</strong> <span>{app.signatureName || 'N/A'}</span></div>
                  <div style={styles.profileRow}>
                    <strong>Declaration:</strong> 
                    <span style={{ color: app.declarationAccepted ? '#70d64d' : '#ef4444', fontWeight: 600 }}>
                      {app.declarationAccepted ? 'Accepted' : 'Declined'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Skills, Details and Decision logs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* 4. Selected Services & Skills */}
                <div style={styles.profileSectionCard}>
                  <h3 style={styles.profileSectionTitle}>Services & Capability Stack</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    {(app.selectedServices || []).map(srv => (
                      <span key={srv} style={styles.tag}>{srv}</span>
                    ))}
                  </div>

                  {app.bimDetails && (
                    <div style={{ marginTop: '12px', background: '#1c1c20', padding: '10px', borderRadius: '6px' }}>
                      <p style={{ margin: '0 0 6px', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280' }}>BIM DETAILS</p>
                      <div style={styles.profileRow}><strong>Software Stack:</strong> <span>{Array.isArray(app.bimDetails.softwareStack) ? app.bimDetails.softwareStack.join(', ') : 'N/A'}</span></div>
                      <div style={styles.profileRow}><strong>Experience:</strong> <span>{app.bimDetails.experience || 'N/A'} yrs</span></div>
                    </div>
                  )}
                  {app.portfolioUrl && (
                    <div style={{ marginTop: '12px' }}>
                      <strong>Portfolio link: </strong>
                      <a href={app.portfolioUrl} target="_blank" rel="noreferrer" style={styles.profileLink}>Open Link</a>
                    </div>
                  )}
                </div>

                {/* 5. Commercials Card */}
                <div style={styles.profileSectionCard}>
                  <h3 style={styles.profileSectionTitle}>Commercial Rates</h3>
                  <div style={styles.profileRow}><strong>Base Rate:</strong> <span>INR {app.baseRate || 'N/A'}</span></div>
                  <div style={styles.profileRow}><strong>Billing Basis:</strong> <span>{app.billingBasis || 'Hourly'}</span></div>
                  <div style={styles.profileRow}><strong>Commercial Basis:</strong> <span>{app.commercialBasis || 'N/A'}</span></div>
                </div>

                {/* 5.1 Registration History & Attempts */}
                <div style={styles.profileSectionCard}>
                  <h3 style={styles.profileSectionTitle}>Attempts & History Tracker</h3>
                  {isLoadingHistory ? (
                    <div style={{ color: '#888', fontSize: '0.8rem', padding: '10px 0' }}>Loading history...</div>
                  ) : historyData ? (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ background: '#121215', border: '1px solid #2c2c2c', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>Total Attempts</span>
                          <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 800, marginTop: '2px' }}>
                            {historyData.tracker?.total_attempts || 0}
                          </div>
                        </div>
                        <div style={{ background: '#121215', border: '1px solid #2c2c2c', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.65rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>Rejections</span>
                          <div style={{ fontSize: '1.2rem', color: '#ef4444', fontWeight: 800, marginTop: '2px' }}>
                            {historyData.tracker?.rejection_count || 0}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                        {(!historyData.history || historyData.history.length === 0) ? (
                          <div style={{ color: '#6b7280', fontSize: '0.75rem', textAlign: 'center', padding: '10px 0' }}>No history records logged yet.</div>
                        ) : (
                          historyData.history.map((log) => {
                            let actionColor = '#70d64d'; // Approved
                            if (log.action === 'REJECTED') actionColor = '#ef4444';
                            else if (log.action === 'SUBMITTED') actionColor = '#3b82f6';
                            else if (log.action === 'DECISION_CHANGED') actionColor = '#f59e0b';

                            return (
                              <div key={log.id} style={{ borderLeft: `2px solid ${actionColor}`, paddingLeft: '10px', fontSize: '0.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <strong style={{ color: actionColor }}>{log.action}</strong>
                                  <span style={{ color: '#6b7280', fontSize: '0.65rem' }}>
                                    {new Date(log.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <div style={{ color: '#d1d5db', marginTop: '2px', fontSize: '0.72rem' }}>
                                  {log.action === 'SUBMITTED' ? 'Submitted a new application request' : (
                                    <>
                                      Reviewed by: <strong>{log.performer?.full_name || 'Admin'}</strong>
                                    </>
                                  )}
                                </div>
                                {log.rejection_reason && (
                                  <div style={{ color: '#fca5a5', fontStyle: 'italic', background: '#271c1c', padding: '4px 6px', borderRadius: '4px', marginTop: '4px', wordBreak: 'break-all', fontSize: '0.7rem' }}>
                                    Reason: {log.rejection_reason}
                                  </div>
                                )}
                                {log.can_reapply_at && (
                                  <div style={{ color: '#fcd34d', fontSize: '0.68rem', marginTop: '2px' }}>
                                    Cooldown until: {new Date(log.can_reapply_at).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </>
                  ) : (
                    <div style={{ color: '#888', fontSize: '0.8rem' }}>Unable to retrieve history.</div>
                  )}
                </div>

                {/* 6. Current Decision info & Actions */}
                <div style={{ ...styles.profileSectionCard, border: '1px dashed #2c2c2c', background: '#17171a' }}>
                  <h3 style={styles.profileSectionTitle}>Status & Reviews</h3>
                  <div style={styles.profileRow}><strong>Current State:</strong> <span>{request.status.toUpperCase()}</span></div>
                  {request.status === 'rejected' && (
                    <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#ef4444' }}>
                      <strong>Rejection Reason:</strong> {request.rejection_reason || 'None provided.'}
                    </div>
                  )}
                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={handleOpenEditDecision} style={{ ...styles.btn, ...styles.btnGhost, borderColor: '#70d64d', color: '#70d64d' }}>
                      Change Decision / Cooldown
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Edit Decision form view */
            <form onSubmit={handleSaveDecisionUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, margin: '0 0 10px' }}>
                Change Decision & Cooldown Period
              </h3>

              {/* Status Radio Choice */}
              <div>
                <label style={{ ...styles.drawerRowLabel, display: 'block', marginBottom: '8px' }}>
                  New Decision Status
                </label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="newStatus"
                      value="approved"
                      checked={newStatus === 'approved'}
                      onChange={() => setNewStatus('approved')}
                    />
                    Approve Request
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="newStatus"
                      value="rejected"
                      checked={newStatus === 'rejected'}
                      onChange={() => setNewStatus('rejected')}
                    />
                    Reject Request
                  </label>
                </div>
              </div>

              {/* Rejected options */}
              {newStatus === 'rejected' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#1c1c20', padding: '16px', borderRadius: '8px' }}>
                  {/* Cooldown option dropdown */}
                  <div>
                    <label style={{ ...styles.drawerRowLabel, display: 'block', marginBottom: '6px' }}>
                      Cooldown Period
                    </label>
                    <select
                      value={cooldownOption}
                      onChange={e => setCooldownOption(e.target.value)}
                      style={{ ...styles.textarea, height: '38px', padding: '6px 10px' }}
                    >
                      <option value="7">7 Days Cooldown</option>
                      <option value="14">14 Days Cooldown</option>
                      <option value="30">30 Days Cooldown (Standard)</option>
                      <option value="90">90 Days Cooldown</option>
                      <option value="none">No Cooldown (Can reapply immediately)</option>
                      <option value="custom">Custom Date</option>
                    </select>
                  </div>

                  {/* Custom Date Input */}
                  {cooldownOption === 'custom' && (
                    <div className="animate-fade-in">
                      <label style={{ ...styles.drawerRowLabel, display: 'block', marginBottom: '6px' }}>
                        Select Re-apply Date
                      </label>
                      <input
                        type="date"
                        value={customDate}
                        onChange={e => setCustomDate(e.target.value)}
                        style={{ ...styles.textarea, height: '38px', padding: '6px 10px' }}
                        required
                      />
                    </div>
                  )}

                  {/* Optional Rejection Reason checkbox */}
                  <div style={{ margin: '8px 0 0' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '0.8rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={noReason}
                        onChange={e => setNoReason(e.target.checked)}
                      />
                      Do not provide a rejection reason
                    </label>
                  </div>

                  {/* Rejection Reason Textarea */}
                  {!noReason && (
                    <div>
                      <label style={{ ...styles.drawerRowLabel, display: 'block', marginBottom: '6px' }}>
                        Reason for Rejection
                      </label>
                      <textarea
                        rows={3}
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        placeholder="Provide reasons for rejection..."
                        style={styles.textarea}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Form buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" style={{ ...styles.btn, ...styles.btnApprove }} disabled={isPending}>
                  {isPending ? 'Saving Update…' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setIsEditingDecision(false)} style={{ ...styles.btn, ...styles.btnGhost }}>
                  Back to Profile
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer actions for pending status */}
        {!isEditingDecision && request.status === 'pending' && (
          <div style={{ ...styles.drawerFooter, borderTop: '1px solid #2c2c2c', display: 'flex', justifyContent: 'flex-end' }}>
            <button style={{ ...styles.btn, ...styles.btnApprove }} onClick={() => onApprove(request.id)} disabled={isPending}>
              <Check size={14} /> Approve
            </button>
            <button style={{ ...styles.btn, ...styles.btnReject }} onClick={() => onReject(request)} disabled={isPending}>
              <X size={14} /> Reject
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* Reject modal */
function RejectModal({ request, onClose, onConfirm, isPending }) {
  const [reason, setReason] = useState('');
  const [noReason, setNoReason] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(request.id, noReason ? '' : reason.trim());
  };

  return (
    <>
      <div style={styles.modalOverlay} onClick={onClose} />
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <div style={styles.modalIconWrap}><AlertCircle size={20} color="#ef4444" /></div>
          <div>
            <h3 style={styles.modalTitle}>Reject Application</h3>
            <p style={styles.modalSub}>{request?.full_name} — {request?.role}</p>
          </div>
          <button onClick={onClose} style={styles.drawerClose}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '0 24px 24px' }}>
          <div style={{ margin: '16px 0 8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '0.82rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={noReason}
                onChange={e => setNoReason(e.target.checked)}
              />
              Do not provide a rejection reason
            </label>
          </div>

          {!noReason && (
            <div style={{ marginTop: '12px' }}>
              <label style={{ ...styles.drawerRowLabel, display: 'block', marginBottom: '8px' }}>
                Reason for Rejection
              </label>
              <textarea
                rows={4}
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Describe why this application is being rejected…"
                style={styles.textarea}
                autoFocus
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" style={{ ...styles.btn, ...styles.btnReject, flex: 1 }} disabled={isPending}>
              <X size={14} /> {isPending ? 'Rejecting…' : 'Confirm Rejection'}
            </button>
            <button type="button" onClick={onClose} style={{ ...styles.btn, ...styles.btnGhost }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

/* ─── Main AdminDashboard (content only — AppLayout provides shell) ─── */
export default function AdminDashboard() {
  const queryClient = useQueryClient();

  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReq,  setSelectedReq]  = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);

  /* ── fetch request history ── */
  const { data: historyData = null, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['admin-registration-request-history', selectedReq?.id],
    queryFn: () => api.get(`/auth/registration-requests/${selectedReq.id}/history`),
    enabled: !!selectedReq?.id,
  });

  /* ── fetch ── */
  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-registration-requests'],
    queryFn:  () => api.get('/auth/registration-requests').then(r => r.requests || []),
  });

  /* ── query mutations ── */
  const [reviewParams, setReviewParams] = useState(null);
  const reviewQuery = useQuery({
    queryKey: ['admin-registration-review', reviewParams],
    queryFn: () => api.post(`/auth/registration-requests/${reviewParams.id}/review`, {
      status: reviewParams.status,
      rejectionReason: reviewParams.rejectionReason,
      canReapplyAt: reviewParams.canReapplyAt,
    }),
    enabled: !!reviewParams,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (reviewQuery.data) {
      toast.success('Application decision saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-registration-requests'] });
      setSelectedReq(null);
      setRejectTarget(null);
      setReviewParams(null);
    }
  }, [reviewQuery.data, queryClient]);

  useEffect(() => {
    if (reviewQuery.error) {
      toast.error(reviewQuery.error.message || 'Operation failed.');
      setReviewParams(null);
    }
  }, [reviewQuery.error]);

  /* ── handlers ── */
  const handleApprove       = (id)          => setReviewParams({ id, status: 'approved' });
  const handleOpenReject    = (req)         => setRejectTarget(req);
  const handleConfirmReject = (id, reason)  => setReviewParams({ id, status: 'rejected', rejectionReason: reason });
  const handleUpdateDecision = (id, params) => setReviewParams({ id, ...params });

  /* ── derived data ── */
  const filtered = useMemo(() => {
    return requests.filter(r => {
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const q = search.toLowerCase();
      const matchSearch = !q ||
        r.full_name?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.mobile?.includes(q);
      return matchStatus && matchSearch;
    });
  }, [requests, statusFilter, search]);

  const stats = useMemo(() => ({
    total:    requests.length,
    pending:  requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  }), [requests]);

  /* ── render (content only) ── */
  return (
    <div>
      {/* Stat cards */}
      <div style={styles.statsGrid}>
        <StatCard label="TOTAL REQUESTS"  value={isLoading ? <span className="skeleton-pulse" style={{ display: 'inline-block', width: '40px', height: '28px', borderRadius: '4px', verticalAlign: 'middle' }} /> : stats.total}    Icon={FileText}  />
        <StatCard label="PENDING REVIEW"  value={isLoading ? <span className="skeleton-pulse" style={{ display: 'inline-block', width: '40px', height: '28px', borderRadius: '4px', verticalAlign: 'middle' }} /> : stats.pending}  Icon={Clock}     accent />
        <StatCard label="APPROVED"        value={isLoading ? <span className="skeleton-pulse" style={{ display: 'inline-block', width: '40px', height: '28px', borderRadius: '4px', verticalAlign: 'middle' }} /> : stats.approved} Icon={Users}     />
        <StatCard label="REJECTED"        value={isLoading ? <span className="skeleton-pulse" style={{ display: 'inline-block', width: '40px', height: '28px', borderRadius: '4px', verticalAlign: 'middle' }} /> : stats.rejected} Icon={Building2} />
      </div>

      {/* Table card */}
      <div style={styles.tableCard}>
        {/* controls */}
        <div style={styles.tableControls}>
          <div style={styles.searchWrap}>
            <Search size={14} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by name, email, or mobile…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['all', 'pending', 'approved', 'rejected'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{ ...styles.filterBtn, ...(statusFilter === s ? styles.filterBtnActive : {}) }}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
            <button
              onClick={() => refetch()}
              style={{ ...styles.filterBtn, display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </div>

        {/* table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Full Name', 'Email', 'Mobile', 'Role', 'Status', 'Submitted', 'Actions'].map(h => (
                  <th key={h} style={styles.th}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={`skeleton-${i}`}>
                    <td style={styles.td}>
                      <div className="skeleton-pulse" style={{ width: '120px', height: '16px', borderRadius: '4px' }} />
                    </td>
                    <td style={styles.td}>
                      <div className="skeleton-pulse" style={{ width: '150px', height: '14px', borderRadius: '4px' }} />
                    </td>
                    <td style={styles.td}>
                      <div className="skeleton-pulse" style={{ width: '90px', height: '14px', borderRadius: '4px' }} />
                    </td>
                    <td style={styles.td}>
                      <div className="skeleton-pulse" style={{ width: '80px', height: '22px', borderRadius: '12px' }} />
                    </td>
                    <td style={styles.td}>
                      <div className="skeleton-pulse" style={{ width: '70px', height: '20px', borderRadius: '4px' }} />
                    </td>
                    <td style={styles.td}>
                      <div className="skeleton-pulse" style={{ width: '100px', height: '14px', borderRadius: '4px' }} />
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div className="skeleton-pulse" style={{ width: '70px', height: '28px', borderRadius: '6px' }} />
                        <div className="skeleton-pulse" style={{ width: '70px', height: '28px', borderRadius: '6px' }} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={styles.emptyCell}>No requests match your criteria.</td></tr>
              ) : filtered.map(req => (
                <tr key={req.id} style={styles.tr}>
                  <td style={styles.td}><strong style={{ color: '#fff', fontSize: '0.88rem' }}>{req.full_name}</strong></td>
                  <td style={{ ...styles.td, color: '#8a8a8a', fontSize: '0.83rem' }}>{req.email}</td>
                  <td style={{ ...styles.td, color: '#8a8a8a', fontSize: '0.83rem' }}>{req.mobile}</td>
                  <td style={styles.td}><RoleChip role={req.role} /></td>
                  <td style={styles.td}><StatusBadge status={req.status} /></td>
                  <td style={{ ...styles.td, color: '#6b6b6b', fontSize: '0.8rem' }}>{fmtDate(req.created_at)}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button
                        onClick={() => setSelectedReq(req)}
                        style={{ ...styles.btn, ...styles.btnGhost, padding: '5px 8px' }}
                        title="View details"
                      >
                        <Eye size={13} />
                      </button>
                      {req.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(req.id)}
                            disabled={reviewQuery.isFetching}
                            style={{ ...styles.btn, ...styles.btnApproveSmall }}
                            title="Approve"
                          >
                            <Check size={12} /> Approve
                          </button>
                          <button
                            onClick={() => handleOpenReject(req)}
                            disabled={reviewQuery.isFetching}
                            style={{ ...styles.btn, ...styles.btnRejectSmall }}
                            title="Reject"
                          >
                            <X size={12} /> Reject
                          </button>
                        </>
                      )}
                      {req.status !== 'pending' && (
                        <button
                          onClick={() => setSelectedReq(req)}
                          style={{ ...styles.btn, ...styles.btnGhost, padding: '3px 8px', fontSize: '0.72rem', borderColor: '#70d64d', color: '#70d64d' }}
                        >
                          Change Decision
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* footer */}
        <div style={styles.tableFooter}>
          <span style={{ color: '#6b6b6b', fontSize: '0.8rem' }}>
            Showing {filtered.length} of {requests.length} entries
          </span>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReq && (
        <DetailModal
          request={selectedReq}
          historyData={historyData}
          isLoadingHistory={isLoadingHistory}
          onClose={() => setSelectedReq(null)}
          onApprove={handleApprove}
          onReject={handleOpenReject}
          onUpdateDecision={handleUpdateDecision}
          isPending={reviewQuery.isFetching}
        />
      )}

      {/* Reject Modal */}
      {rejectTarget && (
        <RejectModal
          request={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onConfirm={handleConfirmReject}
          isPending={reviewQuery.isFetching}
        />
      )}
    </div>
  );
}

/* ─── styles ──────────────────────────────────────────────────────────── */
const styles = {
  /* stat cards */
  statsGrid:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' },
  statCard:     { background: '#121215', border: '1px solid #23232a', borderRadius: '8px', padding: '18px 20px' },
  statCardAccent: { background: 'linear-gradient(135deg,#121215,#162203)', borderColor: '#374f05' },
  statHead:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statLabel:    { color: '#6b7280', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' },
  statValue:    { fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: '6px' },

  /* table card */
  tableCard:    { background: '#121215', border: '1px solid #23232a', borderRadius: '8px', padding: '24px' },
  tableControls:{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' },
  searchWrap:   { position: 'relative', display: 'flex', alignItems: 'center', flex: 1, minWidth: '220px' },
  searchIcon:   { position: 'absolute', left: '12px', color: '#6b7280', pointerEvents: 'none' },
  searchInput:  { width: '100%', background: '#0c0c0e', border: '1px solid #23232a', borderRadius: '6px', color: '#fff', fontSize: '0.85rem', padding: '8px 12px 8px 36px', outline: 'none' },
  filterBtn:    { background: '#0c0c0e', border: '1px solid #23232a', color: '#6b7280', borderRadius: '6px', padding: '7px 14px', fontSize: '0.8rem', cursor: 'pointer' },
  filterBtnActive: { background: '#70d64d', color: '#000', borderColor: '#70d64d', fontWeight: 700 },
  table:        { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th:           { color: '#6b7280', fontSize: '0.68rem', fontWeight: 700, padding: '12px 14px', borderBottom: '1px solid #23232a', letterSpacing: '0.5px', whiteSpace: 'nowrap' },
  td:           { padding: '14px', borderBottom: '1px solid #1a1a22', verticalAlign: 'middle' },
  tr:           { transition: 'background 0.1s' },
  emptyCell:    { textAlign: 'center', padding: '40px', color: '#6b7280', fontSize: '0.88rem' },
  tableFooter:  { marginTop: '16px', display: 'flex', justifyContent: 'flex-end' },

  /* buttons */
  btn:            { display: 'inline-flex', alignItems: 'center', gap: '5px', borderRadius: '5px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', border: 'none', transition: 'opacity 0.15s' },
  btnApprove:     { background: '#70d64d', color: '#000', padding: '8px 16px' },
  btnReject:      { background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '8px 16px' },
  btnGhost:       { background: 'transparent', border: '1px solid #23232a', color: '#8a8a8a', padding: '7px 12px' },
  btnApproveSmall:{ background: 'rgba(112,214,77,0.1)', color: '#70d64d', border: '1px solid rgba(112,214,77,0.3)', padding: '5px 9px' },
  btnRejectSmall: { background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)', padding: '5px 9px' },

  /* drawer */
  drawerBackdrop:{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', zIndex: 500 },
  drawer:        { position: 'fixed', top: 0, right: 0, bottom: 0, width: '440px', maxWidth: '95vw', background: '#181818', borderLeft: '1px solid #2c2c2c', zIndex: 501, display: 'flex', flexDirection: 'column', animation: 'slideIn 0.22s ease-out' },
  drawerHeader:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '24px 24px 0' },
  drawerTitle:   { fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 },
  drawerAccentBar:{ height: '2px', background: '#70d64d', margin: '16px 24px 0' },
  drawerBody:    { flex: 1, overflowY: 'auto', padding: '16px 24px 24px' },
  drawerClose:   { background: 'transparent', border: '1px solid #2c2c2c', color: '#8a8a8a', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 },
  drawerRow:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #1e1e1e' },
  drawerRowLabel:{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', paddingRight: '12px', flexShrink: 0 },
  drawerRowValue:{ color: '#e0e0e0', fontSize: '0.83rem', textAlign: 'right', wordBreak: 'break-all' },
  drawerFooter:  { padding: '16px 24px', borderTop: '1px solid #2c2c2c', display: 'flex', gap: '10px' },
  nestedBox:     { background: '#1f1f1f', border: '1px solid #2c2c2c', borderRadius: '6px', padding: '8px 12px' },
  tag:           { background: '#1e293b', color: '#38bdf8', fontSize: '0.72rem', fontWeight: 600, padding: '3px 8px', borderRadius: '4px' },

  /* reject modal */
  modalOverlay:  { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 600 },
  modal:         { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '100%', maxWidth: '440px', background: '#181818', border: '1px solid #2c2c2c', borderRadius: '10px', overflow: 'hidden', zIndex: 601, boxShadow: '0 20px 60px rgba(0,0,0,0.8)', animation: 'modalIn 0.2s ease-out' },
  modalHeader:   { display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 24px', borderBottom: '1px solid #2c2c2c' },
  modalIconWrap: { width: '36px', height: '36px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  modalTitle:    { color: '#fff', fontSize: '1rem', fontWeight: 800, margin: 0 },
  modalSub:      { color: '#6b7280', fontSize: '0.78rem', marginTop: '2px' },
  textarea:      { width: '100%', background: '#1f1f1f', border: '1px solid #2c2c2c', borderRadius: '6px', color: '#fff', fontSize: '0.85rem', padding: '10px 12px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' },
  profileModal:  { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '90vw', maxWidth: '780px', background: '#181818', border: '1px solid #2c2c2c', borderRadius: '10px', overflow: 'hidden', zIndex: 601, boxShadow: '0 20px 60px rgba(0,0,0,0.8)', animation: 'modalIn 0.2s ease-out' },
  profileSectionCard: { background: '#1c1c20', border: '1px solid #2c2c2c', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' },
  profileSectionTitle:{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#70d64d', margin: '0 0 8px', borderBottom: '1px solid #2c2c2c', paddingBottom: '6px' },
  profileRow:         { display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', borderBottom: '1px solid #232328', paddingBottom: '4px' },
  profileLink:        { color: '#70d64d', textDecoration: 'none', fontWeight: 600 },
};
