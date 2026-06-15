import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Building2, FileSearch, CheckCircle2,
  TrendingUp, ArrowRight, Clock, UserCheck,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

function StatCard({ label, value, Icon, accent, sub, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: accent
          ? 'linear-gradient(135deg,#121215,#16220a)'
          : '#121215',
        border: `1px solid ${accent ? '#374f05' : '#23232a'}`,
        borderRadius: '12px',
        padding: '24px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.15s, box-shadow 0.15s',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#6b7280', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', margin: 0 }}>
            {label}
          </p>
          <p style={{ color: '#fff', fontSize: '2.4rem', fontWeight: 800, margin: '6px 0 0', lineHeight: 1 }}>
            {value ?? <span className="skeleton-pulse" style={{ display: 'inline-block', width: '50px', height: '36px', borderRadius: '6px' }} />}
          </p>
        </div>
        <div style={{
          width: '44px', height: '44px', borderRadius: '10px',
          background: accent ? 'rgba(112,214,77,0.12)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${accent ? 'rgba(112,214,77,0.25)' : '#23232a'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} color={accent ? '#70d64d' : '#6b7280'} />
        </div>
      </div>
      {sub && <p style={{ color: '#6b7280', fontSize: '0.75rem', margin: 0 }}>{sub}</p>}
      {onClick && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#70d64d', fontSize: '0.75rem', fontWeight: 600 }}>
          View all <ArrowRight size={12} />
        </div>
      )}
    </div>
  );
}

function QuickLink({ icon: Icon, label, desc, to, color }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(to)}
      style={{
        background: '#121215',
        border: '1px solid #23232a',
        borderRadius: '10px',
        padding: '20px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        transition: 'border-color 0.15s, background 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#23232a'; }}
    >
      <div style={{
        width: '44px', height: '44px', borderRadius: '10px',
        background: `${color}18`,
        border: `1px solid ${color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={20} color={color} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>{label}</p>
        <p style={{ color: '#6b7280', fontSize: '0.75rem', margin: '3px 0 0' }}>{desc}</p>
      </div>
      <ArrowRight size={16} color="#6b7280" />
    </div>
  );
}

export default function AdminOverview() {
  const navigate = useNavigate();

  const { data: statsData } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/profiles/admin/stats'),
    refetchInterval: 60_000,
  });

  const { data: reqData } = useQuery({
    queryKey: ['admin-registration-requests-overview'],
    queryFn: () => api.get('/auth/registration-requests').then(r => r.requests || []),
  });

  const stats = statsData?.stats || {};
  const recentRequests = (reqData || []).slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <StatCard
          label="Active Freelancers"
          value={stats.totalFreelancers}
          Icon={Users}
          sub="Approved accounts"
          onClick={() => navigate('/admin/freelancers')}
        />
        <StatCard
          label="Active Agencies"
          value={stats.totalAgencies}
          Icon={Building2}
          sub="Approved accounts"
          onClick={() => navigate('/admin/agencies')}
        />
        <StatCard
          label="Pending Review"
          value={stats.pendingRequests}
          Icon={Clock}
          accent
          sub="Awaiting decision"
          onClick={() => navigate('/admin/requests')}
        />
        <StatCard
          label="Approved This Month"
          value={stats.approvedThisMonth}
          Icon={UserCheck}
          sub="Registration approvals"
        />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>

        {/* Recent registration requests */}
        <div style={{ background: '#121215', border: '1px solid #23232a', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, margin: 0 }}>
              Recent Registration Requests
            </h2>
            <button
              onClick={() => navigate('/admin/requests')}
              style={{ background: 'transparent', border: '1px solid #23232a', color: '#70d64d', borderRadius: '6px', padding: '6px 12px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              View All <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentRequests.length === 0 ? (
              [...Array(4)].map((_, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #1a1a22' }}>
                  <div className="skeleton-pulse" style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton-pulse" style={{ width: '40%', height: '14px', borderRadius: '4px', marginBottom: '6px' }} />
                    <div className="skeleton-pulse" style={{ width: '60%', height: '12px', borderRadius: '4px' }} />
                  </div>
                </div>
              ))
            ) : recentRequests.map(req => {
              const statusColor = req.status === 'approved' ? '#70d64d' : req.status === 'rejected' ? '#ef4444' : '#f59e0b';
              const roleColor = req.role === 'agency' ? '#c084fc' : '#38bdf8';
              return (
                <div
                  key={req.id}
                  onClick={() => navigate(`/admin/requests?id=${req.id}`)}
                  onMouseEnter={e => e.currentTarget.style.background = '#181820'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 8px',
                    borderBottom: '1px solid #1a1a22',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: `${roleColor}18`, border: `1px solid ${roleColor}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, color: roleColor, fontSize: '0.75rem', flexShrink: 0,
                  }}>
                    {req.full_name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {req.full_name}
                      </span>
                      <span style={{ background: `${roleColor}18`, color: roleColor, fontSize: '0.62rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', flexShrink: 0 }}>
                        {req.role?.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.75rem', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {req.email}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                    <span style={{ background: `${statusColor}18`, color: statusColor, fontSize: '0.62rem', fontWeight: 700, padding: '2px 7px', borderRadius: '4px' }}>
                      {req.status?.toUpperCase()}
                    </span>
                    <span style={{ color: '#4b4b57', fontSize: '0.68rem' }}>{fmtDate(req.created_at)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, margin: '0 0 4px' }}>Quick Access</h2>
          <QuickLink icon={FileSearch}  label="Reg. Requests" desc="Review & approve applications" to="/admin/requests"    color="#f59e0b" />
          <QuickLink icon={Users}       label="Freelancers"    desc="Manage freelancer accounts"    to="/admin/freelancers" color="#38bdf8" />
          <QuickLink icon={Building2}   label="Agencies"       desc="Manage agency accounts"        to="/admin/agencies"    color="#c084fc" />
          <QuickLink icon={TrendingUp}  label="Analytics"      desc="Platform performance metrics"  to="/admin/analytics"   color="#70d64d" />
        </div>
      </div>
    </div>
  );
}
