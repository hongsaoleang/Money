import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Key, Mail, Shield, User, Briefcase, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.error);
    }
  };

  const fillQuickCredentials = (eMail, pWord) => {
    setEmail(eMail);
    setPassword(pWord);
  };

  return (
    <div className="auth-page section-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-badge"><LogIn size={24} /></div>
          <h1>Welcome Back</h1>
          <p>Sign in to your Jomnenh-KH account</p>
        </div>

        {error && (
          <div className="alert-error">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Key size={16} className="input-icon" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary auth-submit-btn">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Google / Gmail Integration Sign-In */}
        <div className="google-auth-separator">
          <span>OR CONTINUE WITH GMAIL</span>
        </div>

        <button
          type="button"
          onClick={async () => {
            setError(null);
            const res = await loginWithGoogle('hongsaoleang@gmail.com', 'Hong Saoleang');
            if (res.success) {
              navigate('/');
            } else {
              setError(res.error);
            }
          }}
          disabled={loading}
          className="google-sign-in-btn"
          title="Sign in with your Google / Gmail account (hongsaoleang@gmail.com)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign In with Gmail / Google</span>
        </button>

        {/* 1-Click Test Credentials for Testing Roles */}
        <div className="quick-roles-container">
          <p className="quick-roles-title">Instant Role Sign In:</p>
          <div className="quick-roles-grid">
            <button
              type="button"
              onClick={() => fillQuickCredentials('hongsaoleang@gmail.com', 'saoleang9259')}
              className="role-pill-btn admin-role"
              title="hongsaoleang@gmail.com / saoleang9259"
            >
              <Shield size={13} /> Admin (hongsaoleang@gmail.com)
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials('client@ecommerce.com', 'client123')}
              className="role-pill-btn client-role"
            >
              <Briefcase size={13} /> Client/Vendor
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials('user@ecommerce.com', 'user123')}
              className="role-pill-btn user-role"
            >
              <User size={13} /> Customer
            </button>
          </div>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
