import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../../utils/api';
import { useAuthStore } from '../../store/useAuthStore';
import gigfactoryLogo from '../../assets/logo.png';

const AdminLogin = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const navigate                = useNavigate();
  const setAuth                 = useAuthStore((state) => state.setAuth);
  const token                   = useAuthStore((state) => state.token);
  const user                    = useAuthStore((state) => state.user);

  useEffect(() => {
    if (token && user && user.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [token, user, navigate]);

  const [loginParams, setLoginParams] = useState(null);
  const loginQuery = useQuery({
    queryKey: ['admin-login', loginParams],
    queryFn: () => api.post('/auth/login', { email: loginParams.email, password: loginParams.password }),
    enabled: !!loginParams,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (loginQuery.data) {
      const data = loginQuery.data;
      if (data.user?.role !== 'admin') {
        toast.error('Access denied. Admin credentials required.');
        setLoginParams(null);
        return;
      }
      setAuth(data.token, data.refreshToken, data.user);
      toast.success('Welcome, Admin!');
      navigate('/admin/dashboard');
      setLoginParams(null);
    }
  }, [loginQuery.data, navigate, setAuth]);

  useEffect(() => {
    if (loginQuery.error) {
      toast.error(loginQuery.error.message || 'Login failed. Check your credentials.');
      setLoginParams(null);
    }
  }, [loginQuery.error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning('Please enter email and password.');
      return;
    }
    setLoginParams({ email, password });
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* top accent */}
        <div style={styles.accentBar} />

        <div style={styles.body}>
          {/* logo */}
          <img src={gigfactoryLogo} alt="GigFactory" style={styles.logo} />

          {/* heading */}
          <div style={styles.iconBadge}>
            <ShieldCheck size={20} color="#70d64d" />
          </div>
          <h1 style={styles.title}>ADMIN PORTAL</h1>
          <p style={styles.subtitle}>SUPERADMIN ACCESS ONLY</p>

          <hr style={styles.divider} />

          {/* form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="admin-email">Email Address</label>
              <div style={styles.inputWrap}>
                <Mail size={16} style={styles.inputIcon} />
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@gigfactory.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="admin-password">Password</label>
              <div style={styles.inputWrap}>
                <Lock size={16} style={styles.inputIcon} />
                <input
                  id="admin-password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                ...styles.submitBtn,
                opacity: loginQuery.isFetching ? 0.7 : 1,
                cursor: loginQuery.isFetching ? 'not-allowed' : 'pointer',
              }}
              disabled={loginQuery.isFetching}
            >
              {loginQuery.isFetching ? 'Authenticating…' : 'Login to Admin Panel'}
              {!loginQuery.isFetching && <ArrowRight size={16} />}
            </button>
          </form>

          <p style={styles.footer}>
            <a href="/" style={styles.footerLink}>← Back to main site</a>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0c0c0e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    background: '#181818',
    border: '1px solid #2c2c2c',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
  },
  accentBar: {
    height: '3px',
    background: '#70d64d',
  },
  body: {
    padding: '36px 28px',
    textAlign: 'center',
  },
  logo: {
    width: '160px',
    maxWidth: '100%',
    objectFit: 'contain',
    marginBottom: '20px',
  },
  iconBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    background: 'rgba(112,214,77,0.1)',
    border: '1px solid rgba(112,214,77,0.25)',
    borderRadius: '50%',
    marginBottom: '12px',
  },
  title: {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 800,
    letterSpacing: '0.5px',
    margin: 0,
  },
  subtitle: {
    color: '#8a8a8a',
    fontSize: '0.72rem',
    letterSpacing: '2px',
    fontWeight: 600,
    marginTop: '4px',
    marginBottom: 0,
  },
  divider: {
    border: 'none',
    height: '2px',
    background: '#70d64d',
    margin: '24px 0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    textAlign: 'left',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    color: '#8a8a8a',
    fontSize: '0.78rem',
    fontWeight: 500,
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: '#52525b',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    background: '#1f1f1f',
    border: '1px solid #2c2c2c',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '0.88rem',
    padding: '11px 12px 11px 42px',
    outline: 'none',
  },
  submitBtn: {
    width: '100%',
    background: '#70d64d',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    padding: '12px',
    fontSize: '0.95rem',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '4px',
    transition: 'opacity 0.15s',
  },
  footer: {
    marginTop: '24px',
    fontSize: '0.82rem',
  },
  footerLink: {
    color: '#8a8a8a',
    textDecoration: 'none',
  },
};

export default AdminLogin;
