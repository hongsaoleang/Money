import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { 
  User, Package, Calendar, MapPin, Phone, Mail, Shield, Clock, 
  CheckCircle, ArrowRight, ShoppingBag, ShieldCheck, Truck, LogOut,
  Sparkles, ExternalLink, Settings as SettingsIcon, AlertCircle, Edit3, Save, Check,
  Users, UserCheck, UserX, Search, Trash2
} from 'lucide-react';

const Settings = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'profile', 'security', 'users'

  // Registered users state for admin view
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');

  // Editable address state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState(user?.address || '100 Innovation Way, Suite 400, San Francisco, CA 94105');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveAddress = (e) => {
    e.preventDefault();
    setIsEditingAddress(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2400);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatRole = (role) => {
    if (role === 'ROLE_ADMIN') return 'System Administrator';
    if (role === 'ROLE_CLIENT') return 'Verified Client Merchant';
    return 'Registered Member';
  };

  const fetchRegisteredUsers = async () => {
    if (!isAdmin) return;
    setLoadingUsers(true);
    try {
      const res = await api.get('/api/admin/users');
      setRegisteredUsers(res.data || []);
    } catch (err) {
      console.error('Failed to load registered users', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleToggleUserRole = async (targetUser) => {
    if (targetUser.email === user?.email) {
      alert("You cannot change your own authorization role.");
      return;
    }
    const newRole = targetUser.role === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
    if (!window.confirm(`Switch ${targetUser.fullName}'s role to ${newRole}?`)) return;
    try {
      await api.patch(`/api/admin/users/${targetUser.id}/role?role=${newRole}`);
      fetchRegisteredUsers();
    } catch (err) {
      alert('Failed to update user role');
    }
  };

  const handleToggleUserStatus = async (targetUser) => {
    if (targetUser.email === user?.email) {
      alert("You cannot suspend your own administrative session.");
      return;
    }
    const newStatus = !targetUser.active;
    if (!window.confirm(`${newStatus ? 'Activate' : 'Suspend'} account for ${targetUser.fullName}?`)) return;
    try {
      await api.patch(`/api/admin/users/${targetUser.id}/status?active=${newStatus}`);
      fetchRegisteredUsers();
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (targetUser.email === user?.email) {
      alert("You cannot delete your own account.");
      return;
    }
    if (!window.confirm(`Permanently delete account for ${targetUser.fullName} (${targetUser.email})?`)) return;
    try {
      await api.delete(`/api/admin/users/${targetUser.id}`);
      fetchRegisteredUsers();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/api/orders/my');
        setOrders(res.data || []);
      } catch (err) {
        console.error('Failed to load user orders', err);
      } finally {
        setLoadingOrders(false);
      }
    };
    if (user) {
      fetchOrders();
    }
    if (user && isAdmin) {
      fetchRegisteredUsers();
    }
  }, [user, isAdmin]);

  if (!user) {
    return (
      <div className="section-container text-center py-16">
        <div className="settings-empty-orders-card max-w-md mx-auto">
          <div className="empty-orders-icon-wrap">
            <User size={38} className="text-indigo-400" />
          </div>
          <h3>Authentication Required</h3>
          <p>Please sign in to access your account dashboard, view order history, and track live deliveries.</p>
          <Link to="/login" className="btn-primary mt-4">
            Sign In to Your Account <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page section-container">
      {/* 1. EXECUTIVE PROFILE HERO BANNER */}
      <div className="settings-hero-card">
        <div className="settings-hero-main">
          <div className="settings-avatar-wrapper">
            <img src="/JomnenhKH.jpg" alt={user.fullName} className="settings-avatar-img" />
            <span className="avatar-status-dot" title="Active Enterprise Session" />
          </div>
          <div className="settings-hero-info">
            <div className="settings-badge-row">
              <span className="section-badge">
                <Sparkles size={12} className="text-amber-400" /> Account Operations
              </span>
              <span className="hero-status-pill">
                <span className="pulse-dot green" /> {formatRole(user.role)}
              </span>
            </div>
            <h1 className="settings-user-name">{user.fullName}</h1>
            <div className="settings-user-meta">
              <span><Mail size={14} className="text-indigo-400" /> {user.email}</span>
              <span className="meta-sep">&bull;</span>
              <span><MapPin size={14} className="text-emerald" /> {address.split(',')[0]}</span>
              <span className="meta-sep">&bull;</span>
              <span><ShieldCheck size={14} className="text-indigo-400" /> Enterprise Verified</span>
            </div>
          </div>
        </div>

        <div className="settings-hero-actions">
          {isAdmin && (
            <>
              <Link to="/admin" className="btn-secondary settings-action-btn">
                <Shield size={15} /> Admin Hub
              </Link>
              <Link to="/products/manage" className="btn-secondary settings-action-btn">
                <Package size={15} /> Manage Products
              </Link>
            </>
          )}
          <Link to="/products" className="btn-primary settings-action-btn">
            <ShoppingBag size={15} /> Browse Catalog
          </Link>
          <button onClick={handleLogout} className="btn-outline settings-action-btn logout-btn" title="Sign out of session">
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </div>

      {/* 2. ACCOUNT KPI STAT CARDS */}
      <div className="settings-kpi-grid">
        <div className="settings-kpi-card">
          <div className="settings-kpi-icon-wrap orders">
            <Package size={20} />
          </div>
          <div className="settings-kpi-content">
            <span className="settings-kpi-lbl">Total Orders</span>
            <div className="settings-kpi-val">{orders.length} Placed</div>
            <span className="settings-kpi-sub">Lifetime ledger count</span>
          </div>
        </div>

        <div className="settings-kpi-card">
          <div className="settings-kpi-icon-wrap status">
            <ShieldCheck size={20} />
          </div>
          <div className="settings-kpi-content">
            <span className="settings-kpi-lbl">Account Status</span>
            <div className="settings-kpi-val text-emerald">Active &amp; Verified</div>
            <span className="settings-kpi-sub">256-bit encrypted session</span>
          </div>
        </div>

        <div className="settings-kpi-card">
          <div className="settings-kpi-icon-wrap role">
            <Shield size={20} />
          </div>
          <div className="settings-kpi-content">
            <span className="settings-kpi-lbl">Role Clearance</span>
            <div className="settings-kpi-val">{isAdmin ? 'Admin Tier' : 'Client Tier'}</div>
            <span className="settings-kpi-sub">Direct platform access</span>
          </div>
        </div>

        <div className="settings-kpi-card">
          <div className="settings-kpi-icon-wrap logistics">
            <Truck size={20} />
          </div>
          <div className="settings-kpi-content">
            <span className="settings-kpi-lbl">Courier SLA</span>
            <div className="settings-kpi-val">&lt; 4-Day Express</div>
            <span className="settings-kpi-sub">Air waybill tracking active</span>
          </div>
        </div>
      </div>

      {/* 3. MODERN NAV TABS */}
      <div className="settings-tabs-bar">
        <button
          className={`settings-tab-pill ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <Package size={16} /> Order History &amp; Tracking ({orders.length})
        </button>
        <button
          className={`settings-tab-pill ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={16} /> Profile &amp; Shipping Addresses
        </button>
        <button
          className={`settings-tab-pill ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Shield size={16} /> Security &amp; Privileges
        </button>
        {isAdmin && (
          <button
            className={`settings-tab-pill ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} /> Registered Users ({registeredUsers.length})
          </button>
        )}
      </div>

      {/* 4. TAB CONTENT: ORDERS */}
      {activeTab === 'orders' && (
        <div className="settings-tab-pane">
          {loadingOrders ? (
            <div className="loading-spinner">Loading your order history ledger...</div>
          ) : orders.length === 0 ? (
            <div className="settings-empty-orders-card">
              <div className="empty-orders-icon-wrap">
                <Package size={40} className="text-indigo-400" />
              </div>
              <h3 className="empty-orders-title">Your Order Ledger is Empty</h3>
              <p className="empty-orders-desc">
                When you place orders from our hardware catalog, your certified origin certificates, dispatch timestamps, and estimated arrival date will appear here in real-time.
              </p>
              <Link to="/products" className="btn-primary empty-orders-btn">
                <ShoppingBag size={17} /> Explore Hardware Catalog <ArrowRight size={16} />
              </Link>

              <div className="empty-orders-perks">
                <div className="perk-item">
                  <ShieldCheck size={20} className="text-emerald" />
                  <div>
                    <strong>100% Audited Provenance</strong>
                    <span>Origin ledgers &amp; conflict-free certification</span>
                  </div>
                </div>
                <div className="perk-item">
                  <Truck size={20} className="text-indigo" />
                  <div>
                    <strong>Express Air Courier</strong>
                    <span>Real-time waybill tracking from factory to door</span>
                  </div>
                </div>
                <div className="perk-item">
                  <Clock size={20} className="text-amber" />
                  <div>
                    <strong>4-Day Delivery SLA</strong>
                    <span>Direct dispatch with signature receipt guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-history-card">
                  <div className="order-header-row">
                    <div>
                      <span className="order-id">ORDER #{order.id}</span>
                      <span className="order-date">
                        Placed on: {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="order-status-badge">
                      <span className={`badge badge-${order.orderStatus.toLowerCase()}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Delivery date banner */}
                  <div className="order-delivery-date-banner">
                    <Calendar size={18} className="text-indigo" />
                    <div>
                      <strong>Estimated Arrival Date:</strong>{' '}
                      {order.estimatedDeliveryDate
                        ? new Date(order.estimatedDeliveryDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Calculated upon courier dispatch'}
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="order-items-table">
                    {order.items?.map((item) => (
                      <div key={item.id} className="order-item-row">
                        <img
                          src={item.product?.imageUrl || '/JomnenhKH.jpg'}
                          alt={item.product?.name}
                          className="item-thumb"
                        />
                        <div className="item-info">
                          <h4>{item.product?.name}</h4>
                          <span className="item-origin">Origin: {item.product?.originCountry || 'Imported'}</span>
                        </div>
                        <div className="item-qty">Qty: {item.quantity}</div>
                        <div className="item-price">
                          ${(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer-row">
                    <div className="shipping-address-snippet">
                      <MapPin size={15} /> Shipping To: <span>{order.shippingAddress || address}</span>
                    </div>
                    <div className="order-total-amount">
                      Total: <span>${parseFloat(order.totalAmount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. TAB CONTENT: PROFILE & SHIPPING */}
      {activeTab === 'profile' && (
        <div className="settings-tab-pane">
          <div className="settings-cards-grid">
            {/* Identity Card */}
            <div className="settings-panel-card">
              <div className="panel-card-header">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-indigo-400" />
                  <h3>Account Credentials</h3>
                </div>
                <span className="panel-card-tag">Verified Identity</span>
              </div>

              <div className="panel-card-body">
                <div className="profile-field-row">
                  <span className="field-lbl">Full Name</span>
                  <span className="field-val highlight">{user.fullName}</span>
                </div>
                <div className="profile-field-row">
                  <span className="field-lbl">Email Address</span>
                  <span className="field-val">{user.email}</span>
                </div>
                <div className="profile-field-row">
                  <span className="field-lbl">Assigned Role</span>
                  <span className="field-val role-pill-val">{formatRole(user.role)}</span>
                </div>
                <div className="profile-field-row">
                  <span className="field-lbl">Account ID</span>
                  <span className="field-val font-mono">USR-{String(user.id || 1).padStart(4, '0')}</span>
                </div>
              </div>
            </div>

            {/* Shipping Destination Card */}
            <div className="settings-panel-card">
              <div className="panel-card-header">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-emerald" />
                  <h3>Primary Shipping Destination</h3>
                </div>
                <button 
                  onClick={() => setIsEditingAddress(!isEditingAddress)} 
                  className="panel-edit-btn"
                >
                  <Edit3 size={14} /> {isEditingAddress ? 'Cancel' : 'Edit Address'}
                </button>
              </div>

              <div className="panel-card-body">
                {isEditingAddress ? (
                  <form onSubmit={handleSaveAddress} className="edit-address-form">
                    <div className="form-group">
                      <label>Delivery Address</label>
                      <input 
                        type="text" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        className="form-control"
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Direct Contact Phone</label>
                      <input 
                        type="text" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        className="form-control"
                        required 
                      />
                    </div>
                    <button type="submit" className="btn-primary mt-3">
                      <Save size={15} /> Save Updated Address
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="profile-field-row">
                      <span className="field-lbl">Street Address</span>
                      <span className="field-val">{address}</span>
                    </div>
                    <div className="profile-field-row">
                      <span className="field-lbl">Contact Phone</span>
                      <span className="field-val">{phone}</span>
                    </div>
                    <div className="profile-field-row">
                      <span className="field-lbl">Courier Routing</span>
                      <span className="field-val">Direct Express Air Cargo (Signature Required)</span>
                    </div>
                    <div className="profile-field-row">
                      <span className="field-lbl">Delivery Notice</span>
                      <span className="field-val text-muted">Audited provenance cert enclosed with shipment</span>
                    </div>
                  </>
                )}

                {savedNotice && (
                  <div className="save-notice-banner">
                    <Check size={16} /> Shipping destination updated successfully!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: SECURITY & PRIVILEGES */}
      {activeTab === 'security' && (
        <div className="settings-tab-pane">
          <div className="settings-cards-grid">
            <div className="settings-panel-card">
              <div className="panel-card-header">
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-indigo-400" />
                  <h3>Enterprise Privileges</h3>
                </div>
                <span className="panel-card-tag green">Authorized</span>
              </div>
              <div className="panel-card-body">
                <div className="security-privilege-item">
                  <div className="privilege-icon">
                    <CheckCircle size={18} className="text-emerald" />
                  </div>
                  <div>
                    <strong>Product Catalog CRUD Operations</strong>
                    <p>Full permissions to create, edit, update inventory stock, and delete catalog items.</p>
                  </div>
                </div>

                <div className="security-privilege-item">
                  <div className="privilege-icon">
                    <CheckCircle size={18} className="text-emerald" />
                  </div>
                  <div>
                    <strong>Telemetry &amp; Audit Logs</strong>
                    <p>Real-time access to stock curve analytics, pricing volatility metrics, and delivery dates.</p>
                  </div>
                </div>

                <div className="security-privilege-item">
                  <div className="privilege-icon">
                    <CheckCircle size={18} className="text-emerald" />
                  </div>
                  <div>
                    <strong>Client Merchant Deployment</strong>
                    <p>Authorized to register new merchant partner applications and custom software requests.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="settings-panel-card">
              <div className="panel-card-header">
                <div className="flex items-center gap-2">
                  <SettingsIcon size={18} className="text-amber-400" />
                  <h3>Active Session Security</h3>
                </div>
                <span className="panel-card-tag">SSL Verified</span>
              </div>
              <div className="panel-card-body">
                <div className="profile-field-row">
                  <span className="field-lbl">Session Encryption</span>
                  <span className="field-val text-emerald">TLS 1.3 / AES-256 Activated</span>
                </div>
                <div className="profile-field-row">
                  <span className="field-lbl">Authentication Mode</span>
                  <span className="field-val">Bearer JWT Token Encrypted</span>
                </div>
                <div className="profile-field-row">
                  <span className="field-lbl">Two-Factor Audit</span>
                  <span className="field-val">Hardware Token Ready</span>
                </div>

                <div className="pt-4 border-t border-border mt-4">
                  <button onClick={handleLogout} className="btn-outline w-full justify-center text-red-400 border-red-500/30 hover:bg-red-500/10">
                    <LogOut size={16} /> Terminate Current Session (Sign Out)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB CONTENT: REGISTERED USERS DIRECTORY (ADMIN) */}
      {isAdmin && activeTab === 'users' && (
        <div className="settings-tab-pane">
          <div className="settings-panel-card mb-6" style={{ marginBottom: '1.5rem' }}>
            <div className="panel-card-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-indigo-400" />
                  <h3 style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Registered Platform Accounts</h3>
                </div>
                <p className="text-muted text-xs mt-1">
                  Full directory of platform users with registered usernames, verified Gmail addresses, clearance roles, and account statuses.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/admin" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                  <Shield size={14} /> Full Admin Center
                </Link>
              </div>
            </div>

            <div className="panel-card-body">
              {/* Filter pills and Search */}
              <div 
                className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4" 
                style={{ 
                  marginTop: '1.75rem', 
                  marginBottom: '2rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  rowGap: '1.25rem'
                }}
              >
                <div className="category-pills flex flex-wrap" style={{ gap: '10px', rowGap: '12px' }}>
                  <button
                    className={`pill-btn ${userRoleFilter === 'ALL' ? 'active' : ''}`}
                    onClick={() => setUserRoleFilter('ALL')}
                    style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                  >
                    All Accounts ({registeredUsers.length})
                  </button>
                  <button
                    className={`pill-btn ${userRoleFilter === 'ROLE_ADMIN' ? 'active' : ''}`}
                    onClick={() => setUserRoleFilter('ROLE_ADMIN')}
                    style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                  >
                    👑 Admins ({registeredUsers.filter(u => u.role === 'ROLE_ADMIN').length})
                  </button>
                  <button
                    className={`pill-btn ${userRoleFilter === 'ROLE_USER' ? 'active' : ''}`}
                    onClick={() => setUserRoleFilter('ROLE_USER')}
                    style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                  >
                    👤 Normal Users ({registeredUsers.filter(u => u.role === 'ROLE_USER').length})
                  </button>
                  <button
                    className={`pill-btn ${userRoleFilter === 'ROLE_CLIENT' ? 'active' : ''}`}
                    onClick={() => setUserRoleFilter('ROLE_CLIENT')}
                    style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                  >
                    💼 Partners ({registeredUsers.filter(u => u.role === 'ROLE_CLIENT').length})
                  </button>
                </div>

                <div className="search-bar-wrap" style={{ maxWidth: '320px', width: '100%' }}>
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search username or Gmail..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="search-input"
                    style={{ padding: '10px 14px 10px 36px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Table */}
              {loadingUsers ? (
                <div className="loading-spinner py-8 text-center">Loading platform registered users...</div>
              ) : (
                <div className="table-responsive" style={{ overflowX: 'auto' }}>
                  <table className="admin-table w-full">
                    <thead>
                      <tr>
                        <th># ID</th>
                        <th>Username</th>
                        <th>Gmail / Email Address</th>
                        <th>Role / Access Level</th>
                        <th>Account Status</th>
                        <th>Registered Date</th>
                        <th style={{ textAlign: 'right' }}>Authorization Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registeredUsers
                        .filter((u) => {
                          const matchesFilter = userRoleFilter === 'ALL' || u.role === userRoleFilter;
                          const matchesSearch = !userSearchQuery.trim() ||
                            u.fullName?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                            u.email?.toLowerCase().includes(userSearchQuery.toLowerCase());
                          return matchesFilter && matchesSearch;
                        })
                        .map((u) => {
                          const isSelf = u.email === user?.email;
                          return (
                            <tr key={u.id}>
                              <td>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                                  #USR-{String(u.id).padStart(4, '0')}
                                </span>
                              </td>
                              <td>
                                <div className="flex items-center gap-3">
                                  <div
                                    style={{
                                      width: '34px',
                                      height: '34px',
                                      borderRadius: '50%',
                                      background: u.role === 'ROLE_ADMIN'
                                        ? 'linear-gradient(135deg, #6366f1, #38bdf8)'
                                        : 'linear-gradient(135deg, #10b981, #06b6d4)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: 800,
                                      color: '#fff',
                                      fontSize: '0.82rem',
                                      flexShrink: 0
                                    }}
                                  >
                                    {u.fullName?.charAt(0) || 'U'}
                                  </div>
                                  <div>
                                    <strong style={{ display: 'block', color: 'var(--text-main, #fff)', fontSize: '0.9rem' }}>
                                      {u.fullName}
                                    </strong>
                                    {isSelf && <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 600 }}>(You / Logged In)</span>}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center gap-2">
                                  <Mail size={14} className="text-indigo-400" />
                                  <a
                                    href={`mailto:${u.email}`}
                                    style={{
                                      fontSize: '0.85rem',
                                      color: '#38bdf8',
                                      fontFamily: 'var(--font-mono)',
                                      textDecoration: 'none'
                                    }}
                                    title={`Send email to ${u.email}`}
                                  >
                                    {u.email}
                                  </a>
                                </div>
                              </td>
                              <td>
                                {u.role === 'ROLE_ADMIN' && (
                                  <span className="badge-clearance-pill" style={{ background: 'rgba(99, 102, 241, 0.2)', borderColor: 'rgba(99, 102, 241, 0.5)', color: '#818cf8', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                    <ShieldCheck size={12} /> Administrator
                                  </span>
                                )}
                                {u.role === 'ROLE_USER' && (
                                  <span className="badge-clearance-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#34d399', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                    <Users size={12} /> Normal User
                                  </span>
                                )}
                                {u.role === 'ROLE_CLIENT' && (
                                  <span className="badge-clearance-pill" style={{ background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                    <Shield size={12} /> Client / Partner
                                  </span>
                                )}
                              </td>
                              <td>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  color: u.active !== false ? '#34d399' : '#f87171'
                                }}>
                                  <span style={{
                                    width: '7px',
                                    height: '7px',
                                    borderRadius: '50%',
                                    background: u.active !== false ? '#34d399' : '#f87171'
                                  }} />
                                  {u.active !== false ? 'Active Account' : 'Suspended'}
                                </span>
                              </td>
                              <td>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Verified Member'}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <div className="flex items-center justify-end gap-2">
                                  {!isSelf && (
                                    <>
                                      <button
                                        onClick={() => handleToggleUserRole(u)}
                                        className="btn-outline"
                                        style={{ padding: '5px 10px', fontSize: '0.75rem', borderColor: 'rgba(99, 102, 241, 0.4)' }}
                                        title={`Switch role to ${u.role === 'ROLE_ADMIN' ? 'User' : 'Admin'}`}
                                      >
                                        {u.role === 'ROLE_ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                                      </button>
                                      <button
                                        onClick={() => handleToggleUserStatus(u)}
                                        className="btn-outline"
                                        style={{
                                          padding: '5px 10px',
                                          fontSize: '0.75rem',
                                          borderColor: u.active !== false ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)',
                                          color: u.active !== false ? '#f87171' : '#34d399'
                                        }}
                                        title={u.active !== false ? 'Suspend Account' : 'Activate Account'}
                                      >
                                        {u.active !== false ? <UserX size={13} /> : <UserCheck size={13} />}
                                        <span className="hidden sm:inline">{u.active !== false ? 'Suspend' : 'Activate'}</span>
                                      </button>
                                      <button
                                        onClick={() => handleDeleteUser(u)}
                                        className="btn-outline"
                                        style={{
                                          padding: '5px 8px',
                                          fontSize: '0.75rem',
                                          borderColor: 'rgba(239, 68, 68, 0.3)',
                                          color: '#f87171'
                                        }}
                                        title="Delete User"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </>
                                  )}
                                  {isSelf && (
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                                      Active Primary Session
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
