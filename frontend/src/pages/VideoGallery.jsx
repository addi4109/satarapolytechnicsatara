import { useState, useEffect } from 'react';
import PageBanner from '../components/PageBanner';
import SEO, { breadcrumbSchema } from '../components/SEO';
import './Gallery.css';

const API_URL = '/api';

function getYouTubeEmbed(url) {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?#]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
}

function isYouTube(url) {
  return !!getYouTubeEmbed(url);
}

function VideoGallery() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/videos`)
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((err) => console.error('Failed to fetch videos:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO
        title="Video Gallery | Campus Events & Activities"
        description="Watch videos of campus events, celebrations, and academic activities at Satara Polytechnic, Satara. Stay connected with our college."
        keywords="college video gallery, campus videos, Satara Polytechnic videos, polytechnic events videos"
        url="/gallery/videos"
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Gallery', url: '/gallery/photos' },
          { name: 'Video Gallery' },
        ])}
      />
      <PageBanner
        title="Video Gallery"
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            <a href="/gallery/videos">Gallery</a>
            <span className="sep">|</span>
            Video Gallery
          </>
        }
      />

      <div className="gallery-page-wrap">
        <h2 className="gallery-main-heading">Video Gallery</h2>
        <div className="gallery-main-line"></div>
        <p className="gallery-intro">
          Watch videos of our campus events, celebrations, and academic activities.
          Stay connected with everything happening at Satara Polytechnic.
        </p>

        {loading ? (
          null
        ) : videos.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '40px' }}>No videos available yet.</p>
        ) : (
          <div className="video-grid">
            {videos.map((video) => (
              <div className="video-card" key={video._id}>
                <div className="video-thumb">
                  {playing === video._id ? (
                    isYouTube(video.videoUrl) ? (
                      <iframe
                        src={getYouTubeEmbed(video.videoUrl)}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={video.title}
                      />
                    ) : (
                      <video
                        src={video.videoUrl}
                        controls
                        autoPlay
                        style={{ width: '100%', height: '100%', background: '#000', border: 'none' }}
                        title={video.title}
                      />
                    )
                  ) : (
                    <div
                      className="video-placeholder"
                      style={{ cursor: 'pointer' }}
                      onClick={() => video.videoUrl && setPlaying(video._id)}
                    >
                      {video.thumbnail ? (
                        <img src={video.thumbnail} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                      ) : null}
                      <span className="video-play-btn">▶</span>
                    </div>
                  )}
                </div>
                <div className="video-info">
                  <h4 className="video-title">{video.title}</h4>
                  <p className="video-desc">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default VideoGallery;
