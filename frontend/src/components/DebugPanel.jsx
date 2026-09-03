import { useState, useEffect } from 'react';
import './DebugPanel.css';

const integrations = [
  {
    id: 'firebase',
    name: 'Firebase',
    desc: 'Stores enquiry form data',
    vars: [
      { key: 'apiKey', where: 'firebase.js' },
      { key: 'authDomain', where: 'firebase.js' },
      { key: 'projectId', where: 'firebase.js' },
    ],
    check: async () => {
      try {
        const { db } = await import('../lib/firebase');
        const { collection, getDocs, limit, query } = await import('firebase/firestore');
        await getDocs(query(collection(db, 'enquiries'), limit(1)));
        return true;
      } catch { return false; }
    },
  },
  {
    id: 'emailjs',
    name: 'EmailJS',
    desc: 'Sends emails on admission enquiry',
    vars: [
      { key: 'VITE_EMAILJS_SERVICE_ID', where: 'Hostinger' },
      { key: 'VITE_EMAILJS_COLLEGE_TEMPLATE_ID', where: 'Hostinger' },
      { key: 'VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID', where: 'Hostinger' },
      { key: 'VITE_EMAILJS_PUBLIC_KEY', where: 'Hostinger' },
    ],
    check: () => {
      const a = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const b = import.meta.env.VITE_EMAILJS_COLLEGE_TEMPLATE_ID;
      const c = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID;
      const d = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      return !!(a && b && c && d);
    },
  },
  {
    id: 'cloudinary',
    name: 'Cloudinary',
    desc: 'Handles image & video uploads',
    vars: [
      { key: 'VITE_CLOUDINARY_CLOUD_NAME', where: 'Hostinger' },
      { key: 'VITE_CLOUDINARY_UPLOAD_PRESET', where: 'Hostinger' },
    ],
    check: () => {
      const a = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const b = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      return !!(a && b);
    },
  },
  {
    id: 'supabase',
    name: 'Supabase',
    desc: 'Stores PDFs for notices',
    vars: [
      { key: 'VITE_SUPABASE_URL', where: 'Hostinger' },
      { key: 'VITE_SUPABASE_ANON_KEY', where: 'Hostinger' },
    ],
    check: () => {
      const a = import.meta.env.VITE_SUPABASE_URL;
      const b = import.meta.env.VITE_SUPABASE_ANON_KEY;
      return !!(a && b);
    },
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    desc: 'Main backend database',
    vars: [
      { key: 'MONGO_URI', where: 'Hostinger' },
      { key: 'ADMIN_API_KEY', where: 'Hostinger' },
      { key: 'FRONTEND_URL', where: 'Hostinger' },
      { key: 'PORT', where: 'Hostinger (default: 5000)' },
    ],
    check: null,
  },
];

function DebugPanel({ isOpen, onClose }) {
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    if (isOpen) {
      const newStatuses = {};
      const runChecks = async () => {
        for (const intg of integrations) {
          if (intg.check) {
            const result = intg.check();
            newStatuses[intg.id] = result instanceof Promise ? await result : result;
          } else {
            newStatuses[intg.id] = null;
          }
          setStatuses({ ...newStatuses });
        }
      };
      runChecks();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="debug-overlay" onClick={onClose}>
      <div className="debug-panel" onClick={(e) => e.stopPropagation()}>
        <div className="debug-panel-header">
          <h2>Debug Panel</h2>
          <button className="debug-close-btn" onClick={onClose}>x</button>
        </div>

        <div className="debug-panel-subtitle">
          Quick check if services are connected
        </div>

        <div className="debug-grid">
          {integrations.map((intg) => {
            const s = statuses[intg.id];
            return (
              <div key={intg.id} className={`debug-card ${s === true ? 'connected' : s === false ? 'disconnected' : 'unknown'}`}>
                <div className="debug-card-header">
                  <div className="debug-card-info">
                    <h3>{intg.name}</h3>
                    <p>{intg.desc}</p>
                  </div>
                  <span className={`debug-status-badge ${s === true ? 'connected' : s === false ? 'disconnected' : 'unknown'}`}>
                    {s === true ? 'Connected' : s === false ? 'Not Set' : 'Server-side'}
                  </span>
                </div>

                <div className="debug-env-list">
                  <div className="debug-env-label">Env Vars</div>
                  {intg.vars.map((v, i) => (
                    <div key={i} className="debug-env-row">
                      <code className="debug-env-key">{v.key}</code>
                      <span className="debug-env-source">{v.where}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="debug-footer">
          <span>Hostinger</span>
          <span>Hostinger</span>
          <span>MongoDB Atlas</span>
        </div>
      </div>
    </div>
  );
}

export default DebugPanel;
