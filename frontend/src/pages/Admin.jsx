import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import DeveloperPhotoPicker from '../components/DeveloperPhotoPicker';
import { 
  LayoutDashboard, Package, Clock, CheckCircle, XCircle, Trash2, Edit3, Plus, 
  Layers, Users, ShoppingCart, DollarSign, MessageSquare, Calendar, Globe, AlertCircle,
  UserPlus, ShieldCheck, Shield, ShieldAlert, UserCheck, UserX, Key, Search, ArrowRight, ExternalLink,
  Mail
} from 'lucide-react';

const Admin = () => {
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [teamProfiles, setTeamProfiles] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // User Management state
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userFormSubmitting, setUserFormSubmitting] = useState(false);
  const [userFormFeedback, setUserFormFeedback] = useState(null);
  const [newUserForm, setNewUserForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'ROLE_ADMIN',
    phone: '',
    address: ''
  });

  // Gmail testing state
  const [mailTesting, setMailTesting] = useState(false);
  const [mailFeedback, setMailFeedback] = useState(null);

  const handleSendTestEmail = async () => {
    setMailTesting(true);
    setMailFeedback(null);
    try {
      const res = await api.post('/admin/mail/test');
      setMailFeedback({
        type: 'success',
        message: res.data?.message || 'Test email dispatched successfully to hongsaoleang@gmail.com!'
      });
    } catch (err) {
      setMailFeedback({
        type: 'error',
        message: err.response?.data?.error || err.message || 'Failed to send test email'
      });
    } finally {
      setMailTesting(false);
    }
  };

  // Product CRUD modal state
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    id: null,
    name: '',
    categoryId: '',
    price: '',
    stockQuantity: '',
    originCountry: '',
    provenanceDetails: '',
    imageUrl: '',
    description: '',
    releaseDate: '',
  });

  // Services CRUD state
  const [isEditingService, setIsEditingService] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    id: null,
    title: '',
    slug: '',
    summary: '',
    description: '',
    icon: 'Code',
    active: true,
  });

  // Portfolio CRUD state
  const [isEditingPortfolio, setIsEditingPortfolio] = useState(false);
  const [portfolioForm, setPortfolioForm] = useState({
    id: null,
    title: '',
    description: '',
    techStack: '',
    clientName: '',
    liveUrl: '',
    imageUrl: '',
    completedDate: '',
  });

  const [isEditingDeveloper, setIsEditingDeveloper] = useState(false);
  const [developerForm, setDeveloperForm] = useState({
    id: null, name: '', role: '', badgeRole: '', pill: '', avatar: '', bio: '', skills: '',
  });

  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    }
  }, [isAdmin]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        prodRes,
        pendingRes,
        catRes,
        srvRes,
        portRes,
        ordersRes,
        inqRes,
        usersRes,
        developersRes,
      ] = await Promise.all([
        api.get('/api/admin/dashboard'),
        api.get('/api/admin/products'),
        api.get('/api/admin/products/pending'),
        api.get('/api/categories'),
        api.get('/api/services'),
        api.get('/api/portfolio'),
        api.get('/api/admin/orders'),
        api.get('/api/inquiries'),
        api.get('/api/admin/users').catch(() => ({ data: [] })),
        api.get('/api/admin/developers'),
      ]);

      setStats(statsRes.data);
      setProducts(prodRes.data);
      setPendingProducts(pendingRes.data);
      setCategories(catRes.data);
      if (catRes.data.length > 0 && !productForm.categoryId) {
        setProductForm((prev) => ({ ...prev, categoryId: catRes.data[0].id }));
      }
      setServices(srvRes.data);
      setPortfolio(portRes.data);
      setOrders(ordersRes.data);
      setInquiries(inqRes.data);
      setUsers(usersRes.data || []);
      setTeamProfiles(developersRes.data || []);
    } catch (err) {
      console.error('Error loading admin data', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="section-container" style={{ textAlign: 'center', padding: '90px 20px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: '#ef4444' }}>
          <ShieldAlert size={36} />
        </div>
        <span className="section-badge" style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#ef4444' }}>Restricted Area</span>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, margin: '10px 0', letterSpacing: '-0.5px' }}>Administrator Access Required</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 28px', lineHeight: 1.6, fontSize: '0.95rem' }}>
          This operations hub is restricted to authorized platform administrators only. Please sign in with administrator credentials.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/login" className="btn-primary" style={{ padding: '10px 22px' }}>Sign In as Admin</Link>
          <Link to="/" className="btn-secondary" style={{ padding: '10px 22px' }}>Return to Home</Link>
        </div>
      </div>
    );
  }

  // Handle Product Save (Create or Update + Release Date)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: productForm.name,
        categoryId: parseInt(productForm.categoryId, 10),
        price: parseFloat(productForm.price),
        stockQuantity: parseInt(productForm.stockQuantity, 10),
        originCountry: productForm.originCountry,
        provenanceDetails: productForm.provenanceDetails,
        imageUrl: productForm.imageUrl,
        description: productForm.description,
        releaseDate: productForm.releaseDate ? new Date(productForm.releaseDate).toISOString() : null,
      };

      if (productForm.id) {
        await api.put(`/api/admin/products/${productForm.id}`, payload);
      } else {
        await api.post('/api/admin/products', payload);
      }

      setIsEditingProduct(false);
      resetProductForm();
      loadAllData();
    } catch (err) {
      alert('Error saving product: ' + (err.response?.data?.message || err.message));
    }
  };

  const resetProductForm = () => {
    setProductForm({
      id: null,
      name: '',
      categoryId: categories[0]?.id || '',
      price: '',
      stockQuantity: '',
      originCountry: '',
      provenanceDetails: '',
      imageUrl: '',
      description: '',
      releaseDate: '',
    });
  };

  const handleEditProductClick = (prod) => {
    setProductForm({
      id: prod.id,
      name: prod.name,
      categoryId: prod.category?.id || categories[0]?.id,
      price: prod.price,
      stockQuantity: prod.stockQuantity,
      originCountry: prod.originCountry || '',
      provenanceDetails: prod.provenanceDetails || '',
      imageUrl: prod.imageUrl || '',
      description: prod.description || '',
      releaseDate: prod.releaseDate ? prod.releaseDate.substring(0, 16) : '',
    });
    setIsEditingProduct(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/api/admin/products/${id}`);
      loadAllData();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  // Review Client Submissions (Approve or Reject + Option to schedule release date)
  const handleReviewSubmission = async (id, status, releaseDate = null) => {
    try {
      await api.patch(`/api/admin/products/${id}/review`, {
        status,
        releaseDate: releaseDate ? new Date(releaseDate).toISOString() : null,
      });
      loadAllData();
    } catch (err) {
      alert('Failed to update product review status');
    }
  };

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/api/admin/orders/${orderId}/status?status=${newStatus}`);
      loadAllData();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  // Save Service
  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      if (serviceForm.id) {
        await api.put(`/api/services/${serviceForm.id}`, serviceForm);
      } else {
        await api.post('/api/services', serviceForm);
      }
      setIsEditingService(false);
      setServiceForm({ id: null, title: '', slug: '', summary: '', description: '', icon: 'Code', active: true });
      loadAllData();
    } catch (err) {
      alert('Failed to save service');
    }
  };

  // Save Portfolio Project
  const handleSavePortfolio = async (e) => {
    e.preventDefault();
    try {
      if (portfolioForm.id) {
        await api.put(`/api/portfolio/${portfolioForm.id}`, portfolioForm);
      } else {
        await api.post('/api/portfolio', portfolioForm);
      }
      setIsEditingPortfolio(false);
      setPortfolioForm({ id: null, title: '', description: '', techStack: '', clientName: '', liveUrl: '', imageUrl: '', completedDate: '' });
      loadAllData();
    } catch (err) {
      alert('Failed to save portfolio project');
    }
  };

  const handleSaveDeveloper = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/api/admin/developers/${developerForm.id}`, developerForm);
      setTeamProfiles((profiles) => profiles.map((profile) => profile.id === data.id ? data : profile));
      setIsEditingDeveloper(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not save developer profile.');
    }
  };

  // Handle Create User / Admin
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserFormSubmitting(true);
    setUserFormFeedback(null);
    try {
      const res = await api.post('/api/admin/users', newUserForm);
      setUsers((prev) => [res.data, ...prev]);
      setStats((prev) => prev ? { ...prev, totalUsers: (prev.totalUsers || 0) + 1 } : prev);
      setUserFormFeedback({
        type: 'success',
        text: `Account created successfully! ${newUserForm.email} can now sign in as ${newUserForm.role === 'ROLE_ADMIN' ? 'Administrator' : 'Normal User'}.`
      });
      setNewUserForm({
        fullName: '',
        email: '',
        password: '',
        role: 'ROLE_ADMIN',
        phone: '',
        address: ''
      });
      setTimeout(() => {
        setIsUserModalOpen(false);
        setUserFormFeedback(null);
      }, 1600);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || 'Failed to create user. Verify email is unique.';
      setUserFormFeedback({
        type: 'error',
        text: typeof errorMsg === 'string' ? errorMsg : 'Failed to create account.'
      });
    } finally {
      setUserFormSubmitting(false);
    }
  };

  // Toggle User Role (Admin <-> Normal User)
  const handleToggleUserRole = async (userId, currentRole) => {
    const targetRole = currentRole === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
    const confirmMessage = targetRole === 'ROLE_ADMIN'
      ? 'Promote this user to Administrator? They will gain full master access to CRUD inventory and dashboard.'
      : 'Change this user to Normal User? Administrator access will be revoked.';
    if (!window.confirm(confirmMessage)) return;

    try {
      await api.patch(`/api/admin/users/${userId}/role?role=${targetRole}`);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: targetRole } : u));
    } catch (err) {
      alert('Failed to update user role');
    }
  };

  // Toggle User Status (Active <-> Suspended)
  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.patch(`/api/admin/users/${userId}/status?active=${!currentStatus}`);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, active: !currentStatus } : u));
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  // Delete User Account
  const handleDeleteUser = async (userId, email) => {
    if (email === user?.email) {
      alert('You cannot delete your own administrative account.');
      return;
    }
    if (!window.confirm(`Are you sure you want to permanently delete user "${email}"?`)) return;

    try {
      await api.delete(`/api/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setStats((prev) => prev ? { ...prev, totalUsers: Math.max(0, (prev.totalUsers || 1) - 1) } : prev);
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  return (
    <div className="admin-page section-container">
      {/* Top Header */}
      <div className="admin-header">
        <div>
          <span className="section-badge">Master Control</span>
          <h1 className="page-title">Administration Operations Hub</h1>
          <p className="page-desc">
            Manage product releases, review merchant listing requests, govern software agency services, and track customer orders.
          </p>
        </div>
        <div className="admin-actions flex items-center gap-2">
          <Link
            to="/products/manage"
            className="btn-secondary flex items-center gap-2"
            title="Open Dedicated Inventory CRUD Hub"
          >
            <Package size={16} /> Manage (CRUD)
          </Link>
          <button
            onClick={() => {
              setUserFormFeedback(null);
              setIsUserModalOpen(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <UserPlus size={16} /> Add Admin / User
          </button>
          <button
            onClick={() => {
              resetProductForm();
              setIsEditingProduct(true);
            }}
            className="btn-secondary flex items-center gap-2"
          >
            <Plus size={16} /> New Product
          </button>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={16} /> Dashboard & Metrics
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={16} /> Users & Admins ({users.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={16} /> Product Catalog CRUD ({products.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <AlertCircle size={16} /> Client Product Requests ({pendingProducts.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          <Layers size={16} /> Services & Portfolio CMS
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingCart size={16} /> Orders & Delivery ({orders.length})
        </button>
      </div>

      {/* Tab 1: Dashboard */}
      {activeTab === 'dashboard' && stats && (
        <div className="dashboard-view">
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon revenue"><DollarSign size={24} /></div>
              <div>
                <span className="kpi-title">Gross Revenue</span>
                <h3 className="kpi-value">${parseFloat(stats.totalRevenue).toFixed(2)}</h3>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon orders"><ShoppingCart size={24} /></div>
              <div>
                <span className="kpi-title">Completed Orders</span>
                <h3 className="kpi-value">{stats.totalOrders}</h3>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon products"><Package size={24} /></div>
              <div>
                <span className="kpi-title">Total Products</span>
                <h3 className="kpi-value">{stats.totalProducts}</h3>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon pending"><AlertCircle size={24} /></div>
              <div>
                <span className="kpi-title">Pending Merchant Requests</span>
                <h3 className="kpi-value text-amber">{stats.pendingProductApprovals}</h3>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon services"><Layers size={24} /></div>
              <div>
                <span className="kpi-title">Active Agency Services</span>
                <h3 className="kpi-value">{stats.activeServices}</h3>
              </div>
            </div>

            <div className="kpi-card" onClick={() => setActiveTab('users')} style={{ cursor: 'pointer' }} title="Click to view and manage users & admins">
              <div className="kpi-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}><Users size={24} /></div>
              <div>
                <span className="kpi-title">Users & Admins</span>
                <h3 className="kpi-value">{users.length || stats.totalUsers}</h3>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon inquiries"><MessageSquare size={24} /></div>
              <div>
                <span className="kpi-title">Software Inquiries</span>
                <h3 className="kpi-value">{stats.totalInquiries}</h3>
              </div>
            </div>
          </div>

          {/* Quick Hub Launchers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.95rem', color: '#38bdf8' }}>
                  <Package size={18} /> Product Inventory CRUD
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Direct catalog additions, specs editing, stock updates & instant deletions.
                </p>
              </div>
              <Link to="/products/manage" className="btn-primary btn-sm flex items-center gap-1.5 whitespace-nowrap" style={{ padding: '8px 14px' }}>
                Open CRUD Hub <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.95rem', color: '#a78bfa' }}>
                  <ShieldCheck size={18} /> User & Admin Authorization
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Add new admins or normal users, promote accounts, or suspend access.
                </p>
              </div>
              <button onClick={() => { setUserFormFeedback(null); setIsUserModalOpen(true); }} className="btn-secondary btn-sm flex items-center gap-1.5 whitespace-nowrap" style={{ padding: '8px 14px' }}>
                <UserPlus size={14} /> Add User
              </button>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.95rem', color: '#10b981' }}>
                  <Mail size={18} /> Gmail SMTP Active
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Connected as <strong>hongsaoleang@gmail.com</strong> for notifications &amp; order receipts.
                </p>
                {mailFeedback && (
                  <p style={{ fontSize: '0.75rem', marginTop: '6px', color: mailFeedback.type === 'success' ? '#10b981' : '#f43f5e' }}>
                    {mailFeedback.message}
                  </p>
                )}
              </div>
              <button 
                onClick={handleSendTestEmail} 
                disabled={mailTesting}
                className="btn-secondary btn-sm flex items-center gap-1.5 whitespace-nowrap" 
                style={{ padding: '8px 14px' }}
              >
                {mailTesting ? 'Sending...' : 'Test Gmail Relay'}
              </button>
            </div>
          </div>

          {/* Pending Requests Quick Alert */}
          {pendingProducts.length > 0 && (
            <div className="admin-alert-banner">
              <AlertCircle size={20} className="text-amber" />
              <div>
                <strong>Action Needed:</strong> There are {pendingProducts.length} merchant product deployment request(s) awaiting your review.
              </div>
              <button onClick={() => setActiveTab('pending')} className="btn-secondary btn-sm">
                Review Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Products CRUD & Scheduled Release */}
      {activeTab === 'products' && (
        <div className="admin-products-view">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Origin & Provenance</th>
                  <th>Release Schedule (User Role)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const isScheduledFuture = p.releaseDate && new Date(p.releaseDate) > new Date();
                  return (
                    <tr key={p.id}>
                      <td className="table-product-cell">
                        <img src={p.imageUrl} alt={p.name} className="table-thumb" />
                        <div>
                          <strong>{p.name}</strong>
                          <span className="table-vendor">Vendor: {p.vendor?.fullName || 'Jomnenh-KH Direct'}</span>
                        </div>
                      </td>
                      <td>{p.category?.name}</td>
                      <td>${parseFloat(p.price).toFixed(2)}</td>
                      <td>{p.stockQuantity}</td>
                      <td>
                        <span className="origin-tag"><Globe size={11} /> {p.originCountry}</span>
                      </td>
                      <td>
                        {p.releaseDate ? (
                          <div className={isScheduledFuture ? 'text-amber' : 'text-emerald'}>
                            <Calendar size={13} /> {new Date(p.releaseDate).toLocaleString()}
                            {isScheduledFuture && <span className="block text-xs font-semibold">(Scheduled Future)</span>}
                          </div>
                        ) : (
                          <span className="text-muted">Immediately Available</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge badge-${p.status === 'APPROVED' ? 'success' : p.status === 'PENDING_REVIEW' ? 'warning' : 'danger'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button onClick={() => handleEditProductClick(p)} className="action-btn edit" title="Edit">
                            <Edit3 size={15} />
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="action-btn delete" title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Client Product Deployment Requests Hub */}
      {activeTab === 'pending' && (
        <div className="admin-pending-view">
          <div className="sub-header">
            <h2>Client & Merchant Deployment Submissions</h2>
            <p>Clients can submit their products for deployment. Inspect their specifications, provenance, and approve or reject.</p>
          </div>

          {pendingProducts.length === 0 ? (
            <div className="empty-state">
              <CheckCircle size={36} className="text-emerald" />
              <h3>All clear!</h3>
              <p>There are no pending client product requests waiting for review.</p>
            </div>
          ) : (
            <div className="pending-cards-grid">
              {pendingProducts.map((p) => (
                <div key={p.id} className="pending-card">
                  <div className="pending-header">
                    <img src={p.imageUrl} alt={p.name} className="pending-thumb" />
                    <div>
                      <h3>{p.name}</h3>
                      <p className="pending-vendor-info">Requested by: <strong>{p.vendor?.fullName}</strong> ({p.vendor?.email})</p>
                      <span className="origin-badge"><Globe size={12} /> Origin: {p.originCountry}</span>
                    </div>
                  </div>

                  <div className="pending-specs">
                    <div><strong>Category:</strong> {p.category?.name}</div>
                    <div><strong>Proposed Price:</strong> ${parseFloat(p.price).toFixed(2)}</div>
                    <div><strong>Initial Stock:</strong> {p.stockQuantity}</div>
                  </div>

                  <div className="pending-box">
                    <strong>Provenance & Sourcing Details:</strong>
                    <p>{p.provenanceDetails}</p>
                  </div>

                  <div className="pending-box">
                    <strong>Description:</strong>
                    <p>{p.description}</p>
                  </div>

                  <div className="pending-actions">
                    <button
                      onClick={() => handleReviewSubmission(p.id, 'APPROVED')}
                      className="btn-primary btn-sm"
                    >
                      <CheckCircle size={14} /> Approve & Deploy Live
                    </button>
                    <button
                      onClick={() => {
                        const sched = prompt('Enter scheduled release date/time (YYYY-MM-DDTHH:MM):', new Date().toISOString().substring(0, 16));
                        if (sched) handleReviewSubmission(p.id, 'APPROVED', sched);
                      }}
                      className="btn-secondary btn-sm"
                    >
                      <Clock size={14} /> Approve with Scheduled Release Date
                    </button>
                    <button
                      onClick={() => handleReviewSubmission(p.id, 'REJECTED')}
                      className="btn-danger btn-sm"
                    >
                      <XCircle size={14} /> Reject Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Services & Portfolio Manager */}
      {activeTab === 'services' && (
        <div className="admin-services-view">
          <div className="sub-header-row">
            <div>
              <h2>Team profiles</h2>
              <p>Edit the names, roles, portraits, and skills shown on the About page.</p>
            </div>
          </div>
          <div className="services-admin-grid developer-admin-grid">
            {teamProfiles.map((profile) => (
              <div key={profile.id} className="service-admin-card developer-admin-card">
                <div className="developer-admin-identity">
                  <img src={profile.avatar} alt="" />
                  <div>
                    <h3>{profile.name}</h3>
                    <p>{profile.pill}</p>
                  </div>
                </div>
                <p className="summary-text">{profile.role}</p>
                <button
                  onClick={() => {
                    setDeveloperForm({ ...profile, skills: profile.skills || '' });
                    setIsEditingDeveloper(true);
                  }}
                  className="btn-secondary btn-sm"
                >
                  <Edit3 size={14} /> Edit profile
                </button>
              </div>
            ))}
          </div>

          <div className="sub-header-row">
            <div>
              <h2>Software Engineering Agency Offerings</h2>
              <p>Manage the Web & App services displayed on the public Services page.</p>
            </div>
            <button
              onClick={() => {
                setServiceForm({ id: null, title: '', slug: '', summary: '', description: '', icon: 'Code', active: true });
                setIsEditingService(true);
              }}
              className="btn-primary btn-sm"
            >
              <Plus size={14} /> Add Service
            </button>
          </div>

          <div className="services-admin-grid">
            {services.map((srv) => (
              <div key={srv.id} className="service-admin-card">
                <h3>{srv.title}</h3>
                <p className="slug-tag">Slug: {srv.slug}</p>
                <p className="summary-text">{srv.summary}</p>
                <div className="card-actions">
                  <button
                    onClick={() => {
                      setServiceForm(srv);
                      setIsEditingService(true);
                    }}
                    className="btn-secondary btn-sm"
                  >
                    Edit Service
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="sub-header-row mt-8">
            <div>
              <h2>Completed Client Portfolio Projects</h2>
              <p>Projects showcased on the website to prove our software building capability.</p>
            </div>
            <button
              onClick={() => {
                setPortfolioForm({ id: null, title: '', description: '', techStack: '', clientName: '', liveUrl: '', imageUrl: '', completedDate: '' });
                setIsEditingPortfolio(true);
              }}
              className="btn-primary btn-sm"
            >
              <Plus size={14} /> Add Portfolio Project
            </button>
          </div>

          <div className="portfolio-admin-grid">
            {portfolio.map((port) => (
              <div key={port.id} className="portfolio-admin-card">
                <img src={port.imageUrl} alt={port.title} className="portfolio-admin-thumb" />
                <div className="portfolio-admin-info">
                  <h4>{port.title}</h4>
                  <p><strong>Client:</strong> {port.clientName} &bull; <strong>Completed:</strong> {port.completedDate}</p>
                  <p className="tech-stack-text"><strong>Stack:</strong> {port.techStack}</p>
                  <button
                    onClick={() => {
                      setPortfolioForm(port);
                      setIsEditingPortfolio(true);
                    }}
                    className="btn-secondary btn-sm mt-2"
                  >
                    Edit Case Study
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Orders Management */}
      {activeTab === 'orders' && (
        <div className="admin-orders-view">
          <div className="sub-header">
            <h2>Customer Orders & Fulfillment Control</h2>
            <p>Update delivery statuses and inspect calculated post-order arrival dates.</p>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Order Date</th>
                  <th>Estimated Delivery Date</th>
                  <th>Status</th>
                  <th>Change Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td><strong>#{o.id}</strong></td>
                    <td>
                      <div><strong>{o.user?.fullName}</strong></div>
                      <span className="text-muted text-xs">{o.user?.email}</span>
                    </td>
                    <td>{o.items?.length || 0} item(s)</td>
                    <td>${parseFloat(o.totalAmount).toFixed(2)}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className="text-indigo font-semibold">
                        {o.estimatedDeliveryDate ? new Date(o.estimatedDeliveryDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${o.orderStatus.toLowerCase()}`}>
                        {o.orderStatus}
                      </span>
                    </td>
                    <td>
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="status-dropdown"
                      >
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: User & Admin Authorization Management */}
      {activeTab === 'users' && (
        <div className="admin-users-view">
          <div className="sub-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2>User Authorization & Administration Hub</h2>
              <p>Create new administrator accounts, manage customer permissions, and toggle access states.</p>
            </div>
            <button
              onClick={() => {
                setUserFormFeedback(null);
                setIsUserModalOpen(true);
              }}
              className="btn-primary flex items-center gap-2"
              style={{ padding: '10px 20px', whiteSpace: 'nowrap' }}
            >
              <UserPlus size={16} /> Add Admin / User
            </button>
          </div>

          {/* User Filters & Stats */}
          <div className="catalog-toolbar mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="category-pills">
              <button
                className={`pill-btn ${userRoleFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setUserRoleFilter('ALL')}
              >
                All Accounts ({users.length})
              </button>
              <button
                className={`pill-btn ${userRoleFilter === 'ROLE_ADMIN' ? 'active' : ''}`}
                onClick={() => setUserRoleFilter('ROLE_ADMIN')}
              >
                👑 Administrators ({users.filter(u => u.role === 'ROLE_ADMIN').length})
              </button>
              <button
                className={`pill-btn ${userRoleFilter === 'ROLE_USER' ? 'active' : ''}`}
                onClick={() => setUserRoleFilter('ROLE_USER')}
              >
                👤 Normal Users ({users.filter(u => u.role === 'ROLE_USER').length})
              </button>
              <button
                className={`pill-btn ${userRoleFilter === 'ROLE_CLIENT' ? 'active' : ''}`}
                onClick={() => setUserRoleFilter('ROLE_CLIENT')}
              >
                💼 Partners ({users.filter(u => u.role === 'ROLE_CLIENT').length})
              </button>
            </div>

            <div className="search-bar-wrap" style={{ maxWidth: '320px' }}>
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th># ID</th>
                  <th>Username</th>
                  <th>Gmail / Email Address</th>
                  <th>Role / Access Level</th>
                  <th>Account Status</th>
                  <th>Phone / Contact</th>
                  <th>Registered Date</th>
                  <th style={{ textAlign: 'right' }}>Authorization Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
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
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: u.role === 'ROLE_ADMIN' 
                                  ? 'linear-gradient(135deg, #6366f1, #38bdf8)' 
                                  : 'linear-gradient(135deg, #10b981, #06b6d4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                color: '#fff',
                                fontSize: '0.85rem',
                                flexShrink: 0
                              }}
                            >
                              {u.fullName?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <strong style={{ display: 'block', color: 'var(--text-main, #fff)', fontSize: '0.92rem' }}>
                                {u.fullName}
                              </strong>
                              {isSelf && <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 600 }}>(You / Logged In)</span>}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-indigo-400" />
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                              {u.email}
                            </span>
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
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '999px',
                            background: u.active ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                            color: u.active ? '#10b981' : '#ef4444',
                            border: u.active ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)'
                          }}>
                            ● {u.active ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.phone || '—'}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleUserRole(u.id, u.role)}
                              disabled={isSelf}
                              className="btn-secondary btn-sm"
                              title={u.role === 'ROLE_ADMIN' ? 'Demote to Normal User' : 'Promote to Administrator'}
                              style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                            >
                              {u.role === 'ROLE_ADMIN' ? 'Switch to User' : '👑 Make Admin'}
                            </button>
                            <button
                              onClick={() => handleToggleUserStatus(u.id, u.active)}
                              disabled={isSelf}
                              className="btn-secondary btn-sm"
                              title={u.active ? 'Suspend Account' : 'Activate Account'}
                              style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                            >
                              {u.active ? 'Suspend' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id, u.email)}
                              disabled={isSelf}
                              className="btn-danger btn-sm"
                              title={isSelf ? 'Cannot delete own account' : 'Delete user'}
                              style={{ opacity: isSelf ? 0.35 : 1, padding: '5px 8px' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Edit / Add Product */}
      {isEditingProduct && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{productForm.id ? 'Edit Product' : 'Create New Product'}</h2>
              <button onClick={() => setIsEditingProduct(false)} className="close-btn">&times;</button>
            </div>

            <form onSubmit={handleSaveProduct} className="modal-form">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                  />
                </div>
              </div>

              {/* Set the date release product at user role */}
              <div className="form-group scheduled-release-box">
                <label className="text-indigo font-bold">
                  <Calendar size={15} /> Scheduled Release Date & Time for User Role:
                </label>
                <input
                  type="datetime-local"
                  value={productForm.releaseDate}
                  onChange={(e) => setProductForm({ ...productForm, releaseDate: e.target.value })}
                />
                <span className="help-text">
                  If set to a future date, users will see a live countdown until release. Leave blank for immediate release.
                </span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Country of Origin *</label>
                  <input
                    type="text"
                    required
                    value={productForm.originCountry}
                    onChange={(e) => setProductForm({ ...productForm, originCountry: e.target.value })}
                    placeholder="e.g. Germany, Japan"
                  />
                </div>

                <div className="form-group">
                  <label>Image URL *</label>
                  <input
                    type="url"
                    required
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Provenance & Sourcing Details *</label>
                <textarea
                  required
                  rows={2}
                  value={productForm.provenanceDetails}
                  onChange={(e) => setProductForm({ ...productForm, provenanceDetails: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  required
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setIsEditingProduct(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {productForm.id ? 'Update Product' : 'Create & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditingDeveloper && (
        <div className="modal-backdrop" onMouseDown={() => setIsEditingDeveloper(false)}>
          <div className="modal-content developer-edit-modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit team profile</h2>
              <button onClick={() => setIsEditingDeveloper(false)} className="close-btn" aria-label="Close">&times;</button>
            </div>
            <form onSubmit={handleSaveDeveloper} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input required value={developerForm.name} onChange={(e) => setDeveloperForm({ ...developerForm, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Card label *</label>
                  <input required value={developerForm.pill} onChange={(e) => setDeveloperForm({ ...developerForm, pill: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Role *</label>
                <input required value={developerForm.role} onChange={(e) => setDeveloperForm({ ...developerForm, role: e.target.value })} />
              </div>
              <div className="form-group">
                <label>3D badge role *</label>
                <input required value={developerForm.badgeRole} onChange={(e) => setDeveloperForm({ ...developerForm, badgeRole: e.target.value })} />
              </div>
              <DeveloperPhotoPicker value={developerForm.avatar} onChange={(avatar) => setDeveloperForm((profile) => ({ ...profile, avatar }))} />
              <div className="form-group">
                <label>Short bio *</label>
                <textarea required rows={3} value={developerForm.bio} onChange={(e) => setDeveloperForm({ ...developerForm, bio: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Skills (comma separated)</label>
                <textarea rows={2} value={developerForm.skills} onChange={(e) => setDeveloperForm({ ...developerForm, skills: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsEditingDeveloper(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Service */}
      {isEditingService && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{serviceForm.id ? 'Edit Service' : 'Add New Service'}</h2>
              <button onClick={() => setIsEditingService(false)} className="close-btn">&times;</button>
            </div>
            <form onSubmit={handleSaveService} className="modal-form">
              <div className="form-group">
                <label>Service Title *</label>
                <input
                  type="text"
                  required
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Summary *</label>
                <input
                  type="text"
                  required
                  value={serviceForm.summary}
                  onChange={(e) => setServiceForm({ ...serviceForm, summary: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  rows={3}
                  required
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsEditingService(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Portfolio */}
      {isEditingPortfolio && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{portfolioForm.id ? 'Edit Portfolio Project' : 'Add Portfolio Project'}</h2>
              <button onClick={() => setIsEditingPortfolio(false)} className="close-btn">&times;</button>
            </div>
            <form onSubmit={handleSavePortfolio} className="modal-form">
              <div className="form-group">
                <label>Project Title *</label>
                <input
                  type="text"
                  required
                  value={portfolioForm.title}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Client Name *</label>
                  <input
                    type="text"
                    required
                    value={portfolioForm.clientName}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, clientName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Completed Date *</label>
                  <input
                    type="date"
                    required
                    value={portfolioForm.completedDate}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, completedDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Tech Stack (Comma Separated) *</label>
                <input
                  type="text"
                  required
                  value={portfolioForm.techStack}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, techStack: e.target.value })}
                  placeholder="React, Spring Boot, PostgreSQL, AWS"
                />
              </div>
              <div className="form-group">
                <label>Image URL *</label>
                <input
                  type="url"
                  required
                  value={portfolioForm.imageUrl}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, imageUrl: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Live URL / Case Study Link</label>
                <input
                  type="url"
                  value={portfolioForm.liveUrl}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, liveUrl: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  rows={3}
                  required
                  value={portfolioForm.description}
                  onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsEditingPortfolio(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New User / Administrator */}
      {isUserModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <UserPlus size={20} className="text-indigo-400" />
                <h2>Create User or Administrator</h2>
              </div>
              <button onClick={() => setIsUserModalOpen(false)} className="close-btn">&times;</button>
            </div>

            {userFormFeedback && (
              <div className={`crud-feedback-banner ${userFormFeedback.type}`} style={{ margin: '0 24px 16px 24px' }}>
                {userFormFeedback.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                <span>{userFormFeedback.text}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="modal-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={newUserForm.fullName}
                  onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="admin.jane@nexus.com"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Password (Min 6 Characters) *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                />
              </div>

              {/* Role Selection Cards */}
              <div className="form-group">
                <label>Assign Account Role *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '6px' }}>
                  <div
                    onClick={() => setNewUserForm({ ...newUserForm, role: 'ROLE_ADMIN' })}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: newUserForm.role === 'ROLE_ADMIN' ? '2px solid #6366f1' : '1px solid var(--border-color)',
                      background: newUserForm.role === 'ROLE_ADMIN' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-card)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#818cf8', fontSize: '0.88rem' }}>
                      <ShieldCheck size={16} /> Administrator
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                      Full access to Admin Dashboard, Product CRUD, and user management.
                    </p>
                  </div>

                  <div
                    onClick={() => setNewUserForm({ ...newUserForm, role: 'ROLE_USER' })}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: newUserForm.role === 'ROLE_USER' ? '2px solid #10b981' : '1px solid var(--border-color)',
                      background: newUserForm.role === 'ROLE_USER' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#34d399', fontSize: '0.88rem' }}>
                      <Users size={16} /> Normal User
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                      Customer account with standard catalog browsing, cart, and orders.
                    </p>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+1 555-0199"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Address (Optional)</label>
                  <input
                    type="text"
                    placeholder="San Francisco, CA"
                    value={newUserForm.address}
                    onChange={(e) => setNewUserForm({ ...newUserForm, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="btn-secondary"
                  disabled={userFormSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={userFormSubmitting}
                >
                  {userFormSubmitting ? 'Creating...' : `Create ${newUserForm.role === 'ROLE_ADMIN' ? 'Administrator' : 'User'}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
