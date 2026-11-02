import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Key, Phone, MapPin, Briefcase, AlertCircle } from 'lucide-react';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await register(formData);
    if (res.success) {
      navigate('/');
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
          <p>Join NexusTech as a customer or partner merchant</p>
        </div>

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
                  placeholder="+1 (555) 012-3456"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Account Type / Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="role-select"
              >
                <option value="ROLE_USER">Customer (Shop & Order)</option>
                <option value="ROLE_CLIENT">Merchant / Client (Deploy Products)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Delivery / Company Address</label>
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
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
