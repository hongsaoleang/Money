import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Package, Clock, CheckCircle, XCircle, Trash2, Edit3, Plus, 
  Layers, Users, ShoppingCart, DollarSign, MessageSquare, Calendar, Globe, AlertCircle 
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
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

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
      ] = await Promise.all([
        api.get('/api/admin/dashboard'),
        api.get('/api/admin/products'),
        api.get('/api/admin/products/pending'),
        api.get('/api/categories'),
        api.get('/api/services'),
        api.get('/api/portfolio'),
        api.get('/api/admin/orders'),
        api.get('/api/inquiries'),
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
    } catch (err) {
      console.error('Error loading admin data', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="section-container text-center">
        <h2>Access Denied</h2>
        <p>You must have the Administrator role to access this control center.</p>
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
        <div className="admin-actions">
          <button
            onClick={() => {
              resetProductForm();
              setIsEditingProduct(true);
            }}
            className="btn-primary"
          >
            <Plus size={16} /> New Product & Schedule
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

            <div className="kpi-card">
              <div className="kpi-icon inquiries"><MessageSquare size={24} /></div>
              <div>
                <span className="kpi-title">Software Inquiries</span>
                <h3 className="kpi-value">{stats.totalInquiries}</h3>
              </div>
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
                          <span className="table-vendor">Vendor: {p.vendor?.fullName || 'NexusTech Direct'}</span>
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
    </div>
  );
};

export default Admin;
