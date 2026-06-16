import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ArrowLeft, User, ShieldAlert, Clock, Activity, FileText } from 'lucide-react';
import { api } from '../../utils/api';
import { CompletionBar, ActivityHistoryView } from '../../components/AdminShared';
import { ProfileHeader } from '../../components/Profile/ProfileHeader';
import { ProfileStats } from '../../components/Profile/ProfileStats';
import { ProfileAbout } from '../../components/Profile/ProfileAbout';
import { WorkHistory } from '../../components/Profile/WorkHistory';
import { TeamStructure } from '../../components/Profile/TeamStructure';
import { CapabilityCloud } from '../../components/Profile/CapabilityCloud';
import { ServiceSpecs } from '../../components/Profile/ServiceSpecs';
import { DocumentsList } from '../../components/Profile/DocumentsList';
import '../Profile/Profile.css';

const SERVICE_LABELS = {
  BIM: 'BIM & 2D Drafting',
  Audit: 'As-Built Audit',
  Peer: 'Peer Review',
  BOQ: 'BOQ Creation',
  Viz: '3D Visualisation',
};

const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const AdminUserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');
  const [suspendReason, setSuspendReason] = useState('');
  const [showSuspendInput, setShowSuspendInput] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-user-profile', id],
    queryFn: () => api.get(`/admin/users/${id}/profile-history`),
    enabled: !!id,
  });

  const suspendMutation = useMutation({
    mutationFn: () => api.post(`/admin/users/${id}/suspend`, { reason: suspendReason }),
    onSuccess: (res) => {
      toast.success(res.message || 'Account suspended.');
      queryClient.invalidateQueries({ queryKey: ['admin-user-profile', id] });
      setShowSuspendInput(false);
      setSuspendReason('');
    },
    onError: (err) => {
      toast.error(err.message || 'Suspension failed.');
    }
  });

  const reactivateMutation = useMutation({
    mutationFn: () => api.post(`/admin/users/${id}/unsuspend`),
    onSuccess: (res) => {
      toast.success(res.message || 'Account reactivated.');
      queryClient.invalidateQueries({ queryKey: ['admin-user-profile', id] });
    },
    onError: (err) => {
      toast.error(err.message || 'Reactivation failed.');
    }
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', color: '#8a8a8a', background: '#0c0c0e' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid #70d64d11', borderTopColor: '#70d64d', borderRadius: '50%', margin: '0 auto 16px' }} />
          <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Loading User Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data || !data.user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444', background: '#0c0c0e', minHeight: '80vh' }}>
        <ShieldAlert size={48} style={{ margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 8px' }}>Failed to Load Profile</h3>
        <p style={{ fontSize: '0.9rem', color: '#8a8a8a', marginBottom: '20px' }}>{error?.message || 'User not found or database query failed.'}</p>
        <button 
          onClick={() => navigate(-1)} 
          style={{ background: '#1c1c20', border: '1px solid #23232a', color: '#fff', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const { user } = data;
  const isFreelancer = user.role === 'freelancer';
  const fp = user.freelancer_profile || {};
  const ap = user.agency_profile || {};

  const name = isFreelancer ? user.full_name : ap.agency_name || user.full_name;
  const avatar = isFreelancer ? user.profile_photo : ap.logo;
  const subtitle = isFreelancer ? fp.title : ap.industry || 'Digital Services Agency';
  const emailVal = user.email;
  const phoneVal = user.mobile;
  const locationVal = isFreelancer
    ? (fp.city && fp.country ? `${fp.city}, ${fp.country}` : 'Not Specified')
    : (ap.city && ap.country ? `${ap.city}, ${ap.country}` : 'Not Specified');
  const webVal = isFreelancer ? fp.portfolio_url : ap.website;
  const initials = getInitials(name);

  const skills = isFreelancer 
    ? (fp.freelancer_skills || [])
    : (ap.service_details?.selectedServices || []).map(code => ({ skill_name: SERVICE_LABELS[code] || code }));

  const statusBg = user.account_status === 'approved' 
    ? 'rgba(112,214,77,0.12)' 
    : user.account_status === 'suspended' 
      ? 'rgba(239,68,68,0.12)' 
      : 'rgba(245,158,11,0.12)';
  const statusColor = user.account_status === 'approved' 
    ? '#70d64d' 
    : user.account_status === 'suspended' 
      ? '#ef4444' 
      : '#f59e0b';

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', background: 'transparent' }}>
      
      {/* Top Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #23232a', paddingBottom: '16px' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: '#8a8a8a', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700 }}
        >
          <ArrowLeft size={16} /> Back to Listings
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#6b7280' }}>
            ADMIN VIEW
          </span>
          <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, background: statusBg, color: statusColor }}>
            {user.account_status?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #23232a', marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveTab('profile')} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', 
            borderBottom: activeTab === 'profile' ? '2px solid #70d64d' : '2px solid transparent',
            color: activeTab === 'profile' ? '#70d64d' : '#8a8a8a', padding: '12px 20px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' 
          }}
        >
          <User size={16} /> Profile Information
        </button>
        <button 
          onClick={() => setActiveTab('activity')} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', 
            borderBottom: activeTab === 'activity' ? '2px solid #70d64d' : '2px solid transparent',
            color: activeTab === 'activity' ? '#70d64d' : '#8a8a8a', padding: '12px 20px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' 
          }}
        >
          <Clock size={16} /> Activity History & Logs
        </button>
      </div>

      {/* Profile Details Tab */}
      {activeTab === 'profile' && (
        <div className="profile-workspace-view animate-fade-in" style={{ padding: '0', background: 'transparent' }}>
          <ProfileHeader
            isFreelancer={isFreelancer}
            name={name}
            avatar={avatar}
            subtitle={subtitle}
            emailVal={emailVal}
            phoneVal={phoneVal}
            locationVal={locationVal}
            webVal={webVal}
            foundedYear={isFreelancer ? undefined : ap.founded_year}
            initials={initials}
            availability={isFreelancer ? fp.availability : undefined}
            hideEditButton={true}
          />

          <ProfileStats
            isFreelancer={isFreelancer}
            totalProjects={isFreelancer ? fp.total_projects : ap.total_projects}
            hourlyRate={isFreelancer ? fp.hourly_rate : undefined}
            commercialBasis={isFreelancer ? fp.commercial_basis : ap.commercial_basis}
            employeeCount={isFreelancer ? undefined : ap.employee_count}
          />

          <div className="profile-details-split-grid" style={{ marginTop: '20px' }}>
            <div className="profile-details-left-pane">
              <ProfileAbout
                isFreelancer={isFreelancer}
                bio={isFreelancer ? fp.bio : undefined}
                description={isFreelancer ? undefined : ap.description}
              />

              {isFreelancer ? (
                <WorkHistory workHistory={user.work_history || []} />
              ) : (
                <TeamStructure teamMembers={ap.team_members || []} employeeCount={ap.employee_count} />
              )}

              {/* Account Suspension Panel */}
              <div style={{ background: '#1c0c0e', border: '1px solid #ef444433', borderRadius: '8px', padding: '18px', marginTop: '20px' }}>
                <h4 style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#ef4444', margin: '0 0 14px', paddingBottom: '6px', borderBottom: '1px solid #ef444422' }}>
                  Account Management (Admin Controls)
                </h4>
                {user.account_status === 'suspended' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: 0 }}>This account is currently suspended.</p>
                    <button
                      disabled={reactivateMutation.isPending}
                      onClick={() => reactivateMutation.mutate()}
                      style={{ background: '#70d64d', color: '#000', border: 'none', borderRadius: '6px', padding: '10px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', textAlign: 'center', width: '100%' }}
                    >
                      {reactivateMutation.isPending ? 'Reactivating...' : 'REACTIVATE ACCOUNT'}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {!showSuspendInput ? (
                      <button
                        onClick={() => setShowSuspendInput(true)}
                        style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', padding: '10px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', textAlign: 'center', width: '100%' }}
                      >
                        SUSPEND ACCOUNT
                      </button>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="Reason for suspension..."
                          value={suspendReason}
                          onChange={e => setSuspendReason(e.target.value)}
                          style={{ background: '#000', border: '1px solid #ef4444', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => setShowSuspendInput(false)}
                            style={{ flex: 1, background: '#1c1c20', border: '1px solid #23232a', color: '#8a8a8a', borderRadius: '6px', padding: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={suspendMutation.isPending}
                            onClick={() => {
                              if (!suspendReason.trim()) {
                                toast.error('Please enter a suspension reason.');
                                return;
                              }
                              suspendMutation.mutate();
                            }}
                            style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            {suspendMutation.isPending ? 'Suspending...' : 'Confirm Suspend'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="profile-details-right-pane">
              <CapabilityCloud
                isFreelancer={isFreelancer}
                skills={skills}
              />

              <ServiceSpecs serviceDetails={isFreelancer ? fp.service_details : ap.service_details} />

              <DocumentsList
                isFreelancer={isFreelancer}
                resumeUrl={isFreelancer ? fp.resume_url : undefined}
                verifications={user.verifications}
              />
            </div>
          </div>
        </div>
      )}

      {/* Activity tab */}
      {activeTab === 'activity' && (
        <div className="animate-fade-in">
          <ActivityHistoryView id={user.id} />
        </div>
      )}

    </div>
  );
};

export default AdminUserProfile;
