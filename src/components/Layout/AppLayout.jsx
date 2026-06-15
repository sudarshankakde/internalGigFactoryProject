/**
 * AppLayout — Unified shell for all authenticated pages
 *
 * Features:
 *  - Collapsible sidebar (full ↔ icon-only)
 *  - Top navbar: page title, notifications, settings, profile with name
 *  - Role-based nav items
 *  - Fully responsive (mobile overlay drawer)
 */

import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, FileText, Users, Building2,
  BarChart3, Bell, Settings, LogOut, ChevronLeft, ChevronRight,
  Menu, X, User, FileCheck, Shield, ChevronDown, FileSearch,
  Handshake, Banknote, Check, ArrowRight,
  Calendar,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import gigfactoryLogo  from '../../assets/logo.png';
import gigfactoryIcon  from '../../assets/logo.png'; // same logo, smaller
import './AppLayout.css';

/* ─── nav config per role ────────────────────────────────────────────── */
const NAV_CONFIG = {
  admin: [
    { label: 'Dashboard',    icon: LayoutDashboard, to: '/admin/dashboard' },
    { label: 'Reg. Requests', icon: FileSearch,      to: '/admin/requests' },
    { label: 'Freelancers',  icon: Users,            to: '/admin/freelancers' },
    { label: 'Agencies',     icon: Building2,        to: '/admin/agencies' },
    { label: 'Projects',     icon: Briefcase,        to: '/admin/projects' },
    { label: 'Analytics',    icon: BarChart3,        to: '/admin/analytics' },
  ],
  freelancer: [
    { label: 'Dashboard',        icon: LayoutDashboard, to: '/dashboard' },
    { label: 'Browse Projects',  icon: Briefcase,       to: '/projects' },
    { label: 'My Applications',  icon: FileCheck,       to: '/applications' },
    { label: 'Active Projects',  icon: FileText,        to: '/activeProject' },
    { label: 'My Profile',       icon: User,            to: '/profile' },
  ],
  agency: [
    { label: 'Dashboard',        icon: LayoutDashboard, to: '/dashboard' },
    { label: 'Browse Projects',  icon: Briefcase,       to: '/projects' },
    { label: 'My Applications',  icon: FileCheck,       to: '/applications' },
    { label: 'Active Projects',  icon: FileText,        to: '/activeProject' },
    { label: 'My Team',          icon: Users,           to: '/team' },
    { label: 'My Profile',       icon: User,            to: '/profile' },
  ],
};

/* ─── Layout Context (so children can toggle sidebar) ────────────────── */
export const LayoutContext = createContext({});
export const useLayout = () => useContext(LayoutContext);

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'New Project Match',
    description: 'A new enterprise client is looking for senior UI designers. Budget: $10k-$15k.',
    time: 'Just now',
    unread: true,
    type: 'project',
  },
  {
    id: 2,
    title: 'Payment Received',
    description: 'Invoice #1041 to GlobalTech has been paid in full. Funds are processing.',
    time: '45m ago',
    unread: true,
    type: 'payment',
  },
  {
    id: 3,
    title: 'Application Approved',
    description: "You have been approved for the 'Pro Tier' freelancer pool.",
    time: 'Yesterday',
    unread: false,
    type: 'approved',
  },
  {
    id: 4,
    title: 'Meeting Reminder',
    description: 'Sync with Design Team at 14:00 EST.',
    time: '2 days ago',
    unread: false,
    type: 'meeting',
  }
];

