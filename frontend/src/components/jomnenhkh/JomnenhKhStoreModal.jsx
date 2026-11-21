import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Star, MapPin, ShieldCheck, Package,
  Clock, Award, Upload, Trash2, Plus, Edit3, Shield,
  Home, Shirt, Leaf, Armchair, Coffee, Store, Check
} from 'lucide-react';
import api from '../../api/client';
import JomnenhKhPrimaryButton from './JomnenhKhPrimaryButton';
import { useLanguage } from '../../context/LanguageContext';

const ICON_MAP = {
  Home,
  Shirt,
  Leaf,
  Armchair,
  Coffee,
  Package,
  Store,
};

const JomnenhKhStoreModal = ({ 
  store, 
  isOpen, 
  onClose, 
  isAdmin, 
  onSave, 
  onDelete, 
  initialEditMode = false 
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savedNotice, setSavedNotice] = useState('');

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '',
    countNum: '',
    productsCount: '',
    rating: '4.88',
    location: 'Berlin, Germany',
    image: '',
    imageAlt: '',
    description: '',
    leadTime: '2–4 Days',
    positiveReviews: '99.4%',
    lowMoq: '5 Units Min',
    iconName: 'Leaf',
    samples: [],
  });

  useEffect(() => {
    if (store) {
      setFormData({
        id: store.id || `store_${Date.now()}`,
        name: store.name || '',
        category: store.category || 'Workspace',
        countNum: store.countNum || '76',
        productsCount: store.productsCount || `${store.countNum || 76} products`,
        rating: store.rating || '4.88',
        location: store.location || 'Berlin, Germany',
        image: store.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        imageAlt: store.imageAlt || store.name || '',
        description: store.description || 'Ergonomic workspace accessories, walnut laptop risers, desk pads, and biophilic office accents engineered for peak focus.',
        leadTime: store.leadTime || '2–4 Days',
        positiveReviews: store.positiveReviews || '99.4%',
        lowMoq: store.lowMoq || '5 Units Min',
        iconName: store.iconName || 'Leaf',
        samples: store.samples && store.samples.length > 0 ? store.samples.map(s => ({ ...s })) : [
          { name: 'Solid Walnut Laptop Stand', price: '$52.00' },
          { name: 'Felt Desk Mat (Large)', price: '$30.00' },
          { name: 'Magnetic Cable Hub', price: '$18.00' },
        ],
      });
      setIsEditing(Boolean(initialEditMode && isAdmin));
      setSavedNotice('');
    }
  }, [store, initialEditMode, isAdmin]);

  if (!isOpen || !store) return null;

  const IconComponent = (formData.iconName && ICON_MAP[formData.iconName]) || store.icon || Store;

  const handleBrowseStoreProducts = () => {
    onClose();
    navigate(`/products?category=${encodeURIComponent(formData.category || formData.name)}`);
  };

  const handleImageFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Please choose an image under 5 MB');
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
        setFormData((prev) => ({ ...prev, image: res.data.imageUrl }));
      }
    } catch {
      // Fallback to Base64 Data URL if backend is offline or mock
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSampleChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.samples];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, samples: updated };
    });
  };

  const handleAddSample = () => {
    setFormData((prev) => ({
      ...prev,
      samples: [...prev.samples, { name: 'New Sample Item', price: '$25.00' }],
    }));
  };

  const handleRemoveSample = (index) => {
    setFormData((prev) => ({
      ...prev,
      samples: prev.samples.filter((_, idx) => idx !== index),
    }));
  };

  const handleSaveForm = (e) => {
    e?.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a store name.');
      return;
    }

    const payload = {
      ...formData,
      productsCount: `${formData.countNum || 0} products`,
    };

    onSave && onSave(payload);
    setSavedNotice('Store details updated successfully!');
    setTimeout(() => {
      setSavedNotice('');
      setIsEditing(false);
    }, 900);
  };

  const handleDeleteStore = () => {
    if (window.confirm(`Are you sure you want to delete "${formData.name}"? This action cannot be undone.`)) {
      onDelete && onDelete(formData.id);
      onClose();
    }
  };

  return (
    <div className="jomnenhkh-modal-backdrop weshop-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="jomnenhkh-modal-panel weshop-modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="jomnenhkh-modal-close-btn weshop-modal-close-btn"
          onClick={onClose}
          aria-label="Close store dialog"
        >
          <X size={18} />
        </button>

        {/* ADMIN EDIT MODE */}
        {isEditing && isAdmin ? (
          <form onSubmit={handleSaveForm} className="jomnenhkh-edit-form weshop-edit-form">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-indigo-600 dark:text-cyan-400" />
                <h3 className="font-bold text-lg text-main">
                  {store.isNew ? 'Create New Store' : `Edit Store: ${formData.name}`}
                </h3>
              </div>
              <span className="jomnenhkh-modal-admin-badge weshop-modal-admin-badge">Admin Edit Only</span>
            </div>

            {/* 1. Store Image Upload / Management */}
            <div className="jomnenhkh-image-upload-box weshop-image-upload-box">
              <span className="jomnenhkh-form-label weshop-form-label">Store Cover Image</span>
              <div className="jomnenhkh-image-preview-row weshop-image-preview-row">
                <img
                  src={formData.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80'}
                  alt={formData.name}
                  className="jomnenhkh-image-preview-thumb weshop-image-preview-thumb"
                />
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageFileSelect}
                  />
                  <div className="jomnenhkh-upload-btns-row weshop-upload-btns-row">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="jomnenhkh-admin-pill-btn weshop-admin-pill-btn primary"
                    >
                      <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload New Image'}
                    </button>
                    {formData.image && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                        className="jomnenhkh-admin-pill-btn weshop-admin-pill-btn"
                        style={{ color: '#ef4444' }}
                      >
                        <Trash2 size={13} /> Clear
                      </button>
                    )}
                  </div>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Or paste external image URL..."
                      value={formData.image}
                      onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                      className="jomnenhkh-form-input weshop-form-input text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Store Basics */}
            <div className="jomnenhkh-form-grid-2 weshop-form-grid-2">
              <div className="jomnenhkh-form-group weshop-form-group">
                <label className="jomnenhkh-form-label weshop-form-label">Store Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="jomnenhkh-form-input weshop-form-input"
                  placeholder="e.g. OfficePro"
                />
              </div>

              <div className="jomnenhkh-form-group weshop-form-group">
                <label className="jomnenhkh-form-label weshop-form-label">Category</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="jomnenhkh-form-input weshop-form-input"
                  placeholder="e.g. Workspace, Apparel, Home Decor"
                />
              </div>
            </div>

            <div className="jomnenhkh-form-grid-3 weshop-form-grid-3">
              <div className="jomnenhkh-form-group weshop-form-group">
                <label className="jomnenhkh-form-label weshop-form-label">Products Count</label>
                <input
                  type="text"
                  value={formData.countNum}
                  onChange={(e) => setFormData((prev) => ({ ...prev, countNum: e.target.value }))}
                  className="jomnenhkh-form-input weshop-form-input"
                  placeholder="e.g. 76"
                />
              </div>

              <div className="jomnenhkh-form-group weshop-form-group">
                <label className="jomnenhkh-form-label weshop-form-label">Rating</label>
                <input
                  type="text"
                  value={formData.rating}
                  onChange={(e) => setFormData((prev) => ({ ...prev, rating: e.target.value }))}
                  className="jomnenhkh-form-input weshop-form-input"
                  placeholder="e.g. 4.88"
                />
              </div>

              <div className="jomnenhkh-form-group weshop-form-group">
                <label className="jomnenhkh-form-label weshop-form-label">Icon</label>
                <select
                  value={formData.iconName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, iconName: e.target.value }))}
                  className="jomnenhkh-form-select weshop-form-select"
                >
                  <option value="Leaf">Leaf (Workspace)</option>
                  <option value="Home">Home (Home Decor)</option>
                  <option value="Shirt">Shirt (Apparel)</option>
                  <option value="Armchair">Armchair (Living)</option>
                  <option value="Coffee">Coffee (Tableware)</option>
                  <option value="Package">Package (Supply)</option>
                  <option value="Store">Store (General)</option>
                </select>
              </div>
            </div>

            <div className="jomnenhkh-form-group weshop-form-group">
              <label className="jomnenhkh-form-label weshop-form-label">Location / Origin</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                className="jomnenhkh-form-input weshop-form-input"
                placeholder="e.g. Berlin, Germany"
              />
            </div>

            {/* 3. About This Supplier */}
            <div className="jomnenhkh-form-group weshop-form-group">
              <label className="jomnenhkh-form-label weshop-form-label">About This Supplier</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="jomnenhkh-form-textarea weshop-form-textarea"
                placeholder="Describe the supplier, materials, and production philosophy..."
              />
            </div>

            {/* 4. Supplier Metrics */}
            <div className="jomnenhkh-form-grid-3 weshop-form-grid-3">
              <div className="jomnenhkh-form-group weshop-form-group">
                <label className="jomnenhkh-form-label weshop-form-label">Lead Time</label>
                <input
                  type="text"
                  value={formData.leadTime}
                  onChange={(e) => setFormData((prev) => ({ ...prev, leadTime: e.target.value }))}
                  className="jomnenhkh-form-input weshop-form-input"
                  placeholder="e.g. 2–4 Days"
                />
              </div>

              <div className="jomnenhkh-form-group weshop-form-group">
                <label className="jomnenhkh-form-label weshop-form-label">Positive Reviews</label>
                <input
                  type="text"
                  value={formData.positiveReviews}
                  onChange={(e) => setFormData((prev) => ({ ...prev, positiveReviews: e.target.value }))}
                  className="jomnenhkh-form-input weshop-form-input"
                  placeholder="e.g. 99.4%"
                />
              </div>

              <div className="jomnenhkh-form-group weshop-form-group">
                <label className="jomnenhkh-form-label weshop-form-label">Low MOQ</label>
                <input
                  type="text"
                  value={formData.lowMoq}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lowMoq: e.target.value }))}
                  className="jomnenhkh-form-input weshop-form-input"
                  placeholder="e.g. 5 Units Min"
                />
              </div>
            </div>

            {/* 5. Popular Items List */}
            <div className="jomnenhkh-form-group weshop-form-group">
              <div className="flex items-center justify-between">
                <label className="jomnenhkh-form-label weshop-form-label">Popular Items ({formData.samples.length})</label>
                <button
                  type="button"
                  onClick={handleAddSample}
                  className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 flex items-center gap-1 hover:underline"
                >
                  <Plus size={13} /> Add Item
                </button>
              </div>

              <div className="jomnenhkh-items-editor weshop-items-editor">
                {formData.samples.map((item, idx) => (
                  <div key={idx} className="jomnenhkh-item-row weshop-item-row">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleSampleChange(idx, 'name', e.target.value)}
                      placeholder="Item name"
                      className="jomnenhkh-form-input weshop-form-input"
                      style={{ flex: 2 }}
                    />
                    <input
                      type="text"
                      value={item.price}
                      onChange={(e) => handleSampleChange(idx, 'price', e.target.value)}
                      placeholder="Price"
                      className="jomnenhkh-form-input weshop-form-input"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSample(idx)}
                      className="jomnenhkh-item-del-btn weshop-item-del-btn"
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {savedNotice && (
              <div className="text-emerald text-sm font-semibold flex items-center gap-1.5 py-1">
                <Check size={16} /> {savedNotice}
              </div>
            )}

            {/* Modal Edit Footer Actions */}
            <div className="pt-3 border-t border-border flex items-center justify-between gap-3 mt-2">
              {!store.isNew && (
                <button
                  type="button"
                  onClick={handleDeleteStore}
                  className="jomnenhkh-admin-pill-btn weshop-admin-pill-btn"
                  style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                >
                  <Trash2 size={14} /> Delete Store
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (store.isNew) onClose();
                    else setIsEditing(false);
                  }}
                  className="jomnenhkh-admin-pill-btn weshop-admin-pill-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="jomnenhkh-admin-pill-btn weshop-admin-pill-btn primary"
                >
                  <Check size={14} /> Save Changes
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* VIEW MODE (Standard Customer View) */
          <>
            {/* Modal Header Banner */}
            <div className="jomnenhkh-modal-banner-wrap weshop-modal-banner-wrap">
              <img
                src={formData.image}
                alt={formData.name}
                className="jomnenhkh-modal-banner-img weshop-modal-banner-img"
              />
              <div className="jomnenhkh-modal-banner-overlay weshop-modal-banner-overlay" />
              <div className="jomnenhkh-modal-header-content weshop-modal-header-content">
                <div className="jomnenhkh-modal-icon-badge weshop-modal-icon-badge">
                  {IconComponent && <IconComponent size={24} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="jomnenhkh-modal-title weshop-modal-title">{formData.name}</h2>
                    <span className="jomnenhkh-modal-verified-badge weshop-modal-verified-badge">
                      <ShieldCheck size={14} /> {t('modal.verifiedMaker')}
                    </span>
                    {isAdmin && (
                      <span className="jomnenhkh-modal-admin-badge weshop-modal-admin-badge ml-1">Admin Access</span>
                    )}
                  </div>
                  <p className="jomnenhkh-modal-sub-info weshop-modal-sub-info">
                    <span>{formData.productsCount || `${formData.countNum} products`}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Star size={13} fill="currentColor" /> {formData.rating}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={13} /> {formData.location}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="jomnenhkh-modal-body weshop-modal-body">
              <div className="jomnenhkh-modal-section weshop-modal-section">
                <h4 className="jomnenhkh-modal-section-title weshop-modal-section-title">{t('modal.aboutSupplier')}</h4>
                <p className="jomnenhkh-modal-description weshop-modal-description">
                  {formData.description}
                </p>
              </div>

              {/* Supplier Highlights */}
              <div className="jomnenhkh-modal-metrics-grid weshop-modal-metrics-grid">
                <div className="jomnenhkh-modal-metric-card weshop-modal-metric-card">
                  <Clock size={16} className="text-indigo-600 dark:text-cyan-400" />
                  <div>
                    <span className="metric-val">{formData.leadTime}</span>
                    <span className="metric-lbl">{t('modal.leadTime')}</span>
                  </div>
                </div>
                <div className="jomnenhkh-modal-metric-card weshop-modal-metric-card">
                  <Award size={16} className="text-indigo-600 dark:text-cyan-400" />
                  <div>
                    <span className="metric-val">{formData.positiveReviews}</span>
                    <span className="metric-lbl">{t('modal.positiveReviews')}</span>
                  </div>
                </div>
                <div className="jomnenhkh-modal-metric-card weshop-modal-metric-card">
                  <Package size={16} className="text-indigo-600 dark:text-cyan-400" />
                  <div>
                    <span className="metric-val">{formData.lowMoq}</span>
                    <span className="metric-lbl">{t('modal.lowMoq')}</span>
                  </div>
                </div>
              </div>

              {/* Sample Products */}
              <div className="jomnenhkh-modal-section weshop-modal-section">
                <h4 className="jomnenhkh-modal-section-title weshop-modal-section-title">{t('modal.popularItems')} {formData.name}</h4>
                <div className="jomnenhkh-modal-samples-row weshop-modal-samples-row">
                  {formData.samples && formData.samples.length > 0 ? (
                    formData.samples.map((sample, idx) => (
                      <div key={idx} className="jomnenhkh-sample-pill weshop-sample-pill">
                        <span className="sample-name">{sample.name}</span>
                        <span className="sample-price">{sample.price}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-neutral-500">
                      Multiple collections available for immediate wholesale order.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="jomnenhkh-modal-footer weshop-modal-footer">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="jomnenhkh-admin-pill-btn weshop-admin-pill-btn mr-auto"
                  title="Edit supplier details and photo"
                >
                  <Edit3 size={14} /> Edit Store (Admin)
                </button>
              )}

              <JomnenhKhPrimaryButton
                variant="outline"
                size="md"
                onClick={onClose}
              >
                {t('modal.close')}
              </JomnenhKhPrimaryButton>

              <JomnenhKhPrimaryButton
                variant="primary"
                size="md"
                arrow={true}
                onClick={handleBrowseStoreProducts}
              >
                {t('modal.exploreStore')}
              </JomnenhKhPrimaryButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default JomnenhKhStoreModal;
