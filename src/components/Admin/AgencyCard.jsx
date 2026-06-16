import React from 'react';
import { Mail, Phone, Briefcase, Users, MapPin, Globe } from 'lucide-react';
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

export const AgencyCard = ({ agencies, isLoading, onSelectAgency }) => {
  if (isLoading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '16px' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ background: '#121215', border: '1px solid #23232a', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="skeleton-pulse" style={{ width: '48px', height: '48px', borderRadius: '8px' }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton-pulse" style={{ width: '70%', height: '14px', borderRadius: '4px', marginBottom: '6px' }} />
                <div className="skeleton-pulse" style={{ width: '30%', height: '10px', borderRadius: '4px' }} />
              </div>
            </div>
            <div className="skeleton-pulse" style={{ width: '80%', height: '12px', borderRadius: '4px' }} />
            <div style={{ borderTop: '1px solid #1c1c20', paddingTop: '12px' }}>
              <div className="skeleton-pulse" style={{ width: '100%', height: '18px', borderRadius: '4px' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (agencies.length === 0) {
    return (
      <div style={{ background: '#121215', border: '1px solid #23232a', borderRadius: '10px', padding: '48px', textAlign: 'center', color: '#6b7280' }}>
        No agencies found.
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '16px' }}>
      {agencies.map(a => {
        const ap = a.agency_profile;
        return (
          <div
            key={a.id}
            onClick={() => onSelectAgency(a)}
            style={{
              background: '#121215',
              border: '1px solid #23232a',
              borderRadius: '10px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              position: 'relative',
              transition: 'transform 0.2s, border-color 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.border = '1px solid #70d64d';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.border = '1px solid #23232a';
            }}
          >
            {/* Status Badge top right */}
            <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
              <StatusBadge status={a.account_status} />
            </div>

            {/* Profile header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AgencyLogo name={ap?.agency_name || a.full_name} logo={ap?.logo} size={46} />
              <div style={{ overflow: 'hidden', paddingRight: '60px' }}>
                <h4 style={{ color: '#fff', fontSize: '0.92rem', fontWeight: 700, margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {ap?.agency_name || a.full_name}
                </h4>
                {ap?.website && (
                  <a href={ap.website} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#70d64d', fontSize: '0.7rem', textDecoration: 'none', marginTop: '2px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} onClick={e => e.stopPropagation()}>
                    <Globe size={10} style={{ flexShrink: 0 }} /> {ap.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
            </div>

            {/* Industry chip & info */}
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                {ap?.industry ? (
                  <span style={{ background: '#1c1917', color: '#f59e0b', fontSize: '0.65rem', fontWeight: 600, padding: '2px 8px', borderRadius: '4px' }}>
                    {ap.industry}
                  </span>
                ) : (
                  <span style={{ color: '#4b4b57', fontSize: '0.7rem', fontStyle: 'italic' }}>No industry specified</span>
                )}
              </div>
              {/* Location & Contact Person */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.75rem', color: '#8a8a8a' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={11} color="#6b7280" />
                  {ap?.city && ap?.country ? `${ap.city}, ${ap.country}` : 'Remote'}
                </span>
                <span style={{ fontWeight: 500, color: '#d1d5db' }}>
                  POC: {a.full_name}
                </span>
              </div>
            </div>

            {/* Key stats: team members & projects */}
            <div style={{ display: 'flex', gap: '10px', background: '#0c0c0e', padding: '10px', borderRadius: '6px', border: '1px solid #1a1a22', justifyContent: 'space-around' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <span style={{ color: '#6b7280', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase' }}>Team</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <Users size={12} color="#c084fc" />
                  <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>
                    {ap?._count?.team_members ?? ap?.employee_count ?? 0}
                  </span>
                </div>
              </div>
              <div style={{ width: '1px', background: '#1a1a22' }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <span style={{ color: '#6b7280', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase' }}>Projects</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <Briefcase size={12} color="#70d64d" />
                  <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>
                    {ap?.total_projects ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div style={{ background: '#0c0c0e', padding: '10px', borderRadius: '6px', border: '1px solid #1a1a22' }}>
              <CompletionBar value={ap?.profile_completion || 0} />
            </div>

            {/* Contact and Registered Date Footer */}
            <div style={{ borderTop: '1px solid #1a1a22', paddingTop: '12px', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8a8a8a', fontSize: '0.74rem', overflow: 'hidden' }}>
                <Mail size={12} color="#6b7280" style={{ flexShrink: 0 }} />
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{a.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8a8a8a', fontSize: '0.74rem' }}>
                <Phone size={12} color="#6b7280" style={{ flexShrink: 0 }} />
                <span>{a.mobile || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1a1a22', paddingTop: '8px', marginTop: '4px', fontSize: '0.7rem', color: '#5b5b67' }}>
                <span>Registered: {fmtDate(a.created_at)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default AgencyCard;
