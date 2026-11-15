import { useState, useEffect } from 'react';
import PageBanner from '../components/PageBanner';
import SEO, { breadcrumbSchema } from '../components/SEO';
import './CellsPage.css';

import API_URL from '../lib/api';

const CELL_STATIC_CONTENT = {
  placement: {
    intro:
      'The Training & Placement Cell is the bridge between our students and the industry. It works throughout the year to prepare students for professional careers and to bring reputed recruiters to the campus.',
    objectives: [
      'Build strong industry-institute partnerships and invite reputed companies for campus recruitment.',
      'Train students in aptitude, communication, technical interviews, group discussions and resume writing.',
      'Arrange internships, industrial visits, workshops and expert lectures.',
      'Guide students on career options, higher studies and entrepreneurship.',
      'Track placement outcomes and use recruiter feedback to improve training.',
    ],
    activities: [
      'Pre-placement talks, mock interviews and campus recruitment drives.',
      'Soft-skill and personality development programmes.',
      'Alumni interaction sessions and industry mentorship.',
    ],
  },
  'anti-ragging': {
    intro:
      'The Anti-Ragging Cell works to keep the campus completely free from ragging. It creates awareness among students and takes prompt, strict action on every complaint as per UGC and AICTE norms.',
    objectives: [
      'Ensure a ragging-free and respectful campus environment.',
      'Spread awareness about the legal and academic consequences of ragging.',
      'Receive, investigate and redress ragging complaints promptly and confidentially.',
      'Support freshers and help them settle into campus life.',
      'Display anti-ragging notices, helpline numbers and committee details.',
    ],
    activities: [
      'Orientation and awareness programmes for new students.',
      'Monitoring of hostel, canteen and campus areas.',
      'Prompt inquiry of complaints and recommendation of action.',
    ],
  },
  grievance: {
    intro:
      'The Grievance Redressal Cell gives students, parents and staff an accessible platform to raise academic or institutional concerns. Every complaint is handled fairly, confidentially and within a reasonable time.',
    objectives: [
      'Provide a simple and accessible channel for registering grievances.',
      'Resolve academic, administrative and infrastructure complaints within a defined timeframe.',
      'Maintain confidentiality and protect complainants from any form of retaliation.',
      'Identify recurring issues and recommend systemic improvements.',
      'Promote trust and transparency between students and the institute.',
    ],
    activities: [
      'Registration, hearing and follow-up of grievances.',
      'Regular review meetings with the concerned departments.',
      'Awareness about the grievance process during orientation.',
    ],
  },
  'womens-grievance': {
    intro:
      'The Women Grievance Cell is committed to creating a safe, respectful and empowering environment for women students and staff. It provides a supportive space to report concerns and receive guidance.',
    objectives: [
      'Ensure the safety, dignity and well-being of women on campus.',
      'Address complaints related to harassment or discrimination promptly and sensitively.',
      'Create awareness about women\'s rights, safety and legal provisions.',
      'Provide counselling, guidance and support to affected students.',
      'Promote equal opportunity and a healthy gender-sensitive campus culture.',
    ],
    activities: [
      'Confidential grievance handling and counselling.',
      'Awareness sessions, seminars and self-defence workshops.',
      'Celebration of women-centric events and campaigns.',
    ],
  },
  'sc-st': {
    intro:
      'The SC/ST Cell safeguards the interests of students belonging to Scheduled Castes and Scheduled Tribes. It ensures that reservation policies and welfare schemes are implemented properly and that students receive academic and financial support.',
    objectives: [
      'Implement reservation and welfare policies in letter and spirit.',
      'Disseminate information about scholarships, fee concessions and government schemes.',
      'Monitor academic progress and provide remedial coaching where needed.',
      'Address complaints of discrimination or unequal treatment.',
      'Encourage participation of SC/ST students in all campus activities.',
    ],
    activities: [
      'Scholarship and scheme awareness drives.',
      'Mentoring and academic support sessions.',
      'Grievance redressal and follow-up with authorities.',
    ],
  },
  nss: {
    intro:
      'The National Service Scheme (NSS) Cell develops social consciousness and civic responsibility among students through meaningful community service. It encourages young people to contribute to society while growing as responsible citizens.',
    objectives: [
      'Develop an understanding of community needs and social realities.',
      'Encourage students to take part in nation-building and community service.',
      'Build leadership, teamwork and organisational skills through service.',
      'Promote health, hygiene, literacy and environmental awareness.',
      'Strengthen the bond between the institute and the local community.',
    ],
    activities: [
      'Blood donation camps and health awareness programmes.',
      'Tree plantation, cleanliness and environmental drives.',
      'Village adoption, literacy programmes and disaster relief campaigns.',
      'Annual NSS camps and social awareness rallies.',
    ],
  },
  'internal-committee': {
    intro:
      'The Internal Complaint Committee (ICC) is constituted under the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act. It prevents and addresses sexual harassment and ensures a safe working and learning environment for all.',
    objectives: [
      'Prevent and prohibit sexual harassment on campus.',
      'Receive and inquire into complaints promptly, fairly and confidentially.',
      'Conduct awareness and sensitisation programmes for students and staff.',
      'Recommend protective and corrective measures to the institute.',
      'Prepare and maintain records and annual reports as required by law.',
    ],
    activities: [
      'Awareness workshops on the POSH Act and respectful conduct.',
      'Confidential complaint handling and inquiry.',
      'Counselling and support for affected persons.',
    ],
  },
  iqac: {
    intro:
      'The Internal Quality Assurance Cell (IQAC) drives continuous improvement in the academic and administrative performance of the institute. It coordinates quality initiatives and helps the institute meet accreditation and statutory requirements.',
    objectives: [
      'Promote a culture of quality, accountability and continuous improvement.',
      'Coordinate internal quality audits and prepare quality reports.',
      'Collect and analyse feedback from students, parents and recruiters.',
      'Encourage best practices in teaching, learning and governance.',
      'Support accreditation, documentation and institutional planning.',
    ],
    activities: [
      'Quality audits and departmental reviews.',
      'Workshops, seminars and faculty development programmes.',
      'Student feedback analysis and action plans.',
      'Preparation of AQAR and accreditation documentation.',
    ],
  },
};

