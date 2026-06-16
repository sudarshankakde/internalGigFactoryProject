import React, { useState } from 'react';
import { Layers, Users, Mail, Phone, Briefcase, Calendar, ChevronDown, ChevronUp, FileText, Shield } from 'lucide-react';

/* ── Designation normaliser ─────────────────────────────────── */
function normaliseDesignation(raw = '') {
  const d = raw.trim().toLowerCase();
  if (!d || d === 'unknown') return 'UNASSIGNED';
  if (/\b(dev|developer|engineer|architect|backend|frontend|full.?stack|software)\b/.test(d)) return 'DEVELOPERS';
  if (/\b(design|designer|ui|ux|graphic|visual)\b/.test(d)) return 'DESIGNERS';
  if (/\b(pm|project.?manager|programme|program)\b/.test(d)) return 'PROJECT MANAGERS';
  if (/\b(qa|quality|tester|test)\b/.test(d)) return 'QA / TESTERS';
  if (/\b(devops|infra|cloud|sre|ops)\b/.test(d)) return 'DEVOPS / INFRA';
  if (/\b(data|analyst|bi|science|ml|ai)\b/.test(d)) return 'DATA / ANALYTICS';
  if (/\b(sales|business|bd|account|crm)\b/.test(d)) return 'SALES / BD';
  if (/\b(hr|human|recruit|talent|people)\b/.test(d)) return 'HR / TALENT';
  if (/\b(finance|cfo|billing)\b/.test(d)) return 'FINANCE';
  if (/\b(legal|compli|counsel)\b/.test(d)) return 'LEGAL';
  if (/\b(support|helpdesk|customer|service)\b/.test(d)) return 'SUPPORT';
  if (/\b(content|write|editor|copy|market|seo|social)\b/.test(d)) return 'MARKETING / CONTENT';
  return raw.trim().toUpperCase();
}

const SEGMENT_COLORS = [
  '#70d64d', '#38bdf8', '#c084fc', '#f59e0b',
  '#f87171', '#34d399', '#fb923c', '#a78bfa',
];

