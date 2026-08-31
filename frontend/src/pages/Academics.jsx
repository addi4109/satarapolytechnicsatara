import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import SEO, { breadcrumbSchema } from '../components/SEO';
import './Academics.css';
import { getAcademicYear } from '../lib/siteConfig';

const routeMap = {
  'overview': 'overview',
  'courses': 'courses',
  'curriculum': 'curriculum',
  'calendar': 'calendar',
  'faculty': 'faculty',
  'timetable': 'timetable',
  'elearning': 'elearning',
  'library': 'library',
  'results': 'results',
  'cells': 'cells',
};

const calendarPdf = `https://msbteadmin.bynaricexam.com/uploads/circular/1778829186168_A.Y._${getAcademicYear()}_Academic_Calander.pdf`;

const sidebarLinks = [
  { id: 'overview', label: 'Academic Overview' },
  { id: 'courses', label: 'Courses' },
  { id: 'curriculum', label: 'Curriculum' },
  { id: 'calendar', label: 'Academic Calendar' },
  { id: 'faculty', label: 'Faculty' },
  { id: 'timetable', label: 'Time Table' },
  { id: 'elearning', label: 'E-Learning' },
  { id: 'library', label: 'Library' },
  { id: 'results', label: 'Results' },
  { id: 'cells', label: 'Cell and Committees' },
];

