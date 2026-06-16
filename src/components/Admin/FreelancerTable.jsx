import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { StatusBadge, CompletionBar } from '../AdminShared';

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

function Avatar({ name, photo, size = 40 }) {
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  return photo ? (
    <img src={photo} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid #23232a' }} />
  ) : (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg,#1e293b,#2563eb22)', border: '1px solid #23232a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${size * 0.35}px`, fontWeight: 800, color: '#38bdf8', flexShrink: 0 }}>
      {initials}
    </div>
  );
}

export const FreelancerTable = ({ freelancers, isLoading, onSelectFreelancer }) => {
  return (
    <div style={{ background: '#121215', border: '1px solid #23232a', borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#0c0c0e' }}>
              {['Freelancer', 'Contact', 'Title & Skills', 'Location', 'Rate', 'Profile', 'Status', 'Registered'].map(h => (
                <th key={h} style={{ color: '#6b7280', fontSize: '0.65rem', fontWeight: 700, padding: '14px 16px', borderBottom: '1px solid #23232a', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(8)].map((_, i) => (
                <tr key={i}>
                  {[200, 160, 180, 100, 80, 100, 80, 90].map((w, j) => (
                    <td key={j} style={{ padding: '16px', borderBottom: '1px solid #1a1a22' }}>
                      <div className="skeleton-pulse" style={{ width: `${w}px`, height: '14px', borderRadius: '4px' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : freelancers.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
                  No freelancers found.
                </td>
              </tr>
            ) : freelancers.map(f => {
              const fp = f.freelancer_profile;
              const skills = fp?.freelancer_skills?.slice(0, 3).map(s => s.skill_name) || [];
              return (
                <tr key={f.id}
                  onClick={() => onSelectFreelancer(f)}
                  onMouseEnter={e => e.currentTarget.style.background = '#181820'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  style={{ transition: 'background 0.1s', cursor: 'pointer' }}
                >
                  {/* Freelancer info */}
                  <td style={{ padding: '16px', borderBottom: '1px solid #1a1a22', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Avatar name={f.full_name} photo={f.profile_photo} />
                      <div>
                        <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem', margin: 0 }}>{f.full_name}</p>
                        <p style={{ color: '#6b7280', fontSize: '0.72rem', margin: '2px 0 0' }}>
                          {f.is_verified ? '✓ Verified' : 'Unverified'}
                        </p>
                      </div>
                    </div>
                  </td>
                  {/* Contact */}
                  <td style={{ padding: '16px', borderBottom: '1px solid #1a1a22', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8a8a8a', fontSize: '0.75rem' }}>
                        <Mail size={11} color="#6b7280" /> {f.email}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8a8a8a', fontSize: '0.75rem' }}>
                        <Phone size={11} color="#6b7280" /> {f.mobile || '—'}
                      </span>
                    </div>
                  </td>
                  {/* Title + Skills */}
                  <td style={{ padding: '16px', borderBottom: '1px solid #1a1a22', verticalAlign: 'middle' }}>
                    <p style={{ color: '#d1d5db', fontSize: '0.82rem', margin: '0 0 6px', fontWeight: 600 }}>{fp?.title || '—'}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {skills.map(s => (
                        <span key={s} style={{ background: '#1e293b', color: '#38bdf8', fontSize: '0.62rem', fontWeight: 600, padding: '2px 6px', borderRadius: '4px' }}>{s}</span>
                      ))}
                      {(fp?.freelancer_skills?.length || 0) > 3 && (
                        <span style={{ color: '#6b7280', fontSize: '0.62rem', padding: '2px 4px' }}>+{fp.freelancer_skills.length - 3}</span>
                      )}
                    </div>
                  </td>
                  {/* Location */}
                  <td style={{ padding: '16px', borderBottom: '1px solid #1a1a22', verticalAlign: 'middle' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8a8a8a', fontSize: '0.78rem' }}>
                      <MapPin size={11} color="#6b7280" />
                      {fp?.city && fp?.country ? `${fp.city}, ${fp.country}` : '—'}
                    </span>
                  </td>
                  {/* Rate */}
                  <td style={{ padding: '16px', borderBottom: '1px solid #1a1a22', verticalAlign: 'middle' }}>
                    <span style={{ color: '#70d64d', fontWeight: 700, fontSize: '0.82rem' }}>
                      {fp?.hourly_rate ? `₹${fp.hourly_rate}/hr` : '—'}
                    </span>
                  </td>
                  {/* Completion */}
                  <td style={{ padding: '16px', borderBottom: '1px solid #1a1a22', verticalAlign: 'middle', minWidth: '100px' }}>
                    <CompletionBar value={fp?.profile_completion || 0} />
                  </td>
                  {/* Status */}
                  <td style={{ padding: '16px', borderBottom: '1px solid #1a1a22', verticalAlign: 'middle' }}>
                    <StatusBadge status={f.account_status} />
                  </td>
                  {/* Joined */}
                  <td style={{ padding: '16px', borderBottom: '1px solid #1a1a22', color: '#6b7280', fontSize: '0.75rem', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                    {fmtDate(f.created_at)}
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
