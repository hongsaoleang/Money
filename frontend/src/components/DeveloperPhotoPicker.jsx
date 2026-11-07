import React, { useState } from 'react';
import { ImagePlus, LoaderCircle } from 'lucide-react';
import api from '../api/client';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const DeveloperPhotoPicker = ({ value, onChange }) => {
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleChoosePhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Choose a JPG, PNG, WebP, or GIF image.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError('Choose an image smaller than 5 MB.');
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('image', file);
    try {
      const { data } = await api.post('/api/admin/developers/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      URL.revokeObjectURL(localPreview);
      setPreview(data.avatar);
      onChange(data.avatar);
    } catch (uploadError) {
      URL.revokeObjectURL(localPreview);
      setPreview('');
      setError(uploadError.response?.data?.detail || uploadError.response?.data?.message || 'Photo upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="developer-photo-field">
      <span className="developer-photo-label">Profile photo</span>
      <div className="developer-photo-picker">
        <div className="developer-photo-preview">
          {(preview || value) && <img src={preview || value} alt="Selected profile" />}
        </div>
        <label className="developer-photo-choose">
          {uploading ? <LoaderCircle size={17} className="developer-photo-spinner" /> : <ImagePlus size={17} />}
          <span>{uploading ? 'Uploading photo...' : 'Choose from device'}</span>
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleChoosePhoto} disabled={uploading} />
        </label>
        <span className="developer-photo-hint">JPG, PNG, WebP or GIF · Up to 5 MB</span>
      </div>
      {error && <span className="developer-photo-error" role="alert">{error}</span>}
    </div>
  );
};

export default DeveloperPhotoPicker;