function Academics() {
  const { page } = useParams();
  const [active, setActive] = useState('overview');

  useEffect(() => {
    if (page && routeMap[page]) {
      setActive(routeMap[page]);
    }
  }, [page]);

  return (
    <>
      <SEO
        title={`${active.charAt(0).toUpperCase() + active.slice(1)} | Academics`}
        description={`Explore ${active === 'overview' ? 'academic overview' : active} at Satara Polytechnic, Satara. ${active === 'courses' ? '6 diploma engineering courses with 360 annual intake.' : active === 'faculty' ? 'Experienced faculty across 6 engineering departments.' : active === 'library' ? 'Library with 15000+ books and 50+ journals.' : active === 'results' ? 'MSBTE exam results with 92% pass percentage.' : 'MSBTE affiliated diploma programs.'}`}
        keywords={`Satara Polytechnic academics, ${active}, polytechnic courses, MSBTE curriculum, diploma engineering ${active}`}
        url={`/academics/${page || 'overview'}`}
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Academics', url: '/academics/overview' },
          { name: active.charAt(0).toUpperCase() + active.slice(1) },
        ])}
      />
      <PageBanner
        title="Academics"
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            Academics
          </>
        }
      />

      <div className="academics-page">
        {active !== 'calendar' && (
          <div className="academics-tabs">
            {sidebarLinks.map((link) => (
              <button
                key={link.id}
                className={`academics-tab ${active === link.id ? 'active' : ''}`}
                onClick={() => setActive(link.id)}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}

        <main className="academics-content">
          {active === 'overview' && (
            <>
              <h2 className="content-heading">Academic Overview</h2>
              <div className="content-line"></div>
              <p>
                Satara Polytechnic, Satara follows the curriculum prescribed by the
                Maharashtra State Board of Technical Education (MSBTE), Mumbai.
                The institute offers full-time diploma programmes in six
                engineering disciplines with a total annual intake of 360 students.
              </p>
              <p>
                The academic calendar is structured to ensure comprehensive coverage
                of theory, practical, and project work. Regular internal assessments,
                viva voce, and practical examinations are conducted to evaluate
                student progress throughout the semester.
              </p>
              <p>
                The institute maintains a strong academic track record with consistent
                results above the MSBTE state average. Special coaching and remedial
                classes are arranged for students who need additional support.
              </p>
            </>
          )}

          {active === 'courses' && (
            <>
              <h2 className="content-heading">Courses</h2>
              <div className="content-line"></div>
              <div className="courses-table-wrap">
                <table className="courses-table">
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Course Name</th>
                      <th>Duration</th>
                      <th>Intake</th>
                      <th>Direct 2nd Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Computer Engineering</td>
                      <td>3 Years</td>
                      <td>60</td>
                      <td>Yes</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Electronics & Telecommunication</td>
                      <td>3 Years</td>
                      <td>60</td>
                      <td>Yes</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Mechanical Engineering</td>
                      <td>3 Years</td>
                      <td>60</td>
                      <td>Yes</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>Chemical Engineering</td>
                      <td>3 Years</td>
                      <td>60</td>
                      <td>Yes</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>Electrical Engineering</td>
                      <td>3 Years</td>
                      <td>60</td>
                      <td>Yes</td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td>Automobile Engineering</td>
                      <td>3 Years</td>
                      <td>60</td>
                      <td>Yes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {active === 'curriculum' && (
            <>
              <h2 className="content-heading">Curriculum</h2>
              <div className="content-line"></div>
              <p>
                The curriculum is designed by MSBTE, Mumbai and is regularly updated
                to meet industry requirements. It includes theory subjects, practical
                sessions, workshops, and project work across all six semesters.
              </p>
              <div className="curriculum-grid">
                <div className="curr-card">
                  <h4 className="curr-title">Semester 1-2</h4>
                  <p>Foundation subjects including Engineering Mathematics, Applied Science, Engineering Drawing, and basic branch-specific subjects.</p>
                </div>
                <div className="curr-card">
                  <h4 className="curr-title">Semester 3-4</h4>
                  <p>Core branch subjects, laboratory work, and professional skills development. Students begin specialized coursework.</p>
                </div>
                <div className="curr-card">
                  <h4 className="curr-title">Semester 5-6</h4>
                  <p>Advanced specialization, project work, industrial training, and elective subjects. Focus on employability skills.</p>
                </div>
              </div>
            </>
          )}

          {active === 'calendar' && (
            <>
              <h2 className="content-heading">Academic Calendar</h2>
              <div className="content-line"></div>
              <p>
                The academic calendar for the year A.Y. {getAcademicYear()} as prescribed by
                MSBTE, Mumbai. All dates are subject to change as per board
                notifications.
              </p>
              <div className="calendar-btns">
                <a
                  href={calendarPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cal-btn view"
                >
                  View Calendar
                </a>
                <a
                  href={calendarPdf}
                  download={`MSBTE_Academic_Calendar_${getAcademicYear()}.pdf`}
                  className="cal-btn download"
                >
                  Download PDF
                </a>
              </div>
              <p style={{ marginTop: 20 }}>
                Click View to open the calendar in a new tab, or Download to save
                it as a PDF on your device.
              </p>
            </>
          )}

          {active === 'faculty' && (
            <>
              <h2 className="content-heading">Faculty</h2>
              <div className="content-line"></div>
              <p>
                Our institute has a team of dedicated and experienced faculty members
                who are committed to providing quality education. The faculty members
                regularly attend faculty development programmes and workshops to stay
                updated with the latest developments in their fields.
              </p>
              <div className="faculty-grid">
                <div className="faculty-card">
                  <h4>Computer Engineering</h4>
                  <p>8 Faculty Members</p>
                </div>
                <div className="faculty-card">
                  <h4>Electronics & Telecom</h4>
                  <p>7 Faculty Members</p>
                </div>
                <div className="faculty-card">
                  <h4>Mechanical Engineering</h4>
                  <p>8 Faculty Members</p>
                </div>
                <div className="faculty-card">
                  <h4>Chemical Engineering</h4>
                  <p>6 Faculty Members</p>
                </div>
                <div className="faculty-card">
                  <h4>Electrical Engineering</h4>
                  <p>6 Faculty Members</p>
                </div>
                <div className="faculty-card">
                  <h4>Automobile Engineering</h4>
                  <p>5 Faculty Members</p>
                </div>
              </div>
            </>
          )}

          {active === 'timetable' && (
            <>
              <h2 className="content-heading">Time Table</h2>
              <div className="content-line"></div>
              <p>
                The class time table for the current semester is framed as per MSBTE
                guidelines. Students are expected to follow the schedule strictly.
              </p>
              <div className="info-table">
                <div className="info-row">
                  <span className="info-label">College Timing</span>
                  <span className="info-value">8:30 AM – 4:30 PM</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Theory Hours</span>
                  <span className="info-value">8:30 AM – 2:30 PM</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Practical Hours</span>
                  <span className="info-value">2:30 PM – 4:30 PM</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Lunch Break</span>
                  <span className="info-value">12:30 PM – 1:15 PM</span>
                </div>
              </div>
              <p>
                Detailed department-wise time tables are displayed on the notice board
                and can be downloaded from the student portal.
              </p>
            </>
          )}

          {active === 'elearning' && (
            <>
              <h2 className="content-heading">E-Learning</h2>
              <div className="content-line"></div>
              <p>
                The institute provides e-learning facilities to supplement classroom
                teaching. Students can access online study materials, video lectures,
                and assignments through the college portal.
              </p>
              <ul className="vm-list">
                <li>Online study materials and e-books</li>
                <li>Video lectures by faculty members</li>
                <li>Online assignment submission</li>
                <li>Virtual lab simulations</li>
                <li>Discussion forums for student interaction</li>
              </ul>
            </>
          )}

          {active === 'library' && (
            <>
              <h2 className="content-heading">Library</h2>
              <div className="content-line"></div>
              <p>
                The institute library is well-equipped with a large collection of
                books, journals, and reference materials covering all branches of
                engineering. The library is automated with barcode-based issuing system.
              </p>
              <div className="overview-stats">
                <div className="stat-box">
                  <span className="stat-num">15000+</span>
                  <span className="stat-txt">Total Books</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">50+</span>
                  <span className="stat-txt">Journals</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">30+</span>
                  <span className="stat-txt">Magazines</span>
                </div>
                <div className="stat-box">
                  <span className="stat-num">15</span>
                  <span className="stat-txt">Computers</span>
                </div>
              </div>
            </>
          )}

          {active === 'results' && (
            <>
              <h2 className="content-heading">Results</h2>
              <div className="content-line"></div>
              <p>
                The institute has consistently maintained excellent results in MSBTE
                examinations. Our students have been performing above the state
                average pass percentage.
              </p>
              <div className="info-table">
                <div className="info-row">
                  <span className="info-label">MSBTE Pass Percentage</span>
                  <span className="info-value">92% (Winter 2025)</span>
                </div>
                <div className="info-row">
                  <span className="info-label">State Average</span>
                  <span className="info-value">78%</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Top Scorer</span>
                  <span className="info-value">88.5% — Student Name</span>
                </div>
              </div>
              <p>
                Results can be checked on the MSBTE website or through the student
                portal.
              </p>
            </>
          )}

          {active === 'cells' && (
            <>
              <h2 className="content-heading">Cell and Committees</h2>
              <div className="content-line"></div>
              <p>
                Satara Polytechnic, Satara has established various cells and committees to
                ensure the overall development of students, maintain discipline, and address
                grievances. These cells work towards creating a safe, inclusive, and
                supportive learning environment for all students.
              </p>

              {/* Training & Placement Cell */}
              <h3 className="cell-heading">Training & Placement Cell</h3>
              <p>
                The Training & Placement Cell coordinates campus recruitment drives, soft skill
                training, and industry-institute interaction activities. It helps students
                prepare for placements through aptitude training, mock interviews, and group
                discussions.
              </p>
              <table className="cell-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>Mr. Sunil Pawar</td><td>Placement Officer</td><td>+91-9876543210</td></tr>
                  <tr><td>2</td><td>Mr. Ramesh Tooly</td><td>Training Coordinator</td><td>+91-9876543211</td></tr>
                </tbody>
              </table>

              {/* Anti-Ragging Cell */}
              <h3 className="cell-heading">Anti-Ragging Cell</h3>
              <p>
                The Anti-Ragging Cell is constituted as per UGC regulations to prevent
                and address any incidents of ragging within the campus. The cell ensures a
                ragging-free environment and takes strict action against violators.
              </p>
              <table className="cell-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>Mr. Ganesh More</td><td>Chairman</td><td>+91-9876543220</td></tr>
                  <tr><td>2</td><td>Mr. Anil Shinde</td><td>Member</td><td>+91-9876543221</td></tr>
                  <tr><td>3</td><td>Mrs. Sunita Gaikwad</td><td>Member</td><td>+91-9876543222</td></tr>
                </tbody>
              </table>

              {/* Grievance Redressal Cell */}
              <h3 className="cell-heading">Grievance Redressal Cell</h3>
              <p>
                The Grievance Redressal Cell provides a platform for students to report
                complaints and grievances related to academics, infrastructure, or any other
                institutional matters. The cell ensures timely resolution of all complaints.
              </p>
              <table className="cell-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>Mr. Vikram Deshpande</td><td>Chairman</td><td>+91-9876543230</td></tr>
                  <tr><td>2</td><td>Mrs. Asha Bhosale</td><td>Member</td><td>+91-9876543231</td></tr>
                </tbody>
              </table>

              {/* Women Grievance Cell */}
              <h3 className="cell-heading">Women Grievance Cell</h3>
              <p>
                The Women Grievance Cell addresses issues related to women students and
                staff. It works towards creating a safe and empowering environment for
                women on campus.
              </p>
              <table className="cell-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>Mrs. Kavita More</td><td>Chairperson</td><td>+91-9876543240</td></tr>
                  <tr><td>2</td><td>Mrs. Pooja Raut</td><td>Member</td><td>+91-9876543241</td></tr>
                </tbody>
              </table>

              {/* SC/ST Cell */}
              <h3 className="cell-heading">SC/ST Cell</h3>
              <p>
                The SC/ST Cell works for the welfare of students belonging to Scheduled
                Castes and Scheduled Tribes. It ensures proper implementation of
                reservation policies and provides support for scholarships and academic
                assistance.
              </p>
              <table className="cell-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>Mr. Prakash Varne</td><td>Chairman</td><td>+91-9876543250</td></tr>
                  <tr><td>2</td><td>Mr. Nitin Kadam</td><td>Member</td><td>+91-9876543251</td></tr>
                </tbody>
              </table>

              {/* NSS Cell */}
              <h3 className="cell-heading">NSS Cell</h3>
              <p>
                The National Service Scheme (NSS) Cell organizes community service
                activities, blood donation camps, tree plantation drives, and social
                awareness programmes. It encourages students to participate in nation-building
                activities.
              </p>
              <table className="cell-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>Mr. Amit Patil</td><td>Programme Officer</td><td>+91-9876543260</td></tr>
                  <tr><td>2</td><td>Mrs. Sunita Gaikwad</td><td>Member</td><td>+91-9876543261</td></tr>
                </tbody>
              </table>

              {/* Internal Complaint Committee */}
              <h3 className="cell-heading">Internal Complaint Committee</h3>
              <p>
                The Internal Complaint Committee (ICC) is constituted as per the Sexual
                Harassment of Women at Workplace Act. It handles complaints related to
                sexual harassment and ensures a safe working environment.
              </p>
              <table className="cell-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>Mrs. Kavita More</td><td>Chairperson</td><td>+91-9876543270</td></tr>
                  <tr><td>2</td><td>Mrs. Pooja Raut</td><td>Member</td><td>+91-9876543271</td></tr>
                  <tr><td>3</td><td>Mr. Deepak Kulkarni</td><td>Member</td><td>+91-9876543272</td></tr>
                </tbody>
              </table>

              {/* IQAC Cell */}
              <h3 className="cell-heading">IQAC Cell</h3>
              <p>
                The Internal Quality Assurance Cell (IQAC) is established to improve the
                academic and administrative performance of the institute. It coordinates
                quality enhancement activities and ensures compliance with accreditation
                requirements.
              </p>
              <table className="cell-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>Mr. Suresh Jadhav</td><td>Chairman</td><td>+91-9876543280</td></tr>
                  <tr><td>2</td><td>Mr. Rajesh Kumar</td><td>Coordinator</td><td>+91-9876543281</td></tr>
                  <tr><td>3</td><td>Mrs. Asha Bhosale</td><td>Member</td><td>+91-9876543282</td></tr>
                </tbody>
              </table>
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default Academics;
