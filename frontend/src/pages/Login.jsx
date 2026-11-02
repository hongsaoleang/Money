import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Key, Mail, Shield, User, Briefcase, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login, loading } = useAuth();
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
          <p>Sign in to your NexusTech account</p>
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

        {/* 1-Click Test Credentials for Testing Roles */}
        <div className="quick-roles-container">
          <p className="quick-roles-title">Instant Demo Role Sign In:</p>
          <div className="quick-roles-grid">
            <button
              type="button"
              onClick={() => fillQuickCredentials('admin@ecommerce.com', 'admin123')}
              className="role-pill-btn admin-role"
            >
              <Shield size={13} /> Admin
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
