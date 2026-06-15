import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    const token = useAuthStore.getState().token;
    const user = useAuthStore.getState().user;

    if (token && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <div className="notfound-container">
      <div className="notfound-glass-card">
        {/* Glowing badge */}
        <div className="notfound-badge">
          <ShieldAlert size={36} color="#70d64d" />
        </div>

        {/* Big Code */}
        <h1 className="notfound-code">404</h1>

        {/* Text */}
        <h2 className="notfound-title">Page Not Found</h2>
        <p className="notfound-desc">
          The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>

        {/* Divider */}
        <div className="notfound-divider" />

        {/* Buttons */}
        <div className="notfound-actions">
          <button onClick={() => navigate(-1)} className="notfound-btn secondary">
            <ArrowLeft size={16} /> Go Back
          </button>
          <button onClick={handleGoBack} className="notfound-btn primary">
            <Home size={16} /> Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
