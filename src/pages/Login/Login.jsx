
import React, { useState, useEffect } from 'react';
import { Mail, Lock, KeyRound, ArrowRight } from 'lucide-react';
import './Login.css';
import gigfactoryLogo from '../../assets/logo.png'; 
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const [authMethod, setAuthMethod] = useState('password'); // 'password' or 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  //OTP Flow States
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);


  const navigate = useNavigate()
  // Handle countdown for OTP timeout
  useEffect(() => {

    let interval = null;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isOtpSent) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, isOtpSent]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email) {
      toast.warning("Please enter your email address first!");
      return;
    }
    // Simulate sending OTP via API
    toast.success("Send OTP in your email.");
    console.log('Sending OTP to:', email);
    setIsOtpSent(true);
    setTimer(30); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authMethod === 'password') {
        toast.success('Login Successfilly!');
        setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
        
      console.log('Logging in with password:', { email, password });
    } else {
      console.log('Verifying OTP login:', { email, otp });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        {/* Branding Logo */}
        <div className="login-branding-logo-box">
          <img src={gigfactoryLogo} alt="Gigfactory Logo" className="login-brand-img" />
        </div>

        {/* Header */}
        <h1 className="login-title">LOGIN TO PORTAL</h1> 
        <p className="login-subtitle">GET BEST GIG OUT THERE</p> 

        <hr className="divider-line" />

        {/* Tabs for Password / OTP */}
        <div className="tab-container">
          <button 
            type="button"
            className={`tab-btn ${authMethod === 'password' ? 'active' : ''}`}
            onClick={() => setAuthMethod('password')}
          >
            Password 
          </button>
          <button 
            type="button"
            className={`tab-btn ${authMethod === 'otp' ? 'active' : ''}`}
            onClick={() => setAuthMethod('otp')}
          >
            OTP 
          </button>
        </div>

        {/* Form Element */}
        <form onSubmit={handleSubmit} className="login-form">
          
          {/* Email Address Input */}
          <div className="input-group">
            <label htmlFor="email">Email Address</label> 
            <div className="input-wrapper">
              <span className="input-icon">
                <Mail size={18} strokeWidth={2} />
              </span>
              <input 
                type="email" 
                id="email" 
                value={email}
                placeholder="Enter Email"
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          {/* Conditional Field Layout: Password vs Dynamic OTP */}
          {authMethod === 'password' ? (
            <div className="input-group">
              <div className="label-row">
                <label htmlFor="password">Password</label> 
                <a href="#forgot" className="forgot-link">Forgot Password?</a> 
              </div>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Lock size={18} strokeWidth={2} />
                </span>
                <input  type="password"  id="password"  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>
          ) : (
            <div className="input-group animate-fade-in">
              <div className="label-row">
                <label htmlFor="otp">One Time Password (OTP)</label>
                {isOtpSent && timer > 0 && (
                  <span className="otp-timer">Resend in {timer}s</span>
                )}
                {isOtpSent && timer === 0 && (
                  <button type="button" onClick={handleSendOtp} className="resend-otp-link-btn">
                    Resend OTP
                  </button>
                )}
              </div>
              <div className="input-wrapper">
                <span className="input-icon">
                  <KeyRound size={18} strokeWidth={2} />
                </span>
                <input 
                  type="text" 
                  id="otp" 
                  placeholder={isOtpSent ? "Enter 6-Digit OTP" : "Click 'Send OTP' to unlock"} 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={!isOtpSent || timer === 0} 
                  required={isOtpSent}
                />
              </div>
            </div>
          )}

          {/* Dynamic Button Action Controller */}
          {authMethod === 'otp' && !isOtpSent ? (
            <button type="button" onClick={handleSendOtp} className="login-submit-btn">
              Send OTP <ArrowRight className="arrow" size={18} strokeWidth={2.5} />
            </button>
          ) : (
            <button type="submit" className="login-submit-btn">
              Login <ArrowRight className="arrow" size={18} strokeWidth={2.5} /> 
            </button>
          )}

        </form>

        {/* Footer */}
        <p className="register-text">
          New Here? <a href="#register" className="register-link">Register Now</a> 
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;