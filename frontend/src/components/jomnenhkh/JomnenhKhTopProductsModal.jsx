import React, { useState, useRef } from 'react';
import { 
  X, Edit3, Trash2, Upload, RotateCcw, Check, 
  Package, Layers, Link as LinkIcon, Box, Globe, Plus
} from 'lucide-react';
import api from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';

const JomnenhKhTopProductsModal = ({ 
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

  const [prevEditingProduct, setPrevEditingProduct] = useState(editingProduct);
  if (editingProduct !== prevEditingProduct) {
    setPrevEditingProduct(editingProduct);
    if (editingProduct) {
      setFormData({
        id: editingProduct.id || '',
        name: editingProduct.name || '',
        category: editingProduct.category || 'Developer Workstations',
        price: editingProduct.price ?? 99.99,
        stockQuantity: editingProduct.stockQuantity ?? 20,
        rating: editingProduct.rating || '4.90',
        originCountry: editingProduct.originCountry || 'Verified Origin',
        description: editingProduct.description || '',
        imageUrl: editingProduct.imageUrl || '',
        isTopProduct: true,
      });
      setActiveTab('edit');
    }
  }

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
      id: formData.id || `prod_${Date.now()}`,
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
    <div className="jomnenhkh-hero-modal-backdrop weshop-hero-modal-backdrop" onClick={onClose}>
      <div 
        className="jomnenhkh-hero-modal-card weshop-hero-modal-card jomnenhkh-top-products-modal weshop-top-products-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="jomnenhkh-hero-modal-header weshop-hero-modal-header">
          <div className="flex items-center gap-3.5">
            <div className="jomnenhkh-modal-header-badge">
              <Package size={22} />
            </div>
            <div>
              <h3 className="jomnenhkh-hero-modal-title weshop-hero-modal-title">
                {editingProduct
                  ? language === 'KH' ? 'កែប្រែផលិតផលក្នុងស្តុក' : 'Admin: Edit In-Stock Product'
                  : language === 'KH' ? 'បន្ថែមផលិតផលលេចធ្លោក្នុងស្តុក' : 'Admin: Add Top In-Stock Product'}
              </h3>
              <p className="jomnenhkh-modal-subtitle">
                {language === 'KH' 
                  ? 'គ្រប់គ្រងទំនិញក្នុងស្តុកដែលត្រូវបង្ហាញលើទំព័រដើម' 
                  : 'Configure items featured in homepage Active Warehouse Inventory'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="jomnenhkh-hero-modal-close weshop-hero-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modern Tab Switcher */}
        <div className="jomnenhkh-modal-tabs-bar weshop-modal-tabs-bar">
          <button
            type="button"
            className={`jomnenhkh-modal-tab-btn weshop-modal-tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit')}
          >
            <Edit3 size={15} />
            <span>{editingProduct ? 'Edit Details' : 'New Product Form'}</span>
          </button>
          <button
            type="button"
            className={`jomnenhkh-modal-tab-btn weshop-modal-tab-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            <Layers size={15} />
            <span>Manage All Top Products</span>
            <span className="jomnenhkh-modal-tab-count">{products.length}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="jomnenhkh-hero-modal-body weshop-hero-modal-body">
          {activeTab === 'edit' ? (
            <form onSubmit={handleSubmit} className="jomnenhkh-modal-form-grid weshop-modal-form-grid">
              {/* Media Section: Image Preview & Upload */}
              <div className="jomnenhkh-top-prod-media-row weshop-top-prod-media-row">
                <div className="jomnenhkh-top-prod-preview-square weshop-top-prod-preview-square">
                  <img
                    src={formData.imageUrl || 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'}
                    alt="Preview"
                    className="jomnenhkh-modal-preview-img weshop-modal-preview-img"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <span className="jomnenhkh-preview-badge">Preview</span>
                </div>

                <div className="flex-1 flex flex-col gap-3.5 w-full">
                  <div className="flex items-center justify-between mb-1">
                    <label className="jomnenhkh-modal-label weshop-modal-label">
                      Product Image (File or Web URL)
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">JPG, PNG, WebP (Max 5MB)</span>
                  </div>

                  <div className="flex items-center gap-3 mb-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileSelect}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      className="jomnenhkh-hero-upload-action-btn weshop-hero-upload-action-btn"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Upload size={14} />
                      <span>{uploading ? 'Uploading...' : 'Choose File...'}</span>
                    </button>
                  </div>

                  <div className="jomnenhkh-input-group">
                    <div className="jomnenhkh-input-addon prefix">
                      <LinkIcon size={14} />
                    </div>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData((p) => ({ ...p, imageUrl: e.target.value }))}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="jomnenhkh-input-addon-field"
                    />
                  </div>
                </div>
              </div>

              {/* Product Essentials: Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="jomnenhkh-modal-field weshop-modal-field">
                  <label className="jomnenhkh-modal-label weshop-modal-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. NovaPro Ultrabook M3"
                    className="jomnenhkh-modal-input weshop-modal-input"
                  />
                </div>
                <div className="jomnenhkh-modal-field weshop-modal-field">
                  <label className="jomnenhkh-modal-label weshop-modal-label">Category</label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                    className="jomnenhkh-modal-input weshop-modal-input"
                  >
                    <option value="">-- No Category / General --</option>
                  </select>
                </div>
              </div>

              {/* Inventory & Pricing: Price, Stock Quantity & Origin Country */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="jomnenhkh-modal-field weshop-modal-field">
                  <label className="jomnenhkh-modal-label weshop-modal-label">Price ($ USD) *</label>
                  <div className="jomnenhkh-input-group">
                    <div className="jomnenhkh-input-addon prefix font-bold">$</div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                      placeholder="99.99"
                      className="jomnenhkh-input-addon-field"
                    />
                    <div className="jomnenhkh-input-addon suffix">USD</div>
                  </div>
                </div>

                <div className="jomnenhkh-modal-field weshop-modal-field">
                  <label className="jomnenhkh-modal-label weshop-modal-label">Stock Quantity (Units) *</label>
                  <div className="jomnenhkh-input-group">
                    <div className="jomnenhkh-input-addon prefix">
                      <Box size={14} />
                    </div>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData((p) => ({ ...p, stockQuantity: e.target.value }))}
                      placeholder="25"
                      className="jomnenhkh-input-addon-field"
                    />
                    <div className="jomnenhkh-input-addon suffix">units</div>
                  </div>
                </div>

                <div className="jomnenhkh-modal-field weshop-modal-field">
                  <label className="jomnenhkh-modal-label weshop-modal-label">Origin Country / Maker</label>
                  <div className="jomnenhkh-input-group">
                    <div className="jomnenhkh-input-addon prefix">
                      <Globe size={14} />
                    </div>
                    <input
                      type="text"
                      value={formData.originCountry}
                      onChange={(e) => setFormData((p) => ({ ...p, originCountry: e.target.value }))}
                      placeholder="e.g. Germany"
                      className="jomnenhkh-input-addon-field"
                    />
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div className="jomnenhkh-modal-field weshop-modal-field">
                <label className="jomnenhkh-modal-label weshop-modal-label">Short Description & In-Stock Highlights</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Engineered for developers and creators. Ready for same-day delivery."
                  className="jomnenhkh-modal-input weshop-modal-input"
                />
              </div>

              {/* Action Buttons */}
              <div className="jomnenhkh-modal-actions-right weshop-modal-actions-right">
                <button
                  type="button"
                  className="jomnenhkh-modal-cancel-btn weshop-modal-cancel-btn"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`jomnenhkh-modal-save-btn weshop-modal-save-btn ${saveSuccess ? 'saved' : ''}`}
                >
                  {saveSuccess ? (
                    <>
                      <Check size={16} /> Saved Successfully!
                    </>
                  ) : (
                    editingProduct ? 'Update Product' : 'Add to Top Products'
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Tab: List of all Top In-Stock Products */
            <div className="jomnenhkh-modal-prod-list weshop-modal-prod-list">
              <p className="text-xs text-slate-500 mb-4 font-medium">
                These are the top in-stock products displayed on the homepage. You can edit any product or remove it.
              </p>
              <div className="space-y-3.5">
                {products.map((p) => (
                  <div key={p.id} className="jomnenhkh-modal-prod-item weshop-modal-prod-item">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm truncate text-slate-900 dark:text-slate-100">{p.name}</h4>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {p.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-extrabold text-slate-900 dark:text-slate-100">${parseFloat(p.price).toFixed(2)}</span>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">🟢 {p.stockQuantity} in stock</span>
                        <span>•</span>
                        <span>{p.originCountry || 'Verified'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        className="p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-indigo-600 dark:text-cyan-400 transition-colors"
                        onClick={() => {
                          setFormData(p);
                          setActiveTab('edit');
                        }}
                        title="Edit product"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 transition-colors"
                        onClick={() => {
                          if (confirm(`Remove "${p.name}" from top products?`)) {
                            onDeleteProduct(p.id);
                          }
                        }}
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="jomnenhkh-hero-modal-footer weshop-hero-modal-footer">
          <button
            type="button"
            className="jomnenhkh-hero-modal-reset-btn weshop-hero-modal-reset-btn"
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
            className="inline-flex items-center gap-2 text-xs text-indigo-600 dark:text-cyan-400 hover:underline font-bold py-1.5 px-3.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
            onClick={() => {
              setFormData({
                id: '',
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
            <Plus size={15} />
            <span>Create Another Product</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JomnenhKhTopProductsModal;
