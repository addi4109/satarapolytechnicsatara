import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

const BUCKET_NAME = 'ranker-images';

function ImageUploadSupabase({ value, onChange, compact, label = 'Upload Image' }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const inputRef = useRef(null);

  const uploadFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    setUploading(true);
    setProgress(0);
    setError('');
    setFileName(file.name);

    try {
      const fileExt = file.name.split('.').pop();
      const uniqueName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
      const filePath = `rankers/${uniqueName}`;

      setProgress(30);

      const { data, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          contentType: file.type || 'image/*',
          upsert: false,
        });

      setProgress(70);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

      setProgress(100);
      setFileName(file.name);
      onChange(urlData.publicUrl);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleRemove = () => {
    onChange('');
    setFileName('');
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  if (compact) {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '3px', alignItems: 'flex-start' }}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            style={{ padding: '4px 10px', fontSize: '11px', whiteSpace: 'nowrap' }}
          >
            {uploading ? `${progress}%` : 'Upload'}
          </button>
          {value && (
            <>
              <span style={{ fontSize: '12px', color: '#333' }}>{fileName || 'Image'}</span>
              <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: '#243358', fontWeight: 600, fontSize: '11px', textDecoration: 'none' }}>View</a>
              <button
                type="button"
                onClick={handleRemove}
                title="Remove image"
                style={{ background: '#fdecea', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '11px', width: '18px', height: '18px', borderRadius: '50%', lineHeight: 1 }}
              >×</button>
            </>
          )}
        </div>
        {error && <span style={{ fontSize: '10px', color: '#dc3545' }}>{error}</span>}
      </div>
    );
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {value ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#f8f9fa', border: '1px solid #e4e8ed', borderRadius: '6px' }}>
          <img src={value} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#333' }}>{fileName || 'Uploaded image'}</div>
            <a href={value} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#243358', textDecoration: 'none' }}>View image →</a>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            style={{ background: '#fdecea', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '14px', width: '24px', height: '24px', borderRadius: '50%', lineHeight: 1 }}
            title="Remove image"
          >×</button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            padding: '20px', border: '2px dashed #d7dde6', borderRadius: '8px', textAlign: 'center',
            cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s',
            background: uploading ? '#f8f9fa' : '#fff',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#243358'; e.currentTarget.style.background = '#f8f9fa'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d7dde6'; e.currentTarget.style.background = '#fff'; }}
        >
          {uploading ? (
            <div>
              <div style={{ fontSize: '13px', color: '#243358', fontWeight: 600 }}>Uploading... {progress}%</div>
              <div style={{ marginTop: '8px', width: '100%', height: '4px', background: '#e4e8ed', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: '#243358', borderRadius: '2px', transition: 'width 0.3s' }}></div>
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>🖼</div>
              <div style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>{label}</div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>JPG, PNG, WebP</div>
            </>
          )}
        </div>
      )}

      {error && <div style={{ fontSize: '11px', color: '#dc3545', marginTop: '6px' }}>{error}</div>}
    </div>
  );
}

export default ImageUploadSupabase;
