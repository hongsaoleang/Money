import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Key, Phone, MapPin, Briefcase, AlertCircle, Info } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'ROLE_USER', // or 'ROLE_CLIENT'
  });
  const [error, setError] = useState(null);
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from?.pathname || '/';
  const infoMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await register(formData);
    if (res.success) {
      navigate(destination, { replace: true });
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="auth-page section-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <div className="auth-icon-badge"><UserPlus size={24} /></div>
          <h1>Create an Account</h1>
          <p>Create your customer or merchant account</p>
        </div>

        {infoMessage && !error && (
          <div className="alert-info" style={{
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '18px',
            color: '#a5b4fc',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            lineHeight: 1.4
          }}>
            <Info size={18} style={{ flexShrink: 0, color: '#818cf8' }} />
            <span>{infoMessage}</span>
          </div>
        )}

        {error && (
          <div className="alert-error">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name *</label>
            <div className="input-with-icon">
              <User size={16} className="input-icon" />
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Alex Morgan"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex@example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password *</label>
            <div className="input-with-icon">
              <Key size={16} className="input-icon" />
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 6 characters"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-with-icon">
                <Phone size={16} className="input-icon" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+855 12 345 678"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Account type</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="role-select"
              >
                <option value="ROLE_USER">Customer</option>
                <option value="ROLE_CLIENT">Merchant</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Delivery or business address</label>
            <div className="input-with-icon">
              <MapPin size={16} className="input-icon" />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street Address, City, State, ZIP"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary auth-submit-btn">
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" state={location.state}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
