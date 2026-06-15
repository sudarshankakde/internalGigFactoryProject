import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const STATUS_CFG = {
  approved:  { bg: 'rgba(112,214,77,0.12)',  color: '#70d64d',  label: 'Approved'  },
  pending:   { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b',  label: 'Pending'   },
  inactive:  { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b',  label: 'Inactive'  },
  rejected:  { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444',  label: 'Rejected'  },
  suspended: { bg: 'rgba(107,114,128,0.12)', color: '#6b7280',  label: 'Suspended' },
};

export function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.pending;
  return (
    <span style={{ background: cfg.bg, color: cfg.color, fontSize: '0.68rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
      {cfg.label.toUpperCase()}
    </span>
  );
}

export function CompletionBar({ value = 0 }) {
  const color = value >= 70 ? '#70d64d' : value >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ color: '#6b7280', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase' }}>Profile</span>
        <span style={{ color, fontSize: '0.65rem', fontWeight: 700 }}>{value}%</span>
      </div>
      <div style={{ height: '4px', background: '#1c1c20', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: '99px', transition: 'width 0.4s' }} />
      </div>
    </div>
  );
}

export function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  const pages = [];
  const start = Math.max(1, page - 2);
  const end   = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  const base    = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '32px', borderRadius: '6px', border: '1px solid #23232a', background: '#0c0c0e', color: '#8a8a8a', fontSize: '0.8rem', cursor: 'pointer', padding: '0 8px' };
  const active  = { ...base, background: '#70d64d', color: '#000', borderColor: '#70d64d', fontWeight: 700 };
  const disabled = { ...base, opacity: 0.3, cursor: 'not-allowed' };

  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
      <button onClick={() => onPage(page - 1)} disabled={page === 1} style={page === 1 ? disabled : base}><ChevronLeft size={14} /></button>
      {start > 1 && <><button onClick={() => onPage(1)} style={base}>1</button><span style={{ color: '#4b4b57' }}>…</span></>}
      {pages.map(p => <button key={p} onClick={() => onPage(p)} style={p === page ? active : base}>{p}</button>)}
      {end < totalPages && <><span style={{ color: '#4b4b57' }}>…</span><button onClick={() => onPage(totalPages)} style={base}>{totalPages}</button></>}
      <button onClick={() => onPage(page + 1)} disabled={page === totalPages} style={page === totalPages ? disabled : base}><ChevronRight size={14} /></button>
    </div>
  );
}
