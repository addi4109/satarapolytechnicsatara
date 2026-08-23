import './WelcomeSection.css';

function WelcomeSection() {
  return (
    <section className="welcome-section">
      <div className="welcome-inner">
        <div className="welcome-image">
          <img
            src="https://www.satarapolytechnicsatara.com/assets/std1-DtQ9UsRF.png"
            alt="Students studying together"
          />
        </div>
        <div className="welcome-content">
          <h2 className="welcome-heading">The Cradle of Achievers</h2>
          <div className="welcome-line"></div>
          <p className="welcome-text">
            In the early 1980s, establishing non-grant technical education in
            semi-urban regions like Satara was a formidable challenge. Access to
            quality professional education was limited, and the philosophy of
            self-financed institutions was still in its infancy. During this
            crucial period, with the blessings and guidance of Hon. Shri K. S.
            Patil (Ex. MLA), the foundation of our institute was laid in 1983
            under the aegis of Satara Education Society.
          </p>
          <a href="/about" className="welcome-btn">Read More</a>
        </div>
      </div>
    </section>
  );
}

export default WelcomeSection;
