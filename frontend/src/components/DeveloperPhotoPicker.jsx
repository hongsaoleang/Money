import React, { useState, useRef } from 'react';
import { Upload, Check, LoaderCircle, Sparkles, FileImage, Trash2, ShieldCheck } from 'lucide-react';
import api from '../api/client';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

export const PRESET_DATA_PHOTOS = [
  {
    id: 'jomnenh',
    name: 'Hong Saoleang',
    tag: 'Founder & Lead',
    src: '/JomnenhKH.jpg',
  },
  {
    id: 'alex',
    name: 'Alex Rivera',
    tag: 'Frontend Lead',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'devon',
    name: 'Devon Vance',
    tag: 'Database & Cloud',
    src: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'architect',
    name: 'System Architect',
    tag: 'Core & Security',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'devops',
    name: 'DevOps Specialist',
    tag: 'CI/CD & Infra',
    src: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'ai-specialist',
    name: 'AI Engineer',
    tag: 'Algorithms & Models',
    src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
];

const DeveloperPhotoPicker = ({ value, onChange }) => {
  const [preview, setPreview] = useState(value || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [fileMeta, setFileMeta] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const currentPhoto = preview || value;

  const processFileData = (file) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Choose a JPG, PNG, WebP, or GIF image file.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError('Choose an image smaller than 10 MB.');
      return;
    }

    setError('');
    const fileSizeKB = Math.round(file.size / 1024);
    setFileMeta(`${file.name} (${fileSizeKB} KB · Local Data)`);

    // 1. Instantly read as Base64 Data URL so photo works immediately offline/locally
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setPreview(dataUrl);
      onChange(dataUrl);
    };
    reader.readAsDataURL(file);

    // 2. Also attempt upload to backend server storage in background
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    api.post('/api/admin/developers/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(({ data }) => {
      if (data && data.avatar) {
        setPreview(data.avatar);
        onChange(data.avatar);
        setFileMeta(`${file.name} (Saved to Server)`);
      }
    }).catch((err) => {
      // Backend upload failure is gracefully handled; local Data URL is already active!
      console.warn('Server upload skipped or offline; using local image data:', err);
    }).finally(() => {
      setUploading(false);
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) processFileData(file);
  };

  const handleSelectPreset = (preset) => {
    setError('');
    setPreview(preset.src);
    setFileMeta(`Preset: ${preset.name} (${preset.tag})`);
    onChange(preset.src);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFileData(file);
  };

  const handleClearPhoto = () => {
    setPreview('/JomnenhKH.jpg');
    setFileMeta('Reset to default Jomnenh KH photo');
    onChange('/JomnenhKH.jpg');
    setError('');
  };

  // Determine current source type
  const isDataUrl = currentPhoto && currentPhoto.startsWith('data:');
  const isPresetMatch = PRESET_DATA_PHOTOS.some((p) => p.src === currentPhoto);

  return (
    <div className="developer-photo-section">
      <div className="developer-photo-header">
        <label className="developer-photo-label">Choose Developer Photo from Data</label>
        <span className="developer-photo-badge">
          {isDataUrl ? 'Local File Data' : isPresetMatch ? 'Data Preset' : 'Active Photo'}
        </span>
      </div>

      {/* Main Dropzone & Upload from Device Data */}
      <div 
        className={`developer-photo-dropzone ${isDragging ? 'is-dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="developer-photo-preview-wrapper">
          <div className="developer-photo-avatar-box">
            {currentPhoto ? (
              <img 
                src={currentPhoto} 
                alt="Selected profile" 
                className="developer-photo-img" 
                style={currentPhoto.includes('JomnenhKH') ? { objectFit: 'contain', background: '#0a0f1d' } : { objectFit: 'cover' }}
              />
            ) : (
              <FileImage size={32} className="developer-photo-placeholder-icon" />
            )}
            {uploading && (
              <div className="developer-photo-loading-overlay">
                <LoaderCircle size={24} className="developer-photo-spinner" />
              </div>
            )}
          </div>
        </div>

        <div className="developer-photo-controls">
          <div className="developer-photo-actions-row">
            <button
              type="button"
              className="developer-photo-btn-primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <LoaderCircle size={16} className="developer-photo-spinner" /> : <Upload size={16} />}
              <span>Choose Photo from Device Data</span>
            </button>

            {currentPhoto && currentPhoto !== '/JomnenhKH.jpg' && (
              <button
                type="button"
                className="developer-photo-btn-clear"
                onClick={handleClearPhoto}
                title="Reset to default logo photo"
              >
                <Trash2 size={15} />
                <span>Reset</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>

          <p className="developer-photo-meta-text">
            {fileMeta || 'Choose an image file from your device, or drag & drop here. Loaded directly as image data.'}
          </p>
        </div>
      </div>

      {error && <p className="developer-photo-error" role="alert">{error}</p>}

      {/* Preset Data Photos Gallery */}
      <div className="developer-photo-presets-block">
        <div className="developer-photo-presets-title">
          <Sparkles size={14} className="developer-presets-icon" />
          <span>Or Choose from Preset Data Photos</span>
        </div>

        <div className="developer-photo-presets-grid">
          {PRESET_DATA_PHOTOS.map((preset) => {
            const isSelected = currentPhoto === preset.src;
            return (
              <button
                key={preset.id}
                type="button"
                className={`developer-preset-card ${isSelected ? 'is-selected' : ''}`}
                onClick={() => handleSelectPreset(preset)}
                title={`${preset.name} - ${preset.tag}`}
              >
                <div className="developer-preset-thumb-wrapper">
                  <img
                    src={preset.src}
                    alt={preset.name}
                    className="developer-preset-thumb"
                    style={preset.src.includes('JomnenhKH') ? { objectFit: 'contain', background: '#0a0f1d' } : { objectFit: 'cover' }}
                  />
                  {isSelected && (
                    <span className="developer-preset-selected-check" title="Active">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                </div>
                <div className="developer-preset-info">
                  <span className="developer-preset-name">{preset.name}</span>
                  <span className="developer-preset-tag">{preset.tag}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DeveloperPhotoPicker;
