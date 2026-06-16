import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';


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

export function ActivityHistoryView({ id }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-history', id],
    queryFn: async () => {
      const response = await api.get(`/admin/users/${id}/profile-history`);
      return response;
    },
    enabled: !!id
  });

  if (isLoading) return <div style={{ color: '#8a8a8a', fontSize: '0.85rem', padding: '40px', textAlign: 'center' }}>Loading history logs...</div>;
  if (error) return <div style={{ color: '#ef4444', fontSize: '0.85rem', padding: '40px', textAlign: 'center' }}>Error loading logs: {error.message || 'Unknown error'}</div>;

  const { activityLogs = [], loginHistory = [], blockedHistory = [] } = data || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Suspension History */}
      {blockedHistory.length > 0 && (
        <div style={{ background: '#1c0c0e', border: '1px solid #ef444433', borderRadius: '8px', padding: '18px' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#ef4444', margin: '0 0 12px', paddingBottom: '6px', borderBottom: '1px solid #ef444422' }}>
            Suspension History Logs
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {blockedHistory.map(log => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#d1d5db', borderBottom: '1px solid #ef444411', paddingBottom: '6px' }}>
                <div>
                  <strong>Reason:</strong> {log.reason}
                </div>
                <span style={{ color: '#8a8a8a', fontSize: '0.72rem' }}>
                  {new Date(log.created_at).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
  {/* Action / Activity Logs */}
      <div style={{ background: '#0c0c0e', border: '1px solid #23232a', borderRadius: '8px', padding: '18px' }}>
        <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#70d64d', margin: '0 0 12px', paddingBottom: '6px', borderBottom: '1px solid #23232a' }}>
          Platform Activity Logs
        </h4>
        {activityLogs.length === 0 ? (
          <p style={{ color: '#8a8a8a', fontSize: '0.8rem', margin: 0, fontStyle: 'italic' }}>No activity records found.</p>
        ) : (
          <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activityLogs.map(log => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#d1d5db', borderBottom: '1px solid #1a1a22', paddingBottom: '6px' }}>
                <div>
                  <span style={{ color: '#38bdf8', fontWeight: 700, marginRight: '8px', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                    [{log.module || 'System'}]
                  </span>
                  <span>{log.action}</span>
                  {log.ip_address && <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '2px' }}>IP: {log.ip_address}</div>}
                </div>
                <span style={{ color: '#8a8a8a', fontSize: '0.72rem' }}>
                  {log.created_at ? new Date(log.created_at).toLocaleString('en-IN') : '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Login History */}
      <div style={{ background: '#0c0c0e', border: '1px solid #23232a', borderRadius: '8px', padding: '18px' }}>
        <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#c084fc', margin: '0 0 12px', paddingBottom: '6px', borderBottom: '1px solid #23232a' }}>
          Recent Login Attempts
        </h4>
        {loginHistory.length === 0 ? (
          <p style={{ color: '#8a8a8a', fontSize: '0.8rem', margin: 0, fontStyle: 'italic' }}>No login records found.</p>
        ) : (
          <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {loginHistory.map(log => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#d1d5db', borderBottom: '1px solid #1a1a22', paddingBottom: '6px' }}>
                <div>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{log.browser || 'Browser'}</span> on <span style={{ color: '#a78bfa' }}>{log.device || 'Device'}</span>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '2px' }}>IP: {log.ip_address || '—'}</div>
                </div>
                <span style={{ color: '#8a8a8a', fontSize: '0.72rem' }}>
                  {log.login_at ? new Date(log.login_at).toLocaleString('en-IN') : '—'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    
    </div>
  );
}

