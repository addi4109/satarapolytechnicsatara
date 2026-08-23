import { useState, useRef } from 'react';
import './ImageUpload.css';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const MAX_SIZE_MB = 100;

function VideoUpload({ value, onChange, label = 'Upload Video', placeholder = 'Upload a video...' }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const uploadToCloudinary = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setError('Please select a video file');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${MAX_SIZE_MB}MB`);
      return;
    }

    setUploading(true);
    setError('');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 5, 90));
      }, 300);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
        { method: 'POST', body: formData }
      );

      clearInterval(progressInterval);

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || 'Upload failed');
      }

      const data = await res.json();
      setProgress(100);
      onChange(data.secure_url);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    uploadToCloudinary(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    uploadToCloudinary(e.dataTransfer.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleRemove = () => {
    onChange('');
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="image-upload-wrapper">
      {label && <label className="image-upload-label">{label}</label>}

      {/* Preview */}
      {value && !uploading && (
        <div className="image-upload-preview">
          <video
            src={value}
            controls
            style={{ width: '100%', height: '200px', background: '#000', display: 'block' }}
          />
          <button
            type="button"
            className="image-upload-remove"
            onClick={handleRemove}
            title="Remove video"
          >
            ✕
          </button>
          <div style={{ fontSize: '11px', color: '#888', padding: '6px 2px', wordBreak: 'break-all', fontFamily: "'Times New Roman', Times, serif" }}>
            {value}
          </div>
        </div>
      )}

      {/* Drop zone */}
      {!value && (
        <div
          className={`image-upload-dropzone ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !uploading && inputRef.current?.click()}
        >
          {uploading ? (
            <div className="image-upload-progress">
              <div className="upload-spinner"></div>
              <span>Uploading... {progress}%</span>
              <div className="upload-progress-bar">
                <div className="upload-progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          ) : (
            <>
              <div className="upload-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </div>
              <span className="upload-text">{placeholder}</span>
              <span className="upload-hint">Click to select or drag &amp; drop video here</span>
              <span className="upload-hint">MP4, WebM, MOV — max {MAX_SIZE_MB}MB</span>
            </>
          )}
        </div>
      )}

      {/* Manual URL option */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste a YouTube / video URL..."
          style={{ flex: 1, padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '12px', fontFamily: "'Times New Roman', Times, serif" }}
          disabled={uploading}
        />
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{ whiteSpace: 'nowrap' }}
        >
          Browse
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {error && <div className="image-upload-error">{error}</div>}
    </div>
  );
}

export default VideoUpload;
