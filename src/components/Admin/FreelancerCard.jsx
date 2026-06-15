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

export const FreelancerCard = ({ freelancers, isLoading, onSelectFreelancer }) => {
  if (isLoading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '16px' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ background: '#121215', border: '1px solid #23232a', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="skeleton-pulse" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton-pulse" style={{ width: '60%', height: '14px', borderRadius: '4px', marginBottom: '6px' }} />
                <div className="skeleton-pulse" style={{ width: '40%', height: '10px', borderRadius: '4px' }} />
              </div>
            </div>
            <div className="skeleton-pulse" style={{ width: '80%', height: '12px', borderRadius: '4px' }} />
            <div style={{ display: 'flex', gap: '6px' }}>
              <div className="skeleton-pulse" style={{ width: '50px', height: '18px', borderRadius: '4px' }} />
              <div className="skeleton-pulse" style={{ width: '60px', height: '18px', borderRadius: '4px' }} />
              <div className="skeleton-pulse" style={{ width: '45px', height: '18px', borderRadius: '4px' }} />
            </div>
            <div style={{ borderTop: '1px solid #1c1c20', paddingTop: '12px' }}>
              <div className="skeleton-pulse" style={{ width: '100%', height: '18px', borderRadius: '4px' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (freelancers.length === 0) {
    return (
      <div style={{ background: '#121215', border: '1px solid #23232a', borderRadius: '10px', padding: '48px', textAlign: 'center', color: '#6b7280' }}>
        No freelancers found.
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '16px' }}>
      {freelancers.map(f => {
        const fp = f.freelancer_profile;
        const skills = fp?.freelancer_skills?.slice(0, 3).map(s => s.skill_name) || [];
        return (
          <div
            key={f.id}
            onClick={() => onSelectFreelancer(f)}
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
              <StatusBadge status={f.account_status} />
            </div>

            {/* Profile header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar name={f.full_name} photo={f.profile_photo} size={46} />
              <div style={{ overflow: 'hidden', paddingRight: '60px' }}>
                <h4 style={{ color: '#fff', fontSize: '0.92rem', fontWeight: 700, margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {f.full_name}
                </h4>
                <p style={{ color: '#6b7280', fontSize: '0.72rem', margin: '2px 0 0' }}>
                  {f.is_verified ? '✓ Verified Member' : 'Unverified Member'}
                </p>
              </div>
            </div>

            {/* Designation */}
            <div>
              <p style={{ color: '#d1d5db', fontSize: '0.82rem', margin: 0, fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {fp?.title || 'No Title'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8a8a8a', fontSize: '0.75rem' }}>
                  <MapPin size={11} color="#6b7280" />
                  {fp?.city && fp?.country ? `${fp.city}, ${fp.country}` : 'Remote'}
                </span>
                <span style={{ color: '#70d64d', fontWeight: 700, fontSize: '0.82rem' }}>
                  {fp?.hourly_rate ? `₹${fp.hourly_rate}/hr` : '—'}
                </span>
              </div>
            </div>

            {/* Skills chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', minHeight: '22px' }}>
              {skills.map(s => (
                <span key={s} style={{ background: '#1e293b', color: '#38bdf8', fontSize: '0.62rem', fontWeight: 600, padding: '2px 6px', borderRadius: '4px' }}>
                  {s}
                </span>
              ))}
              {(fp?.freelancer_skills?.length || 0) > 3 && (
                <span style={{ color: '#6b7280', fontSize: '0.62rem', padding: '2px 4px', alignSelf: 'center' }}>
                  +{fp.freelancer_skills.length - 3} more
                </span>
              )}
              {skills.length === 0 && (
                <span style={{ color: '#4b4b57', fontSize: '0.7rem', fontStyle: 'italic' }}>No skills listed</span>
              )}
            </div>

            {/* Profile Completion */}
            <div style={{ background: '#0c0c0e', padding: '10px', borderRadius: '6px', border: '1px solid #1a1a22' }}>
              <CompletionBar value={fp?.profile_completion || 0} />
            </div>

            {/* Contact and Join Date Footer */}
            <div style={{ borderTop: '1px solid #1a1a22', paddingTop: '12px', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8a8a8a', fontSize: '0.74rem', overflow: 'hidden' }}>
                <Mail size={12} color="#6b7280" style={{ flexShrink: 0 }} />
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{f.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8a8a8a', fontSize: '0.74rem' }}>
                <Phone size={12} color="#6b7280" style={{ flexShrink: 0 }} />
                <span>{f.mobile || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1a1a22', paddingTop: '8px', marginTop: '4px', fontSize: '0.7rem', color: '#5b5b67' }}>
                <span>Joined: {fmtDate(f.created_at)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