const STATUS_STYLES = {
  active:   { bg: 'rgba(112,214,77,0.12)',  color: '#70d64d'  },
  inactive: { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b'  },
  pending:  { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b'  },
  removed:  { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444'  },
};

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'M';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ── Individual member row ───────────────────────────────────── */
function MemberRow({ member, index }) {
  const [expanded, setExpanded] = useState(false);
  const initials = getInitials(member.full_name);
  const statusStyle = STATUS_STYLES[member.status?.toLowerCase()] || STATUS_STYLES.active;
  const colorIndex = index % SEGMENT_COLORS.length;
  const accentColor = SEGMENT_COLORS[colorIndex];

  return (
    <div style={{
      background: '#0c0c0e',
      border: '1px solid #1c1c22',
      borderLeft: `3px solid ${accentColor}`,
      borderRadius: '8px',
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      {/* Collapsed Row */}
      <div
        onClick={() => setExpanded(v => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Avatar */}
        <div style={{
          width: '38px', height: '38px', borderRadius: '50%',
          background: `${accentColor}22`,
          border: `1.5px solid ${accentColor}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.75rem', fontWeight: 800, color: accentColor,
          flexShrink: 0,
          overflow: 'hidden',
        }}>
          {member.user?.profile_photo ? (
            <img src={member.user.profile_photo} alt={member.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          ) : initials}
        </div>

        {/* Name + designation */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {member.full_name || 'Unnamed Member'}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '1px' }}>
            {member.designation || 'No designation'}
          </div>
        </div>

        {/* Status badge */}
        <span style={{
          fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase',
          padding: '2px 8px', borderRadius: '4px',
          background: statusStyle.bg, color: statusStyle.color,
          flexShrink: 0,
        }}>
          {member.status || 'Active'}
        </span>

        {/* Expand toggle */}
        <span style={{ color: '#4b4b57', flexShrink: 0 }}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </div>

      {/* Expanded Detail Panel */}
      {expanded && (
        <div style={{
          borderTop: '1px solid #1c1c22',
          padding: '14px 16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '12px',
          background: '#0a0a0d',
        }}>
          {member.email && (
            <DetailItem icon={<Mail size={12} />} label="Email" value={member.email} />
          )}
          {member.mobile && (
            <DetailItem icon={<Phone size={12} />} label="Mobile" value={member.mobile} />
          )}
          {member.joined_at && (
            <DetailItem icon={<Calendar size={12} />} label="Added On" value={formatDate(member.joined_at)} />
          )}
          {member.designation && (
            <DetailItem icon={<Briefcase size={12} />} label="Designation" value={member.designation} />
          )}
          {member.permissions && Object.keys(member.permissions).length > 0 && (
            <DetailItem
              icon={<Shield size={12} />}
              label="Permissions"
              value={Object.entries(member.permissions)
                .filter(([, v]) => v)
                .map(([k]) => k.replace(/_/g, ' '))
                .join(', ') || 'None'}
            />
          )}
          {member.resume_url && (
            <div style={{ gridColumn: '1 / -1' }}>
              <a
                href={member.resume_url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  fontSize: '0.75rem', fontWeight: 700, color: accentColor,
                  textDecoration: 'none', border: `1px solid ${accentColor}33`,
                  padding: '5px 12px', borderRadius: '5px', background: `${accentColor}11`,
                }}
              >
                <FileText size={12} /> View Resume / CV
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#4b4b57', marginBottom: '3px' }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#d1d5db', wordBreak: 'break-word' }}>{value || '—'}</div>
    </div>
  );
}

/* ── Main Export ─────────────────────────────────────────────── */
export const TeamStructure = ({ teamMembers = [], employeeCount }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const hasRealMembers = Array.isArray(teamMembers) && teamMembers.length > 0;

  if (!hasRealMembers) {
    const count = employeeCount || 0;
    return (
      <div className="pane-content-card">
        <h3><Layers size={18} /> Agency Team Structure</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 0', color: '#8a8a8a', fontSize: '0.85rem' }}>
          <Users size={28} style={{ color: '#4b4b57' }} />
          <div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', display: 'block' }}>{count}</span>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Employees — no member records available</span>
          </div>
        </div>
      </div>
    );
  }

  /* Designation breakdown */
  const groups = {};
  for (const m of teamMembers) {
    const key = normaliseDesignation(m.designation || '');
    groups[key] = (groups[key] || 0) + 1;
  }
  const sorted = Object.entries(groups).sort((a, b) => b[1] - a[1]);

  /* Filtered member list */
  const q = searchQuery.trim().toLowerCase();
  const filtered = teamMembers.filter(m =>
    !q ||
    (m.full_name || '').toLowerCase().includes(q) ||
    (m.designation || '').toLowerCase().includes(q) ||
    (m.email || '').toLowerCase().includes(q)
  );

  return (
    <div className="pane-content-card">
      {/* Header */}
      <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <span><Layers size={18} /> Agency Team Structure</span>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', background: '#1c1c20', padding: '3px 10px', borderRadius: '4px' }}>
          {teamMembers.length} ADDED
        </span>
      </h3>

      {/* Breakdown pills */}
      <div className="team-distribution-matrix" style={{ gridTemplateColumns: `repeat(${Math.min(sorted.length, 3)}, 1fr)`, marginBottom: '20px' }}>
        {sorted.map(([label, count], i) => (
          <div className="team-segment-card" key={label} style={{ borderTop: `2px solid ${SEGMENT_COLORS[i % SEGMENT_COLORS.length]}33` }}>
            <span className="segment-number" style={{ color: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}>{count}</span>
            <span className="segment-title">{label}</span>
          </div>
        ))}
      </div>

      {/* Divider + listing header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', borderTop: '1px solid #1c1c22', paddingTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280' }}>
          <Users size={13} /> All Members
        </div>
        {/* Search */}
        <input
          type="text"
          placeholder="Search name, role, email…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            background: '#0c0c0e', border: '1px solid #23232a', borderRadius: '6px',
            padding: '5px 10px', color: '#fff', fontSize: '0.75rem', outline: 'none',
            width: '180px',
          }}
        />
      </div>

      {/* Member rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.length === 0 ? (
          <p style={{ color: '#4b4b57', fontSize: '0.8rem', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
            No members match your search.
          </p>
        ) : (
          filtered.map((m, i) => <MemberRow key={m.id || i} member={m} index={i} />)
        )}
      </div>
    </div>
  );
};
