import './ContactMap.css';

function ContactMap() {
  return (
    <section className="contact-section">
      <div className="contact-inner">
        <div className="contact-left">
          <h2 className="contact-name">Satara Polytechnic Satara</h2>
          <p className="contact-society">Satara Education Society's</p>
          <p className="contact-desc">
            With a legacy of over 40 years, SPS, Satara is one of the best
            Diploma engineering colleges in Satara, with a meritorious track
            record in academics, placements, and holistic growth, making it a
            veritable Cradle of Achievers.
          </p>
          <div className="contact-info">
            <h3 className="contact-label">Location</h3>
            <p className="contact-detail">
              Satara Polytechnic Satara, Sonegaon Tarf Satara, near NH - 4, near Khindwadi, Sonegaon Tarf Satara, Maharashtra 415519
            </p>
          </div>
          <div className="contact-info">
            <h3 className="contact-label">Office Hours</h3>
            <p className="contact-detail">11 AM – 5 PM</p>
          </div>
        </div>
        <div className="contact-right">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3824.123456789!2d73.9985563!3d17.6458608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc239d3e0b5e5e5%3A0x1234567890abcdef!2sSatara%20Polytechnic!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="College Location"
          ></iframe>
        </div>
      </div>
    </section>
  );
}

export default ContactMap;
