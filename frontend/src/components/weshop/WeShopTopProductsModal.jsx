import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Plus, Edit3, Trash2, Upload, RotateCcw, Check, 
  Package, DollarSign, Layers, Globe, Star
} from 'lucide-react';
import api from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';

const WeShopTopProductsModal = ({ 
  isOpen, 
  onClose, 
  products, 
  onSaveProduct, 
  onDeleteProduct, 
  onResetDefaults,
  editingProduct = null
}) => {
  const { language } = useLanguage();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'list'
  const [uploading, setUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'Developer Workstations',
    price: 99.99,
    stockQuantity: 20,
    rating: '4.90',
    originCountry: 'Verified Origin',
    description: '',
    imageUrl: '',
    isTopProduct: true,
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        id: editingProduct.id || `prod_${Date.now()}`,
        name: editingProduct.name || '',
        category: editingProduct.category || 'Developer Workstations',
        price: editingProduct.price || 99.99,
        stockQuantity: editingProduct.stockQuantity ?? 20,
        rating: editingProduct.rating || '4.90',
        originCountry: editingProduct.originCountry || 'Verified Origin',
        description: editingProduct.description || '',
        imageUrl: editingProduct.imageUrl || '',
        isTopProduct: true,
      });
      setActiveTab('edit');
    } else {
      setFormData({
        id: `prod_${Date.now()}`,
        name: '',
        category: 'Developer Workstations',
        price: 99.99,
        stockQuantity: 25,
        rating: '4.90',
        originCountry: 'Verified Origin',
        description: '',
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
        isTopProduct: true,
      });
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleImageFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5 MB');
      return;
    }

    setUploading(true);
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await api.post('/api/admin/products/image', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res?.data?.imageUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: res.data.imageUrl }));
      }
    } catch {
      // Fallback to Base64 Data URL if backend is offline or sandbox
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a product name');
      return;
    }

    const cleaned = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
    };

    onSaveProduct(cleaned);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <div className="weshop-hero-modal-backdrop" onClick={onClose}>
      <div 
        className="weshop-hero-modal-card weshop-top-products-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="weshop-hero-modal-header">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-indigo-600 dark:text-cyan-400" />
            <h3 className="weshop-hero-modal-title">
              {editingProduct
                ? language === 'KH' ? 'កែប្រែផលិតផលក្នុងស្តុក' : 'Admin: Edit In-Stock Product'
                : language === 'KH' ? 'បន្ថែមផលិតផលលេចធ្លោក្នុងស្តុក' : 'Admin: Add Top In-Stock Product'}
            </h3>
          </div>
          <button
            type="button"
            className="weshop-hero-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="weshop-modal-tabs-bar">
          <button
            type="button"
            className={`weshop-modal-tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            <Edit3 size={14} />
            <span>{editingProduct ? 'Edit Details' : 'New Product Form'}</span>
          </button>
          <button
            type="button"
            className={`weshop-modal-tab-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <Layers size={14} />
            <span>Manage All Top Products ({products.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="weshop-hero-modal-body">
          {activeTab === 'edit' ? (
            <form onSubmit={handleSubmit} className="weshop-modal-form-grid">
              {/* Image Preview & Upload */}
              <div className="weshop-top-prod-media-row">
                <div className="weshop-top-prod-preview-square">
                  <img
                    src={formData.imageUrl || 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'}
                    alt="Preview"
                    className="weshop-modal-preview-img"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label className="weshop-modal-label">Product Image (File or Web URL)</label>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileSelect}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      className="weshop-hero-upload-action-btn"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Upload size={14} />
                      <span>{uploading ? 'Uploading...' : 'Choose File...'}</span>
                    </button>
                  </div>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData((p) => ({ ...p, imageUrl: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="weshop-modal-input"
                  />
                </div>
              </div>

              {/* Name & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div className="weshop-modal-field">
                  <label className="weshop-modal-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. NovaPro Ultrabook M3"
                    className="weshop-modal-input"
                  />
                </div>
                <div className="weshop-modal-field">
                  <label className="weshop-modal-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                    className="weshop-modal-input"
                  >
                    <option value="Developer Workstations">Developer Workstations</option>
                    <option value="Audio & Acoustics">Audio & Acoustics</option>
                    <option value="Smart Devices">Smart Devices</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Apparel & Textiles">Apparel & Textiles</option>
                  </select>
                </div>
              </div>

              {/* Price & Stock Quantity */}
              <div className="grid grid-cols-3 gap-3">
                <div className="weshop-modal-field">
                  <label className="weshop-modal-label">Price ($ USD) *</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-400 font-semibold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                      className="weshop-modal-input pl-7"
                    />
                  </div>
                </div>

                <div className="weshop-modal-field">
                  <label className="weshop-modal-label">Stock Quantity (Units) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData((p) => ({ ...p, stockQuantity: e.target.value }))}
                    className="weshop-modal-input"
                  />
                </div>

                <div className="weshop-modal-field">
                  <label className="weshop-modal-label">Origin Country / Maker</label>
                  <input
                    type="text"
                    value={formData.originCountry}
                    onChange={(e) => setFormData((p) => ({ ...p, originCountry: e.target.value }))}
                    placeholder="e.g. Germany"
                    className="weshop-modal-input"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="weshop-modal-field">
                <label className="weshop-modal-label">Short Description & In-Stock Highlights</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Engineered for developers and creators. Ready for same-day delivery."
                  className="weshop-modal-input"
                />
              </div>

              <div className="weshop-modal-actions-right">
                <button
                  type="button"
                  className="weshop-modal-cancel-btn"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="weshop-modal-save-btn"
                >
                  {saveSuccess ? (
                    <>
                      <Check size={16} /> Saved!
                    </>
                  ) : (
                    editingProduct ? 'Update Product' : 'Add to Top Products'
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Tab: List of all Top In-Stock Products */
            <div className="weshop-modal-prod-list">
              <p className="text-xs text-slate-500 mb-3">
                These are the top in-stock products displayed on the homepage. You can edit any product or remove it.
              </p>
              <div className="space-y-2">
                {products.map((p) => (
                  <div key={p.id} className="weshop-modal-prod-item">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-12 h-12 rounded object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{p.name}</h4>
                      <p className="text-xs text-slate-500">
                        ${parseFloat(p.price).toFixed(2)} · <span className="text-emerald-600 font-medium">🟢 {p.stockQuantity} in stock</span> · {p.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-cyan-400"
                        onClick={() => {
                          setFormData(p);
                          setActiveTab('edit');
                        }}
                        title="Edit product"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        className="p-1.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600"
                        onClick={() => {
                          if (confirm(`Remove "${p.name}" from top products?`)) {
                            onDeleteProduct(p.id);
                          }
                        }}
                        title="Delete product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="weshop-hero-modal-footer">
          <button
            type="button"
            className="weshop-hero-modal-reset-btn"
            onClick={() => {
              if (confirm('Reset Top Products to original in-stock hardware catalog?')) {
                onResetDefaults();
                onClose();
              }
            }}
          >
            <RotateCcw size={14} />
            <span>Reset to Default Hardware</span>
          </button>

          <button
            type="button"
            className="text-xs text-indigo-600 dark:text-cyan-400 hover:underline font-semibold"
            onClick={() => {
              setFormData({
                id: `prod_${Date.now()}`,
                name: '',
                category: 'Developer Workstations',
                price: 99.99,
                stockQuantity: 25,
                rating: '4.90',
                originCountry: 'Verified Origin',
                description: '',
                imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
                isTopProduct: true,
              });
              setActiveTab('edit');
            }}
          >
            + Create Another Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeShopTopProductsModal;
