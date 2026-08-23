import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

const BUCKET_NAME = 'notices';

function PdfUpload({ value, onChange, compact }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
      const filePath = `pdfs/${fileName}`;

      setProgress(30);

      const { data, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          contentType: file.type || 'application/pdf',
          upsert: false,
        });

      setProgress(70);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

      setProgress(100);
      onChange(urlData.publicUrl);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (compact) {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '3px', alignItems: 'flex-start' }}>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
          onChange={(e) => uploadFile(e.target.files?.[0])}
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
            {uploading ? `${progress}%` : 'PDF'}
          </button>
          {value && (
            <>
              <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: '#243358', fontWeight: 600, fontSize: '11px', textDecoration: 'none' }}>View</a>
              <button
                type="button"
                onClick={() => onChange('')}
                title="Remove PDF"
                style={{ background: '#fdecea', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '11px', width: '18px', height: '18px', borderRadius: '50%', lineHeight: 1 }}
              >
                ×
              </button>
            </>
          )}
        </div>
        {error && <span style={{ fontSize: '10px', color: '#dc3545' }}>{error}</span>}
      </div>
    );
  }

  return (
    <div style={{ flex: 1, minWidth: '200px' }}>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Paste link or upload PDF"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }}
        />
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
          onChange={(e) => uploadFile(e.target.files?.[0])}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{ whiteSpace: 'nowrap', minWidth: '90px' }}
        >
          {uploading ? `${progress}%` : 'Upload PDF'}
        </button>
      </div>
      {uploading && (
        <div style={{ marginTop: '6px', width: '100%', height: '4px', background: '#e4e8ed', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: '#243358', borderRadius: '2px', transition: 'width 0.3s' }}></div>
        </div>
      )}
      {error && <span style={{ fontSize: '11px', color: '#dc3545', marginTop: '4px', display: 'block' }}>{error}</span>}
    </div>
  );
}

export default PdfUpload;
