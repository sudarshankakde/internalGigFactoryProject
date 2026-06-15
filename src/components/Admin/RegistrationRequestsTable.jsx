import React from 'react';
import { Eye, Check, X } from 'lucide-react';
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

export const RegistrationRequestsTable = ({ pageItems, isLoading, onSelectReq, onApprove, onReject, reviewQueryFetching }) => {
  const S = {
    btn: { display: 'inline-flex', alignItems: 'center', gap: '5px', borderRadius: '5px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', border: 'none', transition: 'opacity 0.15s' },
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr>
            {['Full Name', 'Email', 'Mobile', 'Role', 'Status', 'Submitted', 'Actions'].map(h => (
              <th key={h} style={{ color: '#6b7280', fontSize: '0.68rem', fontWeight: 700, padding: '12px 14px', borderBottom: '1px solid #23232a', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                {h.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <tr key={i}>
                {[120, 160, 90, 80, 70, 100, 140].map((w, j) => (
                  <td key={j} style={{ padding: '14px', borderBottom: '1px solid #1a1a22' }}>
                    <div className="skeleton-pulse" style={{ width: `${w}px`, height: '14px', borderRadius: '4px' }} />
                  </td>
                ))}
              </tr>
            ))
          ) : pageItems.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: '#6b7280', fontSize: '0.88rem' }}>
                No requests match your filters.
              </td>
            </tr>
          ) : pageItems.map(req => (
            <tr key={req.id} style={{ transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#181818'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <td style={{ padding: '14px', borderBottom: '1px solid #1a1a22', verticalAlign: 'middle' }}>
                <strong style={{ color: '#fff', fontSize: '0.88rem' }}>{req.full_name}</strong>
              </td>
              <td style={{ padding: '14px', borderBottom: '1px solid #1a1a22', color: '#8a8a8a', fontSize: '0.83rem', verticalAlign: 'middle' }}>{req.email}</td>
              <td style={{ padding: '14px', borderBottom: '1px solid #1a1a22', color: '#8a8a8a', fontSize: '0.83rem', verticalAlign: 'middle' }}>{req.mobile}</td>
              <td style={{ padding: '14px', borderBottom: '1px solid #1a1a22', verticalAlign: 'middle' }}><RoleChip role={req.role} /></td>
              <td style={{ padding: '14px', borderBottom: '1px solid #1a1a22', verticalAlign: 'middle' }}><StatusBadge status={req.status} /></td>
              <td style={{ padding: '14px', borderBottom: '1px solid #1a1a22', color: '#6b6b6b', fontSize: '0.8rem', verticalAlign: 'middle' }}>{fmtDate(req.created_at)}</td>
              <td style={{ padding: '14px', borderBottom: '1px solid #1a1a22', verticalAlign: 'middle' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button onClick={() => onSelectReq(req)} style={{ ...S.btn, background: 'transparent', border: '1px solid #23232a', color: '#8a8a8a', padding: '5px 8px' }} title="View details">
                    <Eye size={13} />
                  </button>
                  {req.status === 'pending' && (<>
                    <button onClick={() => onApprove(req.id)} disabled={reviewQueryFetching} style={{ ...S.btn, background: 'rgba(112,214,77,0.1)', color: '#70d64d', border: '1px solid rgba(112,214,77,0.3)', padding: '5px 9px' }}>
                      <Check size={12} /> Approve
                    </button>
                    <button onClick={() => onReject(req)} disabled={reviewQueryFetching} style={{ ...S.btn, background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)', padding: '5px 9px' }}>
                      <X size={12} /> Reject
                    </button>
                  </>)}
                  {req.status !== 'pending' && (
                    <button onClick={() => onSelectReq(req)} style={{ ...S.btn, background: 'transparent', border: '1px solid #70d64d', color: '#70d64d', padding: '4px 9px', fontSize: '0.72rem' }}>
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
  );
};
export default RegistrationRequestsTable;
