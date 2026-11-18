import React, { useState, useRef } from 'react';
import { Upload, LoaderCircle, FileImage, Trash2 } from 'lucide-react';
import api from '../api/client';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

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
    setFileMeta(`${file.name} · ${fileSizeKB} KB`);

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

  return (
    <div className="developer-photo-section">
      <div className="developer-photo-header">
        <label className="developer-photo-label">Profile photo</label>
        <span className="developer-photo-badge">
          {fileMeta ? 'Selected' : 'Current photo'}
        </span>
      </div>

      {/* Choose an image from the device */}
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
                style={{ objectFit: 'cover' }}
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
              <span>Choose image</span>
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
            {fileMeta || 'Choose an image from your device, or drag it here. JPG, PNG, WebP, or GIF · up to 10 MB.'}
          </p>
        </div>
      </div>

      {error && <p className="developer-photo-error" role="alert">{error}</p>}

    </div>
  );
};

export default DeveloperPhotoPicker;
