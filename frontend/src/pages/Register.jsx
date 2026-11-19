import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  UserPlus, User, Mail, Lock, Phone, MapPin, 
  AlertCircle, Info, Eye, EyeOff, ArrowRight, ArrowLeft, 
  CheckCircle, RefreshCw, ShieldCheck
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'ROLE_USER',
  });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [successNotice, setSuccessNotice] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const { register, sendRegistrationOtp, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from?.pathname || '/';
  const infoMessage = location.state?.message;

  // Countdown timer for resending OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);

    if (!formData.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const res = await sendRegistrationOtp(formData.email.trim(), formData.fullName.trim());
    if (res.success) {
      setStep('otp');
      setResendCooldown(60);
      setSuccessNotice(`Verification code sent to ${formData.email.trim()}. Please check your inbox or spam folder.`);
    } else {
      setError(res.error);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    setSuccessNotice(null);

    const res = await sendRegistrationOtp(formData.email.trim(), formData.fullName.trim());
    if (res.success) {
      setResendCooldown(60);
      setSuccessNotice(`A fresh verification code was sent to ${formData.email.trim()}`);
    } else {
      setError(res.error);
    }
  };

  // Step 2: Verify OTP and complete registration
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError(null);

    const cleanOtp = otp.trim().replace(/\s+/g, '');
    if (!cleanOtp || cleanOtp.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    const res = await register({
      ...formData,
      email: formData.email.trim().toLowerCase(),
      fullName: formData.fullName.trim(),
      otp: cleanOtp,
    });

    if (res.success) {
      navigate(destination, { replace: true });
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card-modern" style={{ maxWidth: step === 'otp' ? '460px' : '520px' }}>
        {/* Brand Header */}
        <div className="login-brand-header">
          <Link to="/products" className="login-logo-link" title="Return to Products">
            <img 
              src="/JomnenhKH.jpg" 
              alt="Jomnenh-KH Logo" 
              className="login-brand-logo" 
            />
            <span className="login-logo-text">Jomnenh<span className="logo-accent">-KH</span></span>
          </Link>
          <h1 className="login-title">
            {step === 'otp' ? 'Verify Your Email' : 'Create Account'}
          </h1>
          <p className="login-subtitle">
            {step === 'otp' 
              ? `We sent a 6-digit code to ${formData.email}`
              : 'Sign up to shop, manage orders, and connect with Hong Saoleang'}
          </p>
        </div>

        {/* Informational Message Banner */}
        {infoMessage && !error && !successNotice && (
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

        {/* Success Notice Banner */}
        {successNotice && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '12px',
            padding: '12px 14px',
            marginBottom: '18px',
            color: '#6ee7b7',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            lineHeight: 1.45
          }}>
            <ShieldCheck size={18} style={{ flexShrink: 0, color: '#34d399' }} />
            <span>{successNotice}</span>
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

        {/* ========================================================= */}
        {/* STEP 1: REGISTRATION DETAILS FORM                         */}
        {/* ========================================================= */}
        {step === 'form' && (
          <form onSubmit={handleSendOtp} className="login-form">
            <div className="login-field">
              <label htmlFor="reg-name" className="login-label">Full Name *</label>
              <div className="login-input-wrap">
                <User size={17} className="login-input-icon" />
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Hong Saoleang"
                  className="login-input"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="reg-email" className="login-label">Email Address *</label>
              <div className="login-input-wrap">
                <Mail size={17} className="login-input-icon" />
                <input
                  id="reg-email"
                  type="email"
                  required
                  spellCheck="false"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@gmail.com"
                  autoComplete="email"
                  className="login-input"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="reg-password" className="login-label">Password *</label>
              <div className="login-input-wrap">
                <Lock size={17} className="login-input-icon" />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="login-field">
                <label htmlFor="reg-phone" className="login-label">Phone Number</label>
                <div className="login-input-wrap">
                  <Phone size={16} className="login-input-icon" />
                  <input
                    id="reg-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+855 12 345 678"
                    className="login-input"
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="reg-role" className="login-label">Account Type</label>
                <div className="login-input-wrap">
                  <select
                    id="reg-role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="login-input"
                    style={{ paddingLeft: '14px', cursor: 'pointer' }}
                  >
                    <option value="ROLE_USER">Customer</option>
                    <option value="ROLE_CLIENT">Merchant</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="reg-address" className="login-label">Delivery Address</label>
              <div className="login-input-wrap">
                <MapPin size={17} className="login-input-icon" />
                <input
                  id="reg-address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Phnom Penh, Cambodia"
                  className="login-input"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="login-submit-btn"
              style={{ marginTop: '6px' }}
            >
              {loading ? (
                <span>Sending Verification Code...</span>
              ) : (
                <>
                  <span>Continue &amp; Send OTP</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* ========================================================= */}
        {/* STEP 2: OTP VERIFICATION SCREEN                           */}
        {/* ========================================================= */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyAndRegister} className="login-form">
            <div className="login-field" style={{ textAlign: 'center' }}>
              <label htmlFor="otp-input" className="login-label" style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
                Enter 6-Digit Email Verification Code
              </label>

              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  id="otp-input"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]*"
                  maxLength={6}
                  autoFocus
                  required
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                    setOtp(val);
                  }}
                  placeholder="123456"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '2px solid rgba(99, 102, 241, 0.45)',
                    background: 'rgba(99, 102, 241, 0.08)',
                    color: '#fff',
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.35em',
                    textAlign: 'center',
                    outline: 'none',
                    boxShadow: '0 0 15px rgba(99, 102, 241, 0.25)',
                    fontFamily: 'monospace, monospace',
                  }}
                />
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                Tip: You can copy and paste the 6-digit code directly from your email
              </p>
            </div>

            <button 
              type="submit" 
              disabled={loading || otp.trim().length !== 6} 
              className="login-submit-btn"
              style={{
                marginTop: '10px',
                opacity: otp.trim().length === 6 ? 1 : 0.65,
                cursor: otp.trim().length === 6 ? 'pointer' : 'not-allowed',
              }}
            >
              {loading ? (
                <span>Verifying &amp; Creating Account...</span>
              ) : (
                <>
                  <CheckCircle size={18} />
                  <span>Verify &amp; Create Account</span>
                </>
              )}
            </button>

            {/* Resend & Back controls */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              alignItems: 'center',
              marginTop: '12px',
              paddingTop: '14px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: resendCooldown > 0 ? 'var(--text-dim)' : '#818cf8',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: resendCooldown > 0 ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend verification code'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('form');
                  setError(null);
                  setSuccessNotice(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <ArrowLeft size={13} /> Change email address or edit details
              </button>
            </div>
          </form>
        )}

        {/* Footer Link */}
        <div className="login-footer-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '22px' }}>
          <Link to="/products" className="login-back-link">
            <ArrowLeft size={14} /> Back to products
          </Link>
          <Link to="/login" state={location.state} className="login-back-link" style={{ color: '#818cf8', fontWeight: 600 }}>
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
