import { useState, useEffect } from 'react';
import './NoticeTicker.css';

const API_URL = '/api';

function NoticeTicker() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/notices`)
      .then((res) => res.json())
      .then((data) => setNotices(data.filter((n) => n.category !== 'tinker').map((n) => n.text)))
      .catch((err) => console.error('Failed to fetch notices:', err));
  }, []);

  if (notices.length === 0) return null;

  const noticeItems = notices.map((text, i) => (
    <span key={i} className="ticker-item">{text}</span>
  ));

  return (
    <div className="ticker-section">
      <span className="ticker-label">Notice</span>
      <div className="ticker-wrap">
        <div className="ticker-scroll">
          {noticeItems}
          {noticeItems}
        </div>
      </div>
    </div>
  );
}

export default NoticeTicker;
