import './PageBanner.css';

function PageBanner({ title, breadcrumb }) {
  return (
    <div className="page-banner">
      <div className="page-banner-inner">
        <nav className="page-breadcrumb" aria-label="Breadcrumb">
          {breadcrumb}
        </nav>
        <h1 className="page-title">{title}</h1>
      </div>
    </div>
  );
}

export default PageBanner;
