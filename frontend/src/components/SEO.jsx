import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Satara Polytechnic, Satara';
const SITE_URL = 'https://satarapolytechnicsatara.com';
const DEFAULT_IMAGE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLd7Dy_lmlGJVHmuU9Xft3chSek82jrLr2qJZ_Rl8kuw&s=10';

function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  structuredData,
  noindex = false,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const metaDescription = description || `${SITE_NAME} is a premier diploma engineering institute affiliated to MSBTE, Mumbai offering 6 engineering branches.`;
  const metaImage = image || DEFAULT_IMAGE;
  const metaUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={metaUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

export default SEO;

// Pre-defined structured data factories
export const collegeSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Satara Polytechnic, Satara',
  alternateName: 'Satara Polytechnic, Satara',
  url: 'https://satarapolytechnicsatara.com',
  logo: DEFAULT_IMAGE,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Satara',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9309919088',
    contactType: 'admissions',
    availableLanguage: ['English', 'Hindi', 'Marathi'],
  },
  sameAs: [],
};

export const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Diploma Engineering Courses',
  numberOfItems: 6,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Computer Engineering',
      url: 'https://satarapolytechnicsatara.com/departments/computer',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Electronics & Telecommunication Engineering',
      url: 'https://satarapolytechnicsatara.com/departments/electronics-telecommunication',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Mechanical Engineering',
      url: 'https://satarapolytechnicsatara.com/departments/mechanical',
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'Chemical Engineering',
      url: 'https://satarapolytechnicsatara.com/departments/chemical',
    },
    {
      '@type': 'ListItem',
      position: 5,
      name: 'Electrical Engineering',
      url: 'https://satarapolytechnicsatara.com/departments/electrical',
    },
    {
      '@type': 'ListItem',
      position: 6,
      name: 'Automobile Engineering',
      url: 'https://satarapolytechnicsatara.com/departments/automobile',
    },
  ],
};

export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url ? `${SITE_URL}${item.url}` : undefined,
  })),
});
