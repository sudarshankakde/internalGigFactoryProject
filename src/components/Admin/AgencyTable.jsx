import React from 'react';
import { Mail, Phone, Briefcase, Users, Globe } from 'lucide-react';
import { StatusBadge, CompletionBar } from '../AdminShared';

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

export const AgencyTable = ({ agencies, isLoading, onSelectAgency }) => {
  return (
    <div style={{ background: '#121215', border: '1px solid #23232a', borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#0c0c0e' }}>
              {['Agency', 'Contact Person', 'Contact', 'Industry', 'Team', 'Projects', 'Profile', 'Status', 'Joined'].map(h => (
                <th key={h} style={{ color: '#6b7280', fontSize: '0.65rem', fontWeight: 700, padding: '14px 16px', borderBottom: '1px solid #23232a', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(7)].map((_, i) => (
                <tr key={i}>
                  {[200, 130, 160, 100, 60, 60, 110, 80, 90].map((w, j) => (
                    <td key={j} style={{ padding: '16px', borderBottom: '1px solid #1a1a22' }}>
                      <div className="skeleton-pulse" style={{ width: `${w}px`, height: '14px', borderRadius: '4px' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : agencies.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
                  No agencies found.
                </td>
              </tr>
            ) : agencies.map(a => {
              const ap = a.agency_profile;
              return (
                <tr key={a.id}
                  onClick={() => onSelectAgency(a)}
                  onMouseEnter={e => e.currentTarget.style.background = '#181820'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  style={{ transition: 'background 0.1s', cursor: 'pointer' }}
                >
                  {/* Agency name + logo */}
                  <td style={{ padding: '16px', borderBottom: '1px solid #1a1a22', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <AgencyLogo name={ap?.agency_name || a.full_name} logo={ap?.logo} />
                      <div>
                        <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem', margin: 0 }}>
                          {ap?.agency_name || a.full_name}
                        </p>
                        {ap?.website && (
                          <a href={ap.website} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#70d64d', fontSize: '0.7rem', textDecoration: 'none', marginTop: '2px' }} onClick={e => e.stopPropagation()}>
                            <Globe size={10} /> {ap.website.replace(/^https?:\/\//, '')}
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  {/* Contact person */}
                  <td style={{ padding: '16px', borderBottom: '1px solid #1a1a22', verticalAlign: 'middle' }}>
                    <span style={{ color: '#d1d5db', fontSize: '0.82rem', fontWeight: 600 }}>{a.full_name}</span>
                  </td>
                  {/* Contact info */}
                  <td style={{ padding: '16px', borderBottom: '1px solid #1a1a22', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8a8a8a', fontSize: '0.75rem' }}>
                        <Mail size={11} color="#6b7280" /> {a.email}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8a8a8a', fontSize: '0.75rem' }}>
                        <Phone size={11} color="#6b7280" /> {a.mobile || '—'}
                      </span>
                    </div>
                  </td>
                  {/* Industry */}
                  <td style={{ padding: '16px', borderBottom: '1px solid #1a1a22', verticalAlign: 'middle' }}>
                    <span style={{ color: '#8a8a8a', fontSize: '0.78rem' }}>{ap?.industry || '—'}</span>
                  </td>
                  {/* Team size */}
                  <td style={{ padding: '16px', borderBottom: '1px solid #1a1a22', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Users size={12} color="#c084fc" />
                      <span style={{ color: '#d1d5db', fontSize: '0.82rem', fontWeight: 600 }}>
                        {ap?._count?.team_members ?? ap?.employee_count ?? '—'}
                      </span>
                    </div>
                  </td>
                  {/* Projects */}
                  <td style={{ padding: '16px', borderBottom: '1px solid #1a1a22', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Briefcase size={12} color="#70d64d" />
                      <span style={{ color: '#d1d5db', fontSize: '0.82rem', fontWeight: 600 }}>
                        {ap?.total_projects ?? '—'}
                      </span>
                    </div>
                  </td>
                  {/* Completion */}
                  <td style={{ padding: '16px', borderBottom: '1px solid #1a1a22', verticalAlign: 'middle', minWidth: '100px' }}>
                    <CompletionBar value={ap?.profile_completion || 0} />
                  </td>
                  {/* Status */}
                  <td style={{ padding: '16px', borderBottom: '1px solid #1a1a22', verticalAlign: 'middle' }}>
                    <StatusBadge status={a.account_status} />
                  </td>
                  {/* Joined */}
                  <td style={{ padding: '16px', borderBottom: '1px solid #1a1a22', color: '#6b7280', fontSize: '0.75rem', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                    {fmtDate(a.created_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AgencyTable;
