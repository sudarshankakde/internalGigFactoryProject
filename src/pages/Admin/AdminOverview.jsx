import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Building2, FileSearch, CheckCircle2,
  TrendingUp, ArrowRight, Clock, UserCheck, Bell, X
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
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
  const [isSenderOpen, setIsSenderOpen] = useState(false);

  const { data: statsData } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/profiles/admin/stats'),
    refetchInterval: 60_000,
  });

  const { data: reqData } = useQuery({
    queryKey: ['admin-registration-requests-overview'],
    queryFn: () => api.get('/auth/registration-requests').then(r => r.requests || []),
  });

  const { data: freelancersData } = useQuery({
    queryKey: ['admin-freelancers-list'],
    queryFn: () => api.get('/profiles/admin/freelancers?limit=100').then(r => r.freelancers || []),
  });

  const { data: agenciesData } = useQuery({
    queryKey: ['admin-agencies-list'],
    queryFn: () => api.get('/profiles/admin/agencies?limit=100').then(r => r.agencies || []),
  });

  const usersList = useMemo(() => {
    const list = [];
    if (freelancersData) {
      freelancersData.forEach(f => {
        list.push({ id: f.id, name: `${f.full_name} (Freelancer)`, email: f.email });
      });
    }
    if (agenciesData) {
      agenciesData.forEach(a => {
        list.push({ id: a.id, name: `${a.agency_profile?.agency_name || a.full_name} (Agency)`, email: a.email });
      });
    }
    return list;
  }, [freelancersData, agenciesData]);

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
          
          <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, margin: '12px 0 4px' }}>Communications</h2>
          <div
            onClick={() => setIsSenderOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #121215, #16220a)',
              border: '1px solid #23232a',
              borderRadius: '10px',
              padding: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#70d64d'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#23232a'; }}
          >
            <div style={{
              width: '44px', height: '44px', borderRadius: '10px',
              background: 'rgba(112, 214, 77, 0.08)',
              border: '1px solid rgba(112, 214, 77, 0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Bell size={20} color="#70d64d" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>Notification Hub</p>
              <p style={{ color: '#6b7280', fontSize: '0.75rem', margin: '3px 0 0' }}>Send manual alerts & emails</p>
            </div>
            <ArrowRight size={16} color="#6b7280" />
          </div>
        </div>
      </div>

      {isSenderOpen && (
        <SendManualNotificationModal 
          onClose={() => setIsSenderOpen(false)} 
          usersList={usersList} 
        />
      )}
    </div>
  );
}

/* ─── Send Manual Notification Modal ─────────────────────────────────────── */
function SendManualNotificationModal({ onClose, usersList }) {
  const [targetUserId, setTargetUserId] = useState('ALL');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('manual');
  const [sendEmail, setSendEmail] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailHtml, setEmailHtml] = useState('');

  const sendMutation = useMutation({
    mutationFn: (body) => api.post('/notifications/manual', body),
    onSuccess: () => {
      toast.success('Notification & email sent successfully!');
      onClose();
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to send notification.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error('Title and message are required.');
      return;
    }
    sendMutation.mutate({
      userId: targetUserId,
      title,
      message,
      type,
      sendEmail,
      emailSubject: emailSubject.trim() || undefined,
      emailHtml: emailHtml.trim() || undefined,
    });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }} onClick={onClose}>
      <div style={{
        background: '#121215', border: '1px solid #23232a', borderRadius: '16px',
        width: '580px', maxWidth: '95vw', padding: '30px', color: '#fff',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)', display: 'flex',
        flexDirection: 'column', gap: '20px'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #23232a', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={20} color="#70d64d" />
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Manual Notification Hub</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Recipient */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ color: '#6b7280', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recipient</label>
            <select 
              value={targetUserId} 
              onChange={e => setTargetUserId(e.target.value)}
              style={{ background: '#1c1c20', border: '1px solid #2c2c35', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '0.85rem' }}
            >
              <option value="ALL">All Users (Broadcast)</option>
              {usersList.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          {/* Row for Title & Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#6b7280', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Title</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Schedule Update"
                style={{ background: '#1c1c20', border: '1px solid #2c2c35', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#6b7280', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value)}
                style={{ background: '#1c1c20', border: '1px solid #2c2c35', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '0.85rem' }}
              >
                <option value="manual">Manual</option>
                <option value="project">Project</option>
                <option value="payment">Payment</option>
                <option value="meeting">Meeting</option>
                <option value="approved">Approved</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ color: '#6b7280', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Message Body</label>
            <textarea 
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Enter the notification content..."
              style={{ background: '#1c1c20', border: '1px solid #2c2c35', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '0.85rem', resize: 'vertical' }}
            />
          </div>

          {/* Send Email Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
            <input 
              type="checkbox" 
              id="sendEmailCheckbox"
              checked={sendEmail} 
              onChange={e => setSendEmail(e.target.checked)}
              style={{ accentColor: '#70d64d', width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <label htmlFor="sendEmailCheckbox" style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Also Send Email notification
            </label>
          </div>

          {/* Expandable Email Fields */}
          {sendEmail && (
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed #2c2c35', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ color: '#6b7280', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Custom Email Subject (Optional)</label>
                <input 
                  type="text" 
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  placeholder="Defaults to notification title"
                  style={{ background: '#1c1c20', border: '1px solid #2c2c35', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ color: '#6b7280', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Custom Email HTML body (Optional)</label>
                <textarea 
                  rows={2}
                  value={emailHtml}
                  onChange={e => setEmailHtml(e.target.value)}
                  placeholder="HTML tags allowed. Defaults to styled message."
                  style={{ background: '#1c1c20', border: '1px solid #2c2c35', borderRadius: '8px', padding: '8px 10px', color: '#fff', fontSize: '0.8rem', resize: 'vertical' }}
                />
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #23232a', paddingTop: '16px', marginTop: '10px' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{ background: 'transparent', border: '1px solid #2c2c35', color: '#a1a1aa', borderRadius: '8px', padding: '10px 16px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={sendMutation.isPending}
              style={{ background: '#70d64d', color: '#000', border: 'none', borderRadius: '8px', padding: '10px 22px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', opacity: sendMutation.isPending ? 0.6 : 1 }}
            >
              {sendMutation.isPending ? 'Sending...' : 'Send Notification'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
