import './Skeleton.css';

function Skeleton({ type = 'text', width, height, count = 1, className = '' }) {
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div className={`skeleton-wrapper ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton skeleton-${type}`} style={style} />
      ))}
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="skeleton-page">
      <div className="skeleton-banner">
        <Skeleton type="text" width="120px" height="14px" />
        <Skeleton type="title" width="300px" height="36px" />
      </div>
      <div className="skeleton-layout">
        <div className="skeleton-sidebar">
          <Skeleton type="text" width="100px" height="18px" />
          <Skeleton type="text" width="100%" height="36px" count={6} />
        </div>
        <div className="skeleton-content">
          <Skeleton type="title" width="260px" height="28px" />
          <Skeleton type="line" width="100%" height="12px" count={5} />
          <Skeleton type="block" width="100%" height="200px" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="skeleton-table-wrap">
      <div className="skeleton-table-header">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} type="text" width="80px" height="14px" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="skeleton-table-row">
          {Array.from({ length: cols }).map((_, col) => (
            <Skeleton key={col} type="text" width="60px" height="14px" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonCards({ count = 6 }) {
  return (
    <div className="skeleton-cards-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <Skeleton type="block" width="100%" height="120px" />
          <Skeleton type="text" width="70%" height="16px" />
          <Skeleton type="text" width="50%" height="12px" />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
