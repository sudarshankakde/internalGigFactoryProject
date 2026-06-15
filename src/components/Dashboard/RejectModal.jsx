import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { toast } from 'react-toastify';

export const RejectModal = ({ request, onClose, onConfirm, isPending }) => {
  const [reason, setReason] = useState('');
  if (!request) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      toast.warning('Rejection reason is required.');
      return;
    }
    onConfirm(request.id, reason.trim());
  };

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(3px)',zIndex:900 }} />
      <div style={{ position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'100%',maxWidth:'420px',background:'#181818',border:'1px solid #2c2c2c',borderRadius:'10px',overflow:'hidden',zIndex:901,boxShadow:'0 20px 60px rgba(0,0,0,0.8)' }}>
        <div style={{ height:'3px',background:'#ef4444' }} />
        <div style={{ padding:'20px 24px', borderBottom:'1px solid #2c2c2c', display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ width:'36px',height:'36px',background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
            <AlertCircle size={18} color="#ef4444" />
          </div>
          <div style={{ flex:1 }}>
            <p style={{ color:'#fff',fontWeight:800,fontSize:'0.95rem',margin:0 }}>Reject Application</p>
            <p style={{ color:'#6b7280',fontSize:'0.78rem',margin:'2px 0 0' }}>{request.full_name} — {request.role}</p>
          </div>
          <button onClick={onClose} style={{ background:'none',border:'1px solid #2c2c2c',color:'#8a8a8a',borderRadius:'6px',padding:'5px 7px',cursor:'pointer',display:'flex',alignItems:'center' }}><X size={15}/></button>
        </div>
        <div style={{ padding:'20px 24px' }}>
          <label style={{ color:'#8a8a8a',fontSize:'0.78rem',fontWeight:600,display:'block',marginBottom:'8px' }}>Reason for Rejection <span style={{color:'#ef4444'}}>*</span></label>
          <textarea
            rows={4}
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Describe why this application is being rejected…"
            autoFocus
            style={{ width:'100%',background:'#1f1f1f',border:'1px solid #2c2c2c',borderRadius:'6px',color:'#fff',fontSize:'0.85rem',padding:'10px 12px',outline:'none',resize:'vertical',fontFamily:'inherit' }}
          />
          <div style={{ display:'flex',gap:'10px',marginTop:'16px' }}>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isPending}
              style={{ flex:1,background:'rgba(239,68,68,0.1)',color:'#ef4444',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'6px',padding:'10px 16px',fontSize:'0.83rem',fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px' }}
            >
              <X size={13}/> {isPending ? 'Rejecting…' : 'Confirm Rejection'}
            </button>
            <button type="button" onClick={onClose} style={{ background:'transparent',border:'1px solid #2c2c2c',color:'#8a8a8a',borderRadius:'6px',padding:'10px 16px',fontSize:'0.83rem',cursor:'pointer' }}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
};
