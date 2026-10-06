import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Camera, X, Image as ImageIcon, Check } from 'lucide-react';

export default function PhotoInput({
  value = '',
  onChange,
  label = 'Photo / Image',
  placeholder = 'https://example.com/photo.jpg',
  shape = 'circle',
  helpText = 'Directly upload a photo file from your device or enter a photo URL.'
}) {
  const [mode, setMode] = useState('file'); // 'file' or 'url'
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WEBP, etc.).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size must be under 10MB.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const rawBase64 = uploadEvent.target.result;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxWidth = 800;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          if (onChange) onChange(compressedBase64);
        } catch (err) {
          console.warn('Canvas compression failed, using original base64', err);
          if (onChange) onChange(rawBase64);
        }
      };
      img.onerror = () => {
        if (onChange) onChange(rawBase64);
      };
      img.src = rawBase64;
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setError('');
    if (onChange) onChange('');
  };

  return (
    <div className="photo-input-container" style={{ marginBottom: '1.25rem' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label className="form-label" style={{ marginBottom: 0, fontWeight: 700 }}>{label}</label>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              type="button"
              className={`btn btn-sm ${mode === 'file' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setMode('file')}
              style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <Upload size={12} />
              <span>Upload File</span>
            </button>
            <button
              type="button"
              className={`btn btn-sm ${mode === 'url' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setMode('url')}
              style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <LinkIcon size={12} />
              <span>Photo URL</span>
            </button>
          </div>
        </div>
      )}

      <div style={{
        background: 'rgba(15, 23, 42, 0.4)',
        border: '1px dashed var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {/* Preview Box */}
        <div style={{
          width: shape === 'circle' ? '64px' : '88px',
          height: '64px',
          borderRadius: shape === 'circle' ? '50%' : 'var(--radius-sm)',
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1.5px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
          position: 'relative'
        }}>
          {value ? (
            <img
              src={value}
              alt="Photo Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <ImageIcon size={24} style={{ color: 'var(--text-muted)' }} />
          )}
        </div>

        {/* Controls */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          {mode === 'file' ? (
            <div>
              <label style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.85rem',
                background: 'var(--bg-card-hover)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                transition: 'all 0.2s ease'
              }}>
                <Camera size={15} color="#38bdf8" />
                <span>Choose Image File...</span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </label>
              {value && value.startsWith('data:image/') && (
                <span style={{ fontSize: '0.75rem', color: '#10b981', marginLeft: '0.6rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Check size={12} /> Photo Loaded
                </span>
              )}
            </div>
          ) : (
            <div>
              <input
                type="text"
                className="form-input"
                placeholder={placeholder}
                value={value.startsWith('data:image/') ? '' : value}
                onChange={(e) => {
                  setError('');
                  if (onChange) onChange(e.target.value);
                }}
                style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
              />
            </div>
          )}

          {error ? (
            <div style={{ color: '#fb7185', fontSize: '0.78rem', marginTop: '0.35rem' }}>{error}</div>
          ) : helpText ? (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
              {helpText}
            </div>
          ) : null}

          {value && (
            <button
              type="button"
              onClick={handleRemove}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f43f5e',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                marginTop: '0.4rem',
                padding: 0
              }}
            >
              <X size={12} />
              <span>Remove Photo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
