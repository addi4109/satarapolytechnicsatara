import { useState, useEffect } from 'react';
import PageBanner from '../components/PageBanner';
import SEO, { breadcrumbSchema } from '../components/SEO';
import './Academics.css';

const API_URL = '/api';

function Rules() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/rules`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <SEO title="Rules & Regulations | Satara Polytechnic" description="College rules and regulations at Satara Polytechnic, Satara." keywords="college rules, regulations, code of conduct" url="/rules" />
        null
      </>
    );
  }

  const title = data?.title || 'College Rules & Regulations';
  const description = data?.description || '';
  const rules = data?.rules || [];

  return (
    <>
      <SEO
        title={`${title} | Satara Polytechnic`}
        description={description || 'College rules and regulations at Satara Polytechnic, Satara. Code of conduct, attendance, examination rules and more.'}
        keywords="Satara Polytechnic rules, college regulations, code of conduct, attendance rules"
        url="/rules"
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Rules & Regulations' },
        ])}
      />
      <PageBanner
        title="Rules & Regulations"
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            Rules & Regulations
          </>
        }
      />

      <div className="about-layout">
        <main className="about-content" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="content-heading">{title}</h2>
          <div className="content-line"></div>

          {description && (
            <p style={{ marginBottom: '24px', lineHeight: '1.8', color: '#444', fontSize: '15px' }}>
              {description}
            </p>
          )}

          {rules.length > 0 ? (
            <div className="rules-list">
              {rules.map((rule, i) => (
                <div key={i} className="rule-item">
                  <div className="rule-number">{i + 1}</div>
                  <div className="rule-content">
                    <h4 className="rule-title">{rule.ruleTitle || `Rule ${i + 1}`}</h4>
                    <p className="rule-desc">{rule.ruleDesc}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888', fontStyle: 'italic' }}>
              No rules have been added yet.
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default Rules;
