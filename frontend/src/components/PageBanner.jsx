import './PageBanner.css';

function PageBanner({ title, breadcrumb }) {
  return (
    <div className="page-banner">
      <div className="page-banner-inner">
        <span className="page-breadcrumb">{breadcrumb}</span>
        <h1 className="page-title">{title}</h1>
      </div>
    </div>
  );
}

export default PageBanner;