/* ─── Notification dropdown ──────────────────────────────────────────── */
function NotifDropdown({ onClose }) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="notif-dropdown">
      <div className="notif-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={18} color="#70d64d" />
          <span>Notifications</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="notif-mark-all-btn" onClick={handleMarkAllAsRead}>
            Mark all as read
          </button>
          <button onClick={onClose} className="notif-close">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="notif-list">
        {notifications.map(n => {
          let Icon = Bell;
          let iconClass = 'icon-default';
          if (n.type === 'project') {
            Icon = Handshake;
            iconClass = 'icon-project';
          } else if (n.type === 'payment') {
            Icon = Banknote;
            iconClass = 'icon-payment';
          } else if (n.type === 'approved') {
            Icon = Check;
            iconClass = 'icon-approved';
          } else if (n.type === 'meeting') {
            Icon = Calendar;
            iconClass = 'icon-meeting';
          }

          return (
            <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
              <div className={`notif-icon-circle ${iconClass}`}>
                <Icon size={16} />
              </div>
              <div className="notif-body">
                <div className="notif-title-row">
                  <span className="notif-title-text">{n.title}</span>
                  <span className="notif-time">{n.time}</span>
                </div>
                <p className="notif-desc-text">{n.description}</p>
                {n.type === 'project' && n.unread && (
                  <div className="notif-actions-row">
                    <button className="notif-action-btn primary">Review</button>
                    <button className="notif-action-btn secondary">Dismiss</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="notif-footer">
        <button className="notif-footer-btn">
          <span>View all notifications</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ─── Profile dropdown ───────────────────────────────────────────────── */
function ProfileDropdown({ user, onLogout, onClose }) {
  const navigate = useNavigate();
  const isAdmin  = user?.role === 'admin';
  const userName = user?.fullName || user?.full_name || 'User';
  return (
    <div className="profile-dropdown">
      
      {!isAdmin && (
        <button className="profile-dd-item" onClick={() => { navigate('/profile'); onClose(); }}>
          <User size={14} /> My Profile
        </button>
      )}
      {/* <button className="profile-dd-item" onClick={() => { navigate(isAdmin ? '/admin/settings' : '/settings'); onClose(); }}>
        <Settings size={14} /> Settings
      </button> */}
      <div className="profile-dd-divider" />
      <button className="profile-dd-item danger" onClick={onLogout}>
        <LogOut size={14} /> Logout
      </button>
    </div>
  );
}

/* ─── Main AppLayout ─────────────────────────────────────────────────── */
export default function AppLayout({ children, pageTitle }) {
  const navigate    = useNavigate();
  const location    = useLocation();
  const user        = useAuthStore((state) => state.user) || {};
  const profile     = useAuthStore((state) => state.profile);
  const clearAuth   = useAuthStore((state) => state.clearAuth);
  const userName    = user?.fullName || user?.full_name || 'User';
  const role        = user?.role || 'freelancer';
  const avatarUrl   = role === 'freelancer'
    ? (profile?.user?.profile_photo || user?.profile_photo)
    : role === 'agency'
      ? (profile?.logo || user?.profile_photo)
      : user?.profile_photo;
  const navItems    = NAV_CONFIG[role] || NAV_CONFIG.freelancer;

  const [collapsed,     setCollapsed]     = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [showNotif,     setShowNotif]     = useState(false);
  const [showProfile,   setShowProfile]   = useState(false);

  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  /* close dropdowns on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* close mobile drawer on route change */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    clearAuth();
    navigate(role === 'admin' ? '/admin' : '/');
  };

  /* ── sidebar nav item ── */
  const NavItem = ({ item }) => (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `sidebar-nav-item ${isActive ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`
      }
      title={collapsed ? item.label : undefined}
    >
      <item.icon size={18} className="nav-icon" />
      {!collapsed && <span className="nav-label">{item.label}</span>}
    </NavLink>
  );

  /* ── sidebar content ── */
  const SidebarContent = () => (
    <>
      {/* brand */}
      <div className={`sidebar-brand ${collapsed ? 'brand-collapsed' : ''}`}>
        <img src={gigfactoryLogo} alt="GigFactory" className="sidebar-logo" />
        {!collapsed && (
          <button
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed(true)}
            title="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* role badge */}
      {!collapsed && (
        <div className="sidebar-role-badge">
          <Shield size={12} color="#70d64d" />
          <span>{role === 'admin' ? 'Super Admin' : role.charAt(0).toUpperCase() + role.slice(1)}</span>
        </div>
      )}

      {/* nav */}
      <nav className="sidebar-nav">
        {!collapsed && <p className="nav-section-label">NAVIGATION</p>}
        {navItems.map(item => <NavItem key={item.to} item={item} />)}
      </nav>

      {/* bottom: expand button + logout */}
      <div className="sidebar-bottom">
        {collapsed && (
          <button
            className="sidebar-nav-item collapsed expand-btn"
            onClick={() => setCollapsed(false)}
            title="Expand sidebar"
          >
            <ChevronRight size={18} className="nav-icon" />
          </button>
        )}
      </div>
    </>
  );

  return (
    <LayoutContext.Provider value={{ collapsed, setCollapsed }}>
      <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>

        {/* ── Mobile overlay ── */}
        {mobileOpen && (
          <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
        )}

        {/* ── Sidebar ── */}
        <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
          <SidebarContent />
        </aside>

        {/* ── Right panel (topbar + content) ── */}
        <div className="app-main">

          {/* ── Topbar ── */}
          <header className="app-topbar">
            {/* left: hamburger + page title */}
            <div className="topbar-left">
              <button
                className="topbar-hamburger"
                onClick={() => setMobileOpen(o => !o)}
                aria-label="Toggle menu"
              >
                <Menu size={20} />
              </button>
              <h1 className="topbar-page-title">{pageTitle || 'Dashboard'}</h1>
            </div>

            {/* right: notifications + settings + profile */}
            <div className="topbar-right">

              {/* Notifications */}
              <div className="topbar-icon-wrap" ref={notifRef}>
                <button
                  className="topbar-icon-btn"
                  onClick={() => { setShowNotif(v => !v); setShowProfile(false); }}
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  <span className="notif-dot" aria-hidden />
                </button>
                {showNotif && <NotifDropdown onClose={() => setShowNotif(false)} />}
              </div>

              {/* Settings */}
              <button
                className="topbar-icon-btn"
                onClick={() => navigate(role === 'admin' ? '/admin/settings' : '/settings')}
                aria-label="Settings"
              >
                <Settings size={18} />
              </button>

              {/* Divider */}
              <div className="topbar-divider" />

              {/* Profile */}
              <div className="topbar-icon-wrap" ref={profileRef}>
                <button
                  className="topbar-profile-btn"
                  onClick={() => {
                    setShowProfile(v => !v);
                    setShowNotif(false);
                  }}
                  aria-label="Profile menu"
                >
                  <div className="topbar-profile-info">
                    <span className="topbar-name capitalize">{userName?.split(' ')[0]}</span>
                    <span className="topbar-profile-role">
                      {role === 'admin' ? 'Super Admin' : role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                  </div>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={userName} className="topbar-profile-avatar-circle" style={{ objectFit: 'cover' }} />
                  ) : (
                    <div className="topbar-profile-avatar-circle">
                      {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 1)}
                    </div>
                  )}
                </button>
                {showProfile && (
                  <ProfileDropdown
                    user={user}
                    onLogout={handleLogout}
                    onClose={() => setShowProfile(false)}
                  />
                )}
              </div>

            </div>
          </header>

          {/* ── Page content ── */}
          <main className="app-content">
            {children}
          </main>

        </div>
      </div>
    </LayoutContext.Provider>
  );
}
