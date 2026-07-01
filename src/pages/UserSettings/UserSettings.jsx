import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { User, Lock, Bell, Save, Eye, EyeOff, Loader } from 'lucide-react';
import { api } from '../../utils/api';
import './UserSettings.css';

const TABS = [
  { id: 'account', label: 'My Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

function Toggle({ checked, onChange, id }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      className={`settings-toggle ${checked ? 'on' : 'off'}`}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-thumb" />
    </button>
  );
}

function Section({ title, description, children }) {
  return (
    <div className="settings-section">
      {(title || description) && (
        <div className="settings-section-header">
          {title && <h3 className="settings-section-title">{title}</h3>}
          {description && <p className="settings-section-desc">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

function FormRow({ label, hint, children, id }) {
  return (
    <div className="settings-form-row">
      <div className="settings-label-col">
        <label htmlFor={id} className="settings-label">{label}</label>
        {hint && <span className="settings-hint">{hint}</span>}
      </div>
      <div className="settings-input-col">{children}</div>
    </div>
  );
}

function NotifRow({ label, desc, inApp, email, onInApp, onEmail, id }) {
  return (
    <div className="notif-matrix-row">
      <div className="notif-matrix-info">
        <span className="notif-matrix-label">{label}</span>
        {desc && <span className="notif-matrix-desc">{desc}</span>}
      </div>
      <div className="notif-matrix-toggles">
        <div className="notif-matrix-toggle-cell">
          <Toggle id={`${id}-inapp`} checked={inApp} onChange={onInApp} />
        </div>
        <div className="notif-matrix-toggle-cell">
          <Toggle id={`${id}-email`} checked={email} onChange={onEmail} />
        </div>
      </div>
    </div>
  );
}

export default function UserSettings() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('account');

  // Fetch settings
  const { data: settingsData, isLoading: settingsLoading } = useQuery({
    queryKey: ['user-settings'],
    queryFn: () => api.get('/settings'),
  });

  const settings = settingsData?.settings || {};

  // Form states
  const [account, setAccount] = useState({ full_name: '', email: '', mobile: '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  const [notif, setNotif] = useState({
    notif_payment_inapp: true,
    notif_payment_email: true,
    notif_project_inapp: true,
    notif_project_email: true,
  });

  // Sync data to local state
  useEffect(() => {
    if (settings.profile) {
      setAccount({
        full_name: settings.profile.full_name || '',
        email: settings.profile.email || '',
        mobile: settings.profile.mobile || '',
      });
    }
    if (settings.notifications) {
      setNotif(settings.notifications);
    }
  }, [settings]);

  // Mutation
  const saveMutation = useMutation({
    mutationFn: ({ section, data }) => api.put('/settings', { section, data }),
    onSuccess: () => {
      toast.success('Settings saved successfully.');
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
    },
    onError: (err) => toast.error(err?.message || 'Failed to save settings.'),
  });

  const passwordMutation = useMutation({
    mutationFn: (data) => api.put('/settings/password', data),
    onSuccess: () => {
      toast.success('Password changed successfully.');
      setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (err) => toast.error(err?.message || 'Failed to change password.'),
  });

  const handleSaveAccount = () => saveMutation.mutate({ section: 'profile', data: account });
  const handleSaveNotif = () => saveMutation.mutate({ section: 'notifications', data: notif });

  const handleChangePassword = () => {
    if (password.newPassword !== password.confirmPassword) {
      return toast.error('New passwords do not match.');
    }
    passwordMutation.mutate({
      currentPassword: password.currentPassword,
      newPassword: password.newPassword,
    });
  };

  const isSaving = saveMutation.isPending || passwordMutation.isPending;

  const SaveBtn = ({ onClick, label = 'Save Changes', loading }) => (
    <button
      type="button"
      className="settings-save-btn"
      onClick={onClick}
      disabled={loading || isSaving}
    >
      {(loading || isSaving) ? <Loader size={14} className="spin" /> : <Save size={14} />}
      {label}
    </button>
  );

  if (settingsLoading) {
    return (
      <div className="settings-loading">
        <Loader size={28} className="spin" />
        <span>Loading settings…</span>
      </div>
    );
  }

  return (
    <div className="settings-user">
      {/* Sidebar tabs */}
      <aside className="settings-sidebar">
        <div className="settings-sidebar-header">
          <h2>Settings</h2>
        </div>
        <nav className="settings-tab-nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Content area */}
      <div className="settings-content">
        {/* MY ACCOUNT */}
        {activeTab === 'account' && (
          <div className="settings-pane">
            <div className="settings-pane-header">
              <h2>My Account</h2>
              <p>Update your personal details and change your password.</p>
            </div>

            <Section title="Profile Details" description="This is how your name appears across the platform.">
              <FormRow label="Full Name" id="acc-name">
                <input id="acc-name" className="settings-input" value={account.full_name}
                  onChange={e => setAccount(s => ({ ...s, full_name: e.target.value }))} />
              </FormRow>
              <FormRow label="Email Address" id="acc-email" hint="Used for login and communications">
                <input id="acc-email" type="email" className="settings-input" value={account.email}
                  onChange={e => setAccount(s => ({ ...s, email: e.target.value }))} />
              </FormRow>
              <FormRow label="Mobile" id="acc-mobile">
                <input
                  id="acc-mobile"
                  className="settings-input"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={account.mobile}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setAccount((s) => ({
                      ...s,
                      mobile: value,
                    }));
                  }}
                />
              </FormRow>
              <div className="settings-row-actions">
                <SaveBtn onClick={handleSaveAccount} loading={saveMutation.isPending} />
              </div>
            </Section>

            <Section title="Change Password" description="Use a strong password with at least 8 characters.">
              {[
                { key: 'currentPassword', label: 'Current Password', id: 'pwd-current', show: 'current' },
                { key: 'newPassword', label: 'New Password', id: 'pwd-new', show: 'new' },
                { key: 'confirmPassword', label: 'Confirm Password', id: 'pwd-confirm', show: 'confirm' },
              ].map(({ key, label, id, show }) => (
                <FormRow key={key} label={label} id={id}>
                  <div className="settings-input-icon-wrap">
                    <input
                      id={id}
                      type={showPwd[show] ? 'text' : 'password'}
                      className="settings-input"
                      value={password[key]}
                      onChange={e => setPassword(s => ({ ...s, [key]: e.target.value }))}
                      autoComplete="new-password"
                    />
                    <button type="button" className="pwd-toggle" onClick={() => setShowPwd(s => ({ ...s, [show]: !s[show] }))}>
                      {showPwd[show] ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </FormRow>
              ))}
              <div className="settings-row-actions">
                <SaveBtn onClick={handleChangePassword} label="Change Password" loading={passwordMutation.isPending} />
              </div>
            </Section>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="settings-pane">
            <div className="settings-pane-header">
              <h2>Notification Preferences</h2>
              <p>Control which events trigger in-app and email alerts.</p>
            </div>
            <Section>
              {/* Matrix header */}
              <div className="notif-matrix-header">
                <span className="notif-matrix-event-col">Event</span>
                <div className="notif-matrix-toggles">
                  <span>In-App</span>
                  <span>Email</span>
                </div>
              </div>

              <NotifRow
                id="notif-pay"
                label="Payment / Transaction Events"
                desc="When a payment is processed or invoice is generated"
                inApp={notif.notif_payment_inapp}
                email={notif.notif_payment_email}
                onInApp={v => setNotif(s => ({ ...s, notif_payment_inapp: v }))}
                onEmail={v => setNotif(s => ({ ...s, notif_payment_email: v }))}
              />
              <NotifRow
                id="notif-proj"
                label="Project Assignments & Milestones"
                desc="When you are assigned to a new project or milestone status changes"
                inApp={notif.notif_project_inapp}
                email={notif.notif_project_email}
                onInApp={v => setNotif(s => ({ ...s, notif_project_inapp: v }))}
                onEmail={v => setNotif(s => ({ ...s, notif_project_email: v }))}
              />

              <div className="settings-row-actions">
                <SaveBtn onClick={handleSaveNotif} />
              </div>
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}
