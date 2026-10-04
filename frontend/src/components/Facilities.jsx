import './Facilities.css';

function Facilities() {
  return (
    <section className="facilities-section" data-reveal="fade">
      <div className="facilities-inner">
        <img
          className="facilities-image"
          src="/facilities.png"
          alt="Campus facilities: Library, Bus Facility, Canteen, Equal Opportunity Center, Center of Excellence and Wi-Fi Campus"
          loading="lazy"
        />
      </div>
    </section>
  );
}

export default Facilities;
