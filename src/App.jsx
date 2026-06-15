import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';

/* ── Public pages ── */
import Login          from './pages/Login/Login.jsx';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword.jsx';
import ResetPassword  from './pages/ForgotPassword/ResetPassword.jsx';
import AdminLogin     from './pages/Admin/AdminLogin.jsx';
import NotFound       from './pages/NotFound/NotFound.jsx';

/* ── Authenticated pages ── */
import { Dashboard }    from './pages/Dashboard/Dashboard.jsx';
import { Profile }      from './pages/Profile/Profile.jsx';
import { ActiveProjects } from './pages/ActiveProject/ActiveProject.jsx';
import { Team }         from './pages/Team/Team.jsx';

/* ── Admin pages ── */
import AdminOverview          from './pages/Admin/AdminOverview.jsx';
import RegistrationRequests   from './pages/Admin/RegistrationRequests.jsx';
import AdminFreelancers        from './pages/Admin/AdminFreelancers.jsx';
import AdminAgencies           from './pages/Admin/AdminAgencies.jsx';

/* ── Layout ── */
import AppLayout from './components/Layout/AppLayout.jsx';

/* ─────────────────────────────────────────────────────────────── */
/* Route guards                                                     */
/* ─────────────────────────────────────────────────────────────── */

const PrivateRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const user  = useAuthStore((state) => state.user);
  if (!token || !user) return <Navigate to="/" replace />;
  return children;
};

const AdminRoute = ({ children, title }) => {
  const token = useAuthStore((state) => state.token);
  const user  = useAuthStore((state) => state.user);
  if (!token || !user) return <Navigate to="/admin" replace />;
  return (
    <AppLayout pageTitle={title}>
      {children}
    </AppLayout>
  );
};

/* ─────────────────────────────────────────────────────────────── */
function App() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);

  useEffect(() => {
    if (token && user) {
      fetchProfile();
    }
  }, [token, user, fetchProfile]);

  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public auth routes ── */}
        <Route path="/"               element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />

        {/* ── Admin login (separate branded page) ── */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* ── Admin protected routes ── */}
        <Route path="/admin/dashboard" element={
          <AdminRoute title="Dashboard">
            <AdminOverview />
          </AdminRoute>
        } />
        <Route path="/admin/requests" element={
          <AdminRoute title="Registration Requests">
            <RegistrationRequests />
          </AdminRoute>
        } />
        <Route path="/admin/freelancers" element={
          <AdminRoute title="Freelancers">
            <AdminFreelancers />
          </AdminRoute>
        } />
        <Route path="/admin/agencies" element={
          <AdminRoute title="Agencies">
            <AdminAgencies />
          </AdminRoute>
        } />

        {/* ── Regular user protected routes ── */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <AppLayout pageTitle="Dashboard">
              <Dashboard />
            </AppLayout>
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <AppLayout pageTitle="My Profile">
              <Profile />
            </AppLayout>
          </PrivateRoute>
        } />
        <Route path="/activeProject" element={
          <PrivateRoute>
            <AppLayout pageTitle="Active Projects">
              <ActiveProjects />
            </AppLayout>
          </PrivateRoute>
        } />
        <Route path="/team" element={
          <PrivateRoute>
            <AppLayout pageTitle="My Team">
              <Team />
            </AppLayout>
          </PrivateRoute>
        } />

        {/* ── Catch-all ── */}
        <Route path="*" element={<NotFound />} />

      </Routes>
      <ToastContainer position="top-right" theme="dark" />
    </BrowserRouter>
  );
}

export default App;
