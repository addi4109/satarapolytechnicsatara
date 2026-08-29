import { useState, useEffect } from 'react';
import './DebugPanel.css';

const integrations = [
  {
    id: 'firebase',
    name: 'Firebase',
    icon: '🔥',
    description: 'Firestore database for enquiries',
    envVars: [
      { key: 'apiKey', source: 'Hardcoded in firebase.js' },
      { key: 'authDomain', source: 'Hardcoded in firebase.js' },
      { key: 'projectId', source: 'Hardcoded in firebase.js' },
    ],
    check: () => {
      try {
        return typeof window !== 'undefined' && navigator.onLine;
      } catch { return false; }
    },
  },
  {
    id: 'emailjs',
    name: 'EmailJS',
    icon: '📧',
    description: 'Email service for admission enquiries & auto-replies',
    envVars: [
      { key: 'VITE_EMAILJS_SERVICE_ID', source: 'Vercel env' },
      { key: 'VITE_EMAILJS_COLLEGE_TEMPLATE_ID', source: 'Vercel env' },
      { key: 'VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID', source: 'Vercel env' },
      { key: 'VITE_EMAILJS_PUBLIC_KEY', source: 'Vercel env' },
    ],
    check: () => {
      const val = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      return !!(val && val.length > 0);
    },
  },
  {
    id: 'cloudinary',
    name: 'Cloudinary',
    icon: '☁️',
    description: 'Image & video uploads',
    envVars: [
      { key: 'VITE_CLOUDINARY_CLOUD_NAME', source: 'Vercel env' },
      { key: 'VITE_CLOUDINARY_UPLOAD_PRESET', source: 'Vercel env' },
    ],
    check: () => {
      const val = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      return !!(val && val.length > 0);
    },
  },
  {
    id: 'supabase',
    name: 'Supabase',
    icon: '⚡',
    description: 'PDF file storage for notices',
    envVars: [
      { key: 'VITE_SUPABASE_URL', source: 'Vercel env' },
      { key: 'VITE_SUPABASE_ANON_KEY', source: 'Vercel env' },
    ],
    check: () => {
      const val = import.meta.env.VITE_SUPABASE_URL;
      return !!(val && val.length > 0);
    },
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    icon: '🍃',
    description: 'Backend database via Render',
    envVars: [
      { key: 'MONGO_URI', source: 'Render env' },
      { key: 'ADMIN_API_KEY', source: 'Render env' },
      { key: 'FRONTEND_URL', source: 'Render env' },
      { key: 'PORT', source: 'Render env (default: 5000)' },
    ],
    check: null, // Backend-only, can't check from frontend
  },
  {
    id: 'vercel',
    name: 'Vercel',
    icon: '▲',
    description: 'Frontend hosting & deployment',
    envVars: [
      { key: 'VITE_*', source: 'Vercel build env vars' },
    ],
    check: () => {
      // If running on Vercel, we can infer from deployment URL
      return typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
    },
  },
  {
    id: 'render',
    name: 'Render',
    icon: '🖥️',
    description: 'Backend API hosting',
    envVars: [
      { key: 'MONGO_URI', source: 'Render env dashboard' },
      { key: 'ADMIN_API_KEY', source: 'Render env dashboard' },
      { key: 'ADMIN_EMAILS', source: 'Render env dashboard' },
      { key: 'ADMIN_PASSWORDS', source: 'Render env dashboard' },
    ],
    check: null, // Backend-only
  },
];

function DebugPanel({ isOpen, onClose }) {
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    if (isOpen) {
      const newStatuses = {};
      integrations.forEach((intg) => {
        if (intg.check) {
          newStatuses[intg.id] = intg.check();
        } else {
          newStatuses[intg.id] = null; // unknown — backend-only
        }
      });
      setStatuses(newStatuses);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="debug-overlay" onClick={onClose}>
      <div className="debug-panel" onClick={(e) => e.stopPropagation()}>
        <div className="debug-panel-header">
          <div className="debug-panel-title">
            <span className="debug-panel-icon">🛠️</span>
            <h2>Debug Panel</h2>
          </div>
          <button className="debug-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="debug-panel-subtitle">
          Integration status & environment variables overview
        </div>

        <div className="debug-grid">
          {integrations.map((intg) => {
            const status = statuses[intg.id];
            return (
              <div key={intg.id} className={`debug-card ${status === true ? 'connected' : status === false ? 'disconnected' : 'unknown'}`}>
                <div className="debug-card-header">
                  <span className="debug-card-icon">{intg.icon}</span>
                  <div className="debug-card-info">
                    <h3>{intg.name}</h3>
                    <p>{intg.description}</p>
                  </div>
                  <span className={`debug-status-badge ${status === true ? 'connected' : status === false ? 'disconnected' : 'unknown'}`}>
                    {status === true ? '● Connected' : status === false ? '● Not Set' : '● Backend Only'}
                  </span>
                </div>

                <div className="debug-env-list">
                  <div className="debug-env-label">Environment Variables</div>
                  {intg.envVars.map((ev, i) => (
                    <div key={i} className="debug-env-row">
                      <code className="debug-env-key">{ev.key}</code>
                      <span className="debug-env-source">{ev.source}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="debug-footer">
          <span>Frontend: Vercel</span>
          <span>Backend: Render</span>
          <span>Database: MongoDB Atlas</span>
        </div>
      </div>
    </div>
  );
}

export default DebugPanel;
