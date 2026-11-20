import React, { useState, useRef } from 'react';
import { ShieldCheck, CheckCircle2, Edit3, Upload, RotateCcw, X, Check, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

export const DEFAULT_HERO_IMG =
  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85';

const WeShopHeroComposition = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const isAdmin = Boolean(user && (user.role === 'admin' || user.isAdmin));

  const [imageLoaded, setImageLoaded] = useState(false);
  const [heroImage, setHeroImage] = useState(() => {
    return localStorage.getItem('weshop_hero_image') || DEFAULT_HERO_IMG;
  });

  // Admin edit modal state
  const [isEditing, setIsEditing] = useState(false);
  const [tempImage, setTempImage] = useState(heroImage);
  const [uploading, setUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleOpenEdit = () => {
    setTempImage(heroImage);
    setIsEditing(true);
  };

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
        setTempImage(res.data.imageUrl);
      }
    } catch {
      // Fallback to Base64 Data URL if backend is offline or sandbox
      const reader = new FileReader();
      reader.onload = () => {
        setTempImage(reader.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveImage = () => {
    if (!tempImage) return;
    setHeroImage(tempImage);
    localStorage.setItem('weshop_hero_image', tempImage);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 800);
  };

  const handleResetImage = () => {
    setTempImage(DEFAULT_HERO_IMG);
    setHeroImage(DEFAULT_HERO_IMG);
    localStorage.removeItem('weshop_hero_image');
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 800);
  };

  return (
    <div className="weshop-hero-visual-root">
      {/* Soft studio ambient background glow with blurred brand mark */}
      <div className="weshop-hero-ambient-glow" aria-hidden="true">
        <img
          src="/jomnenhkh-icon.jpg"
          onError={(e) => {
            if (e.currentTarget.src !== '/JomnenhKH.jpg') {
              e.currentTarget.src = '/JomnenhKH.jpg';
            }
          }}
          alt=""
          className="weshop-hero-glow-brand-icon"
        />
      </div>

      {/* Main Photographic Composition Container */}
      <div className="weshop-hero-stage">
        {/* Primary Photographic Product Display */}
        <div className="weshop-hero-photo-wrapper">
          <img
            src={heroImage}
            onError={(e) => {
              if (e.currentTarget.src !== DEFAULT_HERO_IMG) {
                e.currentTarget.src = DEFAULT_HERO_IMG;
              }
            }}
            onLoad={() => setImageLoaded(true)}
            alt="JomnenhKH-Shop commercial product arrangement featuring branded shipping box, cream tote bag, reusable green bottle, and folded apparel"
            className={`weshop-hero-product-img ${imageLoaded ? 'loaded' : ''}`}
          />

          {/* Natural contact ground shadow beneath the product group */}
          <div className="weshop-hero-ground-shadow" aria-hidden="true" />

          {/* Admin Edit Floating Badge */}
          {isAdmin && (
            <div className="weshop-hero-admin-trigger-box">
              <button
                type="button"
                className="weshop-hero-admin-edit-btn"
                onClick={handleOpenEdit}
                title="Admin: Edit / Upload Big Hero Image"
                aria-label="Edit Hero Image"
              >
                <Edit3 size={14} />
                <span>Edit Big Image</span>
              </button>
            </div>
          )}
        </div>

        {/* Floating Trust Verification Badge */}
        <div className="weshop-hero-floating-badge top-right">
          <div className="weshop-badge-icon-box">
            <ShieldCheck size={16} className="text-indigo-600 dark:text-cyan-400" />
          </div>
          <div className="weshop-badge-text-box">
            <span className="weshop-badge-label">{t('hero.badgeCertified')}</span>
            <span className="weshop-badge-sub">{t('hero.badgeInspected')}</span>
          </div>
        </div>

        {/* Floating Order / Dispatch Pill */}
        <div className="weshop-hero-floating-badge bottom-left">
          <div className="weshop-badge-icon-box bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-cyan-400">
            <CheckCircle2 size={16} />
          </div>
          <div className="weshop-badge-text-box">
            <span className="weshop-badge-label">{t('hero.badgeDirect')}</span>
            <span className="weshop-badge-sub">{t('hero.badgeWholesale')}</span>
          </div>
        </div>
      </div>

      {/* Admin Hero Image Edit Modal */}
      {isEditing && (
        <div className="weshop-hero-modal-backdrop" onClick={() => setIsEditing(false)}>
          <div className="weshop-hero-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="weshop-hero-modal-header">
              <div className="flex items-center gap-2">
                <ImageIcon size={18} className="text-indigo-600 dark:text-cyan-400" />
                <h3 className="weshop-hero-modal-title">Admin: Update Hero Product Image</h3>
              </div>
              <button
                type="button"
                className="weshop-hero-modal-close"
                onClick={() => setIsEditing(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="weshop-hero-modal-body">
              {/* Preview Box */}
              <div className="weshop-hero-preview-box">
                <img
                  src={tempImage || DEFAULT_HERO_IMG}
                  alt="Preview"
                  className="weshop-hero-modal-preview-img"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_HERO_IMG;
                  }}
                />
              </div>

              {/* Upload & URL Controls */}
              <div className="weshop-hero-modal-fields">
                <div className="weshop-modal-field">
                  <label className="weshop-modal-label">Upload New Image File (JPG, PNG, WebP)</label>
                  <div className="flex items-center gap-3">
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
                      <Upload size={15} />
                      <span>{uploading ? 'Uploading...' : 'Choose Image File...'}</span>
                    </button>
                  </div>
                </div>

                <div className="weshop-modal-field">
                  <label className="weshop-modal-label">Or Direct Image Web URL</label>
                  <input
                    type="url"
                    value={tempImage}
                    onChange={(e) => setTempImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="weshop-modal-input"
                  />
                </div>
              </div>
            </div>

            <div className="weshop-hero-modal-footer">
              <button
                type="button"
                className="weshop-hero-modal-reset-btn"
                onClick={handleResetImage}
                title="Reset to default commercial product image"
              >
                <RotateCcw size={14} />
                <span>Reset to Default</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="weshop-modal-cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="weshop-modal-save-btn"
                  onClick={handleSaveImage}
                >
                  {saveSuccess ? (
                    <>
                      <Check size={16} /> Saved!
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeShopHeroComposition;