function CellsPage() {
  const [cells, setCells] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/cells`)
      .then((res) => res.json())
      .then((data) => setCells(data))
      .catch((err) => console.error('Failed to fetch cells:', err))
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      <SEO
        title="Cells & Committees | Anti-Ragging, NSS, IQAC"
        description="Learn about various cells and committees at Satara Polytechnic including Anti-Ragging Cell, NSS, IQAC, Grievance Redressal, Women Grievance Cell, and more."
        keywords="anti-ragging cell, NSS cell, IQAC, college committees, grievance redressal, Satara Polytechnic committees"
        url="/cells"
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Cells & Committees' },
        ])}
      />
      <PageBanner
        title="Cell and Committees"
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            Cell and Committees
          </>
        }
      />

      <div className="cells-page-wrap">
        <h2 className="cells-main-heading">Cell and Committees</h2>
        <div className="cells-main-line"></div>
        <p className="cells-intro">
          Satara Polytechnic, Satara has established various cells and committees to ensure
          the overall development of students, maintain discipline, and address grievances.
          Each cell works under the guidance of experienced faculty members and focuses on a
          specific area — such as anti-ragging, student welfare, quality assurance, sports,
          cultural activities, and more. Together, these bodies create a safe, inclusive, and
          supportive learning environment where every student can grow academically and personally.
        </p>

        <div className="cells-contact-box">
          <div className="cells-contact-icon" aria-hidden="true">✉</div>
          <div className="cells-contact-body">
            <h3 className="cells-contact-heading">Grievance &amp; Query Support</h3>
            <p className="cells-contact-text">
              Students, parents, or any stakeholder can mail their grievance or query
              directly to the cell / committee concerned, or write to us at:
            </p>
            <a className="cells-contact-mail" href="mailto:spsgrievance@gmail.com">
              spsgrievance@gmail.com
            </a>
          </div>
        </div>

        {loading ? null : cells.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '40px 0' }}>
            No cells or committees available yet.
          </p>
        ) : (
          <div className="cells-list">
            {cells.map((cell) => {
              const extra = CELL_STATIC_CONTENT[cell.slug] || {};
              return (
                <article className="cell-block" key={cell._id}>
                  <div className="cell-block-head">
                    <h3 className="cell-block-heading">{cell.name}</h3>
                    <span className={`cell-block-badge ${cell.type === 'committee' ? 'is-committee' : ''}`}>
                      {cell.type === 'committee' ? 'Committee' : 'Cell'}
                    </span>
                  </div>

                  <p className="cell-block-lead">{extra.intro || cell.description}</p>

                  {extra.objectives?.length > 0 && (
                    <div className="cell-block-section">
                      <h4 className="cell-block-subheading">Objectives</h4>
                      <ul className="cell-block-list">
                        {extra.objectives.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {extra.activities?.length > 0 && (
                    <div className="cell-block-section">
                      <h4 className="cell-block-subheading">Key Activities</h4>
                      <ul className="cell-block-list">
                        {extra.activities.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <a href={`/cells/${cell.slug}`} className="cell-block-link">
                    View Members &amp; Details →
                  </a>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default CellsPage;
