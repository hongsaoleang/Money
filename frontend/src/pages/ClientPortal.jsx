import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Package, Clock, CheckCircle2, XCircle, Globe, ShieldAlert, ArrowRight } from 'lucide-react';

const ClientPortal = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    stockQuantity: '',
    originCountry: '',
    provenanceDetails: '',
    imageUrl: '',
    description: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        api.get('/api/categories'),
        api.get('/api/client/products'),
      ]);
      setCategories(catRes.data);
      if (catRes.data.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: catRes.data[0].id }));
      }
      setMyProducts(prodRes.data);
    } catch (err) {
      console.error('Error fetching client data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      await api.post('/api/client/products', {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity, 10),
        categoryId: parseInt(formData.categoryId, 10),
      });

      setMessage({ type: 'success', text: 'Product submitted successfully! It is now pending admin review before deployment.' });
      setFormData({
        name: '',
        categoryId: categories[0]?.id || '',
        price: '',
        stockQuantity: '',
        originCountry: '',
        provenanceDetails: '',
        imageUrl: '',
        description: '',
      });
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit product.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="client-portal-page section-container">
      <div className="portal-header">
        <span className="section-badge">Client & Merchant Hub</span>
        <h1 className="page-title">Deploy Your Products on NexusTech</h1>
        <p className="page-desc">
          To maintain quality and origin traceability, all merchant products must be requested and approved by our administration before being deployed live to public customers.
        </p>
      </div>

      <div className="portal-grid">
        {/* Submission Form */}
        <div className="portal-form-card">
          <div className="card-header">
            <PlusCircle size={20} className="text-indigo" />
            <h3>Request Product Listing</h3>
          </div>

          {message && (
            <div className={`alert-${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="portal-form">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Apex Mechanical Keyboard"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Price (USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="149.99"
                />
              </div>

              <div className="form-group">
                <label>Initial Stock *</label>
                <input
                  type="number"
                  required
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  placeholder="50"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Country of Origin *</label>
                <input
                  type="text"
                  required
                  value={formData.originCountry}
                  onChange={(e) => setFormData({ ...formData, originCountry: e.target.value })}
                  placeholder="e.g. South Korea, Japan, Germany"
                />
              </div>

              <div className="form-group">
                <label>Product Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>
            </div>

            <div className="form-group">
              <label>Provenance & Manufacturing Details *</label>
              <textarea
                required
                rows={3}
                value={formData.provenanceDetails}
                onChange={(e) => setFormData({ ...formData, provenanceDetails: e.target.value })}
                placeholder="Detail materials, ethical audit certifications, and manufacturing facility where it's made..."
              />
            </div>

            <div className="form-group">
              <label>Product Description *</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Key technical specifications, warranty, and features..."
              />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Submitting Request...' : 'Submit for Admin Review'}
            </button>
          </form>
        </div>

        {/* Existing Submissions List */}
        <div className="portal-submissions-card">
          <div className="card-header">
            <Package size={20} className="text-indigo" />
            <h3>Your Product Deployment Requests</h3>
          </div>

          {loading ? (
            <div className="loading-spinner">Loading submissions...</div>
          ) : myProducts.length === 0 ? (
            <div className="empty-state">
              <p>You haven't submitted any products for deployment yet.</p>
            </div>
          ) : (
            <div className="submissions-list">
              {myProducts.map((prod) => (
                <div key={prod.id} className="submission-item">
                  <img src={prod.imageUrl} alt={prod.name} className="submission-thumb" />
                  <div className="submission-info">
                    <h4>{prod.name}</h4>
                    <p className="submission-price">${parseFloat(prod.price).toFixed(2)} &bull; Stock: {prod.stockQuantity}</p>
                    <span className="submission-origin"><Globe size={12} /> {prod.originCountry}</span>
                  </div>
                  <div className="submission-status">
                    {prod.status === 'PENDING_REVIEW' && (
                      <span className="badge badge-warning"><Clock size={13} /> Under Review</span>
                    )}
                    {prod.status === 'APPROVED' && (
                      <span className="badge badge-success"><CheckCircle2 size={13} /> Approved</span>
                    )}
                    {prod.status === 'REJECTED' && (
                      <span className="badge badge-danger"><XCircle size={13} /> Rejected</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;
