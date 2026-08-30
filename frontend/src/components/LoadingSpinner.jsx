import './LoadingSpinner.css';

function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="loading-spinner-wrap">
      <div className="loading-spinner"></div>
      <p className="loading-spinner-text">{text}</p>
    </div>
  );
}

export default LoadingSpinner;
