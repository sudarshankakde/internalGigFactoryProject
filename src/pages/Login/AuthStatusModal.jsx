import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Clock, XCircle, RefreshCw, UserPlus, X, CheckCircle } from 'lucide-react';


/* ─── live cooldown hook ─────────────────────────────────────────────── */
function useCooldown(dateStr) {
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    if (!dateStr) return;
    const tick = () => {
      const diff = new Date(dateStr) - Date.now();
      if (diff <= 0) { setRemaining('Cooldown expired'); return; }
      const d = Math.floor(diff / 864e5);
      const h = Math.floor((diff % 864e5) / 36e5);
      const m = Math.floor((diff % 36e5) / 6e4);
      const s = Math.floor((diff % 6e4) / 1e3);
      if (d > 0) setRemaining(`${d}d ${h}h ${m}m remaining`);
      else if (h > 0) setRemaining(`${h}h ${m}m ${s}s remaining`);
      else setRemaining(`${m}m ${s}s remaining`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [dateStr]);

  return remaining;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function getActionColor(action) {
  switch (action) {
    case 'SUBMITTED': return '#3b82f6';
    case 'REAPPLIED': return '#8b5cf6';
    case 'APPROVED': return 'var(--accent-lime)';
    case 'REJECTED': return '#ef4444';
    default: return '#71717a';
  }
}

/* ─── main component ─────────────────────────────────────────────────── */
const AuthStatusModal = ({ isOpen, onClose, statusData, email, onRegisterTrigger, onReapplyTrigger }) => {
  const overlayRef = useRef(null);
  const cooldown = useCooldown(statusData?.canReapplyAt);

  // close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // close on backdrop click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen || !statusData) return null;

  const {
    status,
    rejectionReason,
    canReapplyAt,
    applicationData,
    role,
    fullName,
    mobile,
  } = statusData;

  const handleRegisterRedirect = () => {
    onClose();
    if (onRegisterTrigger) {
      onRegisterTrigger(email);
    }
  };

  const handleReapplyRedirect = () => {
    onClose();
    if (onReapplyTrigger) {
      onReapplyTrigger(
        applicationData,
        role || 'freelancer',
        email || statusData.email,
        fullName || statusData.fullName,
        mobile || statusData.mobile
      );
    }
  };

  /* ── icon and title per status ──────────────────────── */
  const META = {
    user_not_found:      { Icon: AlertTriangle, title: 'Account Not Found' },
    pending_approval:    { Icon: Clock,         title: 'Review in Progress' },
    rejected_cooldown:   { Icon: XCircle,       title: 'Application Rejected' },
    rejected_can_reapply:{ Icon: RefreshCw,     title: 'Reapply Available' },
  };
  const { Icon, title } = META[status] || META.user_not_found;

  return (
    <>
      {/* overlay */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        style={styles.overlay}
      />

      {/* modal card */}
      <div style={styles.modalWrap}>
        <div style={styles.card}>

          {/* lime accent top bar */}
          <div style={styles.accentBar} />

          {/* close */}
          <button type="button" onClick={onClose} style={styles.closeBtn} aria-label="Close">
            <X size={16} />
          </button>

          {/* body */}
          <div style={styles.body}>

            {/* icon */}
            <div style={styles.iconRing}>
              <Icon size={28} strokeWidth={1.75} />
            </div>

            {/* title + lime underline */}
            <h2 style={styles.title}>{title}</h2>
            <div style={styles.titleUnderline} />

            {/* ────── USER NOT FOUND ────── */}
            {status === 'user_not_found' && (
              <>
                <p style={styles.description}>
                  No account is registered under{' '}
                  <span style={styles.emailHighlight}>{email}</span>.
                  {' '}Join GigFactory to unlock premium gig opportunities!
                </p>

                <div style={styles.btnRow}>
                  <button type="button" style={styles.primaryBtn} onClick={handleRegisterRedirect}>
                    <UserPlus size={15} /> Register Now &amp; Join
                  </button>
                  <button type="button" style={styles.ghostBtn} onClick={onClose}>
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* ────── PENDING APPROVAL ────── */}
            {status === 'pending_approval' && (
              <>
                <span style={styles.statusBadge}>WILL APPROVE SOON</span>

                <p style={styles.description}>
                  Your registration is currently being reviewed by our team. We&apos;re auditing your
                  work samples and credentials. Once approved, you&apos;ll receive a setup link via
                  email to activate your account.
                </p>

                <div style={styles.infoCard}>
                  <InfoRow Icon={CheckCircle} text="Application submitted successfully" />
                  <InfoRow Icon={Clock}       text="Average review time: 1–3 business days" />
                </div>

                <button type="button" style={{ ...styles.primaryBtn, width: '100%', justifyContent: 'center' }} onClick={onClose}>
                  Got It
                </button>
              </>
            )}

            {/* ────── REJECTED – COOLDOWN ────── */}
            {status === 'rejected_cooldown' && (
              <>
                <p style={styles.description}>
                  Unfortunately, your registration request was not approved by our administrators.
                  A cooldown period is currently active.
                </p>

                {rejectionReason && <ReasonBox label="REASON FOR REJECTION" text={rejectionReason} />}

                <div style={styles.cooldownBox}>
                  <span style={styles.cooldownLabel}>COOLDOWN IN EFFECT</span>
                  <p style={styles.cooldownTimer}>{cooldown}</p>
                  <p style={styles.cooldownSub}>
                    You can reapply after:{' '}
                    <strong style={{ color: 'var(--text-main)' }}>{formatDate(canReapplyAt)}</strong>
                  </p>
                </div>

                <button type="button" style={{ ...styles.ghostBtn, width: '100%', justifyContent: 'center' }} onClick={onClose}>
                  Close
                </button>
              </>
            )}

            {/* ────── REJECTED – CAN REAPPLY ────── */}
            {status === 'rejected_can_reapply' && (
              <>
                <p style={styles.description}>
                  Your previous application was rejected, but your cooldown has expired!
                  Review, edit, and resubmit your application below.
                </p>

                {rejectionReason && <ReasonBox label="PREVIOUS REJECTION REASON" text={rejectionReason} />}

                <p style={{ ...styles.description, fontSize: '0.75rem', marginBottom: '20px' }}>
                  Your previous details have been saved for your convenience.
                </p>

                <div style={styles.btnRow}>
                  <button type="button" style={styles.primaryBtn} onClick={handleReapplyRedirect}>
                    <RefreshCw size={15} /> Edit &amp; Reapply
                  </button>
                  <button type="button" style={styles.ghostBtn} onClick={onClose}>
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* Timeline History */}
            {statusData.history && statusData.history.length > 0 && (
              <div style={styles.historySection}>
                <h3 style={styles.historyTitle}>APPLICATION HISTORY</h3>
                <div style={styles.timeline}>
                  {statusData.history.map((log, index) => {
                    const isLast = index === statusData.history.length - 1;
                    return (
                      <div key={log.id || index} style={styles.timelineItem}>
                        <div style={styles.timelineBadgeCol}>
                          <div style={{
                            ...styles.timelineBadge,
                            backgroundColor: getActionColor(log.action),
                          }} />
                          {!isLast && <div style={styles.timelineLine} />}
                        </div>
                        <div style={styles.timelineContent}>
                          <div style={styles.timelineHeader}>
                            <span style={styles.timelineAction}>{log.action}</span>
                            <span style={styles.timelineDate}>{formatDate(log.created_at)}</span>
                          </div>
                          {log.rejection_reason && (
                            <p style={styles.timelineReason}>Reason: {log.rejection_reason}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <style>{`
        @keyframes gf-modal-in {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes gf-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
};

/* ─── sub-components ─────────────────────────────────────────────────── */
function InfoRow({ Icon, text }) {
  return (
    <div style={styles.infoRow}>
      <Icon size={13} style={{ color: 'var(--accent-lime)', flexShrink: 0 }} />
      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{text}</span>
    </div>
  );
}

function ReasonBox({ label, text }) {
  return (
    <div style={styles.reasonBox}>
      <span style={styles.reasonLabel}>{label}</span>
      <p style={styles.reasonText}>{text}</p>
    </div>
  );
}

/* ─── inline styles using platform CSS vars ──────────────────────────── */
const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    zIndex: 9998,
    animation: 'gf-overlay-in 0.2s ease-out',
  },
  modalWrap: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    pointerEvents: 'none',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: 'var(--card-bg)',
    borderRadius: '10px',
    boxShadow: '0 12px 36px rgba(0,0,0,0.7)',
    border: '1px solid var(--input-border)',
    overflow: 'hidden',
    position: 'relative',
    pointerEvents: 'auto',
    animation: 'gf-modal-in 0.25s cubic-bezier(0.22,1,0.36,1)',
  },
  accentBar: {
    height: '3px',
    background: 'var(--accent-lime)',
    width: '100%',
  },
  closeBtn: {
    position: 'absolute',
    top: '14px',
    right: '14px',
    background: 'transparent',
    border: '1px solid var(--input-border)',
    borderRadius: '6px',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '5px 7px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.15s, border-color 0.15s',
    lineHeight: 1,
  },
  body: {
    padding: '28px 28px 28px 28px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  iconRing: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'rgba(112,214,77,0.1)',
    border: '1.5px solid rgba(112,214,77,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--accent-lime)',
    marginBottom: '16px',
  },
  title: {
    color: 'var(--text-main)',
    fontSize: '1.25rem',
    fontWeight: 800,
    letterSpacing: '0.3px',
    marginBottom: '8px',
  },
  titleUnderline: {
    width: '40px',
    height: '2px',
    background: 'var(--accent-lime)',
    borderRadius: '2px',
    marginBottom: '16px',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '1.2px',
    background: 'rgba(112,214,77,0.1)',
    color: 'var(--accent-lime)',
    border: '1px solid rgba(112,214,77,0.25)',
    marginBottom: '14px',
    textTransform: 'uppercase',
  },
  description: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    lineHeight: 1.6,
    marginBottom: '16px',
  },
  emailHighlight: {
    color: 'var(--accent-lime)',
    fontWeight: 600,
    wordBreak: 'break-all',
  },
  infoCard: {
    width: '100%',
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    borderRadius: '6px',
    padding: '10px 12px',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textAlign: 'left',
  },
  reasonBox: {
    width: '100%',
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    borderRadius: '6px',
    padding: '10px 12px',
    textAlign: 'left',
    marginBottom: '12px',
  },
  reasonLabel: {
    display: 'block',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '1.5px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    marginBottom: '6px',
  },
  reasonText: {
    color: 'var(--text-main)',
    fontSize: '0.82rem',
    lineHeight: 1.5,
    margin: 0,
  },
  cooldownBox: {
    width: '100%',
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    borderRadius: '6px',
    padding: '14px 12px',
    textAlign: 'center',
    marginBottom: '18px',
  },
  cooldownLabel: {
    display: 'block',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '1.5px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  cooldownTimer: {
    color: 'var(--text-main)',
    fontSize: '1.4rem',
    fontWeight: 800,
    fontVariantNumeric: 'tabular-nums',
    marginBottom: '6px',
    letterSpacing: '0.5px',
  },
  cooldownSub: {
    color: 'var(--text-muted)',
    fontSize: '0.75rem',
    margin: 0,
  },
  btnRow: {
    display: 'flex',
    gap: '10px',
    width: '100%',
  },
  primaryBtn: {
    flex: 1,
    background: 'var(--accent-lime)',
    color: '#000000',
    border: 'none',
    borderRadius: '6px',
    padding: '11px 16px',
    fontSize: '0.88rem',
    fontWeight: 800,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    transition: 'opacity 0.15s',
  },
  ghostBtn: {
    flex: 1,
    background: 'transparent',
    color: 'var(--text-muted)',
    border: '1px solid var(--input-border)',
    borderRadius: '6px',
    padding: '11px 16px',
    fontSize: '0.88rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
    transition: 'color 0.15s, border-color 0.15s',
  },
  historySection: {
    width: '100%',
    textAlign: 'left',
    marginTop: '24px',
    borderTop: '1px solid var(--input-border)',
    paddingTop: '20px',
  },
  historyTitle: {
    fontSize: '0.75rem',
    fontWeight: 800,
    color: 'var(--text-muted)',
    letterSpacing: '1px',
    marginBottom: '14px',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingLeft: '4px',
  },
  timelineItem: {
    display: 'flex',
    gap: '12px',
  },
  timelineBadgeCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  timelineBadge: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: '4px',
  },
  timelineLine: {
    width: '2px',
    backgroundColor: 'var(--input-border)',
    position: 'absolute',
    top: '14px',
    bottom: '-16px',
  },
  timelineContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  timelineHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '10px',
  },
  timelineAction: {
    fontSize: '0.82rem',
    fontWeight: 700,
    color: 'var(--text-main)',
  },
  timelineDate: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
  },
  timelineReason: {
    fontSize: '0.78rem',
    color: '#f87171',
    margin: '4px 0 0 0',
    background: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid rgba(239, 68, 68, 0.1)',
    borderRadius: '4px',
    padding: '6px 10px',
    lineHeight: 1.4,
  },
};

export default AuthStatusModal;
