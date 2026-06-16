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
      <div className="flex justify-center items-center min-h-[80vh] text-[#8a8a8a] bg-[#0c0c0e]">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-3 border-[#70d64d]/10 border-t-[#70d64d] rounded-full mx-auto mb-4" />
          <p className="text-[0.9rem] font-semibold">Loading User Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data || !data.user) {
    return (
      <div className="p-10 text-center text-[#ef4444] bg-[#0c0c0e] min-h-[80vh]">
        <ShieldAlert size={48} className="mx-auto mb-4" />
        <h3 className="text-[1.25rem] font-extrabold mb-2 m-0">Failed to Load Profile</h3>
        <p className="text-[0.9rem] text-[#8a8a8a] mb-5">{error?.message || 'User not found or database query failed.'}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="bg-[#1c1c20] border border-[#23232a] text-white px-5 py-2.5 rounded-md cursor-pointer font-bold"
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
    <div className="max-w-[1200px] mx-auto px-4 py-6 bg-transparent">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6 border-b border-[#23232a] pb-4">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 bg-transparent border-none text-[#8a8a8a] cursor-pointer text-[0.9rem] font-bold"
        >
          <ArrowLeft size={16} /> Back to Listings
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[0.75rem] font-extrabold uppercase text-[#6b7280]">
            ADMIN VIEW
          </span>
          <span 
            className="inline-flex px-2.5 py-1 rounded text-[0.7rem] font-extrabold"
            style={{ background: statusBg, color: statusColor }}
          >
            {user.account_status?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#23232a] mb-6">
        <button 
          onClick={() => setActiveTab('profile')} 
          className={`flex items-center gap-2 bg-transparent border-none border-b-2 py-3 px-5 text-[0.9rem] font-bold cursor-pointer transition-all ${activeTab === 'profile' ? 'border-[#70d64d] text-[#70d64d]' : 'border-transparent text-[#8a8a8a]'}`}
        >
          <User size={16} /> Profile Information
        </button>
        <button 
          onClick={() => setActiveTab('activity')} 
          className={`flex items-center gap-2 bg-transparent border-none border-b-2 py-3 px-5 text-[0.9rem] font-bold cursor-pointer transition-all ${activeTab === 'activity' ? 'border-[#70d64d] text-[#70d64d]' : 'border-transparent text-[#8a8a8a]'}`}
        >
          <Clock size={16} /> Activity History & Logs
        </button>
      </div>

      {/* Profile Details Tab */}
      {activeTab === 'profile' && (
        <div className="profile-workspace-view animate-fade-in p-0 bg-transparent">
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
            initials={getInitials(name)}
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

          <div className="profile-details-split-grid mt-5">
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
              <div className="bg-[#1c0c0e] border border-[#ef4444]/20 rounded-lg p-[18px] mt-5">
                <h4 className="text-[0.72rem] font-extrabold uppercase tracking-[0.6px] text-[#ef4444] mb-3.5 pb-1.5 border-b border-[#ef4444]/10 m-0">
                  Account Management (Admin Controls)
                </h4>
                {user.account_status === 'suspended' ? (
                  <div className="flex flex-col gap-2.5">
                    <p className="text-[#ef4444] text-[0.8rem] m-0">This account is currently suspended.</p>
                    <button
                      disabled={reactivateMutation.isPending}
                      onClick={() => reactivateMutation.mutate()}
                      className="bg-[#70d64d] text-black border-none rounded-md p-2.5 text-[0.8rem] font-extrabold cursor-pointer text-center w-full"
                    >
                      {reactivateMutation.isPending ? 'Reactivating...' : 'REACTIVATE ACCOUNT'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {!showSuspendInput ? (
                      <button
                        onClick={() => setShowSuspendInput(true)}
                        className="bg-transparent border border-[#ef4444] text-[#ef4444] rounded-md p-2.5 text-[0.8rem] font-extrabold cursor-pointer text-center w-full"
                      >
                        SUSPEND ACCOUNT
                      </button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          placeholder="Reason for suspension..."
                          value={suspendReason}
                          onChange={e => setSuspendReason(e.target.value)}
                          className="bg-black border border-[#ef4444] rounded-md py-2 px-3 text-white text-[0.8rem] outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setShowSuspendInput(false)}
                            className="flex-1 bg-[#1c1c20] border border-[#23232a] text-[#8a8a8a] rounded-md p-2 text-[0.75rem] font-bold cursor-pointer"
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
                            className="flex-1 bg-[#ef4444] text-white border-none rounded-md p-2 text-[0.75rem] font-bold cursor-pointer"
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
