import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import gigfactoryLogo from "../../assets/logo.png";
import "./PublicLayout.css";

export default function PublicLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="public-layout-container">
      {/* Premium Header */}
      <header className="public-header">
        <div className="public-header-inner">
          <Link to="/public-projects" className="public-logo-container">
            <img src={gigfactoryLogo} alt="GigFactory Logo" className="public-logo-img" />
          </Link>
          
          <div className="public-header-actions">
            <Link to="/public-projects" className="public-nav-link">
              Browse Projects
            </Link>
            <button
              onClick={() => navigate("/")}
              className="public-login-btn"
            >
              <LogIn size={15} />
              <span>Login / Register</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="public-main-content">
        <div className="public-content-inner">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="public-footer">
        <div className="public-footer-inner">
          <p>© {new Date().getFullYear()} GigFactory. All rights reserved.</p>
          <div className="public-footer-links">
            <a href="#" className="public-footer-link">Privacy Policy</a>
            <span className="footer-separator">·</span>
            <a href="#" className="public-footer-link">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
