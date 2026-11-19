import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, Info, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from?.pathname || '/';
  const infoMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login(email, password);
    if (res.success) {
      navigate(destination, { replace: true });
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card-modern">
        {/* Brand Logo & Clean Header */}
        <div className="login-brand-header">
          <Link to="/" className="login-logo-link" title="Return to Home">
            <img 
              src="/JomnenhKH.jpg" 
              alt="Jomnenh-KH Logo" 
              className="login-brand-logo" 
            />
            <span className="login-logo-text">Jomnenh<span className="logo-accent">-KH</span></span>
          </Link>
          <h1 className="login-title">Sign In</h1>
          <p className="login-subtitle">Enter your email and password to access your account</p>
        </div>

        {/* Redirect Notice Banner (e.g. from Add to Cart) */}
        {infoMessage && !error && (
          <div style={{
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            borderRadius: '12px',
            padding: '12px 14px',
            marginBottom: '18px',
            color: '#a5b4fc',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            lineHeight: 1.45
          }}>
            <Info size={17} style={{ flexShrink: 0, color: '#818cf8' }} />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="alert-error" style={{
            borderRadius: '12px',
            padding: '12px 14px',
            marginBottom: '18px',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="login-email" className="login-label">Email Address</label>
            <div className="login-input-wrap">
              <Mail size={17} className="login-input-icon" />
              <input
                id="login-email"
                name="email"
                type="email"
                required
                spellCheck="false"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                autoComplete="email"
                className="login-input"
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="login-password" className="login-label">Password</label>
            <div className="login-input-wrap">
              <Lock size={17} className="login-input-icon" />
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="login-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-btn"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="login-submit-btn"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Card Footer */}
        <div className="login-footer-row">
          <Link to="/" className="login-back-link">
            <ArrowLeft size={14} /> Back to store
          </Link>
          <span className="login-ssl-badge">
            <ShieldCheck size={13} className="text-emerald" /> 256-bit Secure
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
