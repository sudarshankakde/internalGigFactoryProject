import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

export const RegistrationRequestRejectModal = ({ request, onClose, onConfirm, isPending }) => {
  const [reason, setReason] = useState('');
  const [noReason, setNoReason] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(request.id, noReason ? '' : reason.trim());
  };
  const S = {
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 700 },
    modal: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '100%', maxWidth: '440px', background: '#181818', border: '1px solid #2c2c2c', borderRadius: '10px', overflow: 'hidden', zIndex: 701, boxShadow: '0 20px 60px rgba(0,0,0,0.8)' },
    textarea: { width: '100%', background: '#1f1f1f', border: '1px solid #2c2c2c', borderRadius: '6px', color: '#fff', fontSize: '0.85rem', padding: '10px 12px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' },
    btn: { display: 'inline-flex', alignItems: 'center', gap: '5px', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', border: 'none' },
  };
  return (
    <>
      <div style={S.overlay} onClick={onClose} />
      <div style={S.modal}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 24px', borderBottom: '1px solid #2c2c2c' }}>
          <div style={{ width: '36px', height: '36px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertCircle size={20} color="#ef4444" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, margin: 0 }}>Reject Application</h3>
            <p style={{ color: '#6b7280', fontSize: '0.78rem', margin: '2px 0 0' }}>{request?.full_name} — {request?.role}</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid #2c2c2c', color: '#8a8a8a', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer' }}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '0.82rem', cursor: 'pointer', marginBottom: '12px' }}>
            <input type="checkbox" checked={noReason} onChange={e => setNoReason(e.target.checked)} />
            Do not provide a rejection reason
          </label>
          {!noReason && (
            <textarea rows={4} value={reason} onChange={e => setReason(e.target.value)} placeholder="Describe why this application is being rejected…" style={S.textarea} autoFocus />
          )}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" style={{ ...S.btn, background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '9px 18px', flex: 1 }} disabled={isPending}>
              <X size={14} /> {isPending ? 'Rejecting…' : 'Confirm Rejection'}
            </button>
            <button type="button" onClick={onClose} style={{ ...S.btn, background: 'transparent', border: '1px solid #23232a', color: '#8a8a8a', padding: '9px 18px' }}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
};
export default RegistrationRequestRejectModal;
