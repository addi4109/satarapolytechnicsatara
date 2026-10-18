import { useState, useEffect } from 'react';
import { SkeletonCards } from '../components/Skeleton';
import PageBanner from '../components/PageBanner';
import SEO, { breadcrumbSchema } from '../components/SEO';
import API_URL from '../lib/api';
import './Events.css';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/events`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      <SEO
        title="Events & Competitions | Satara Polytechnic, Satara"
        description="Events, fests and competitions at Satara Polytechnic, Satara — event posters, descriptions, competition rules and online registration forms."
        keywords="Satara Polytechnic events, tech fest, college competitions, technical events, cultural events polytechnic"
        url="/events"
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Events' },
        ])}
      />
      <PageBanner
        title="Events"
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            Events
          </>
        }
      />

      <div className="events-page-wrap">
        {loading ? (
          <SkeletonCards count={4} />
        ) : events.length === 0 ? (
          <div className="events-empty">
            <p>No events announced yet. Stay tuned!</p>
          </div>
        ) : (
          events.map((event) => (
            <article className="event-card" key={event._id} data-reveal>
              <div className="event-poster-col">
                {event.posterUrl ? (
                  <img
                    className="event-poster"
                    src={event.posterUrl}
                    alt={`${event.title} poster`}
                    loading="lazy"
                  />
                ) : (
                  <div className="event-poster event-poster-placeholder">
                    <span aria-hidden="true">🎉</span>
                  </div>
                )}
              </div>

              <div className="event-details-col">
                <h2 className="event-title">{event.title}</h2>

                {(event.date || event.venue) && (
                  <div className="event-meta">
                    {event.date && (
                      <span className="event-meta-item">
                        <span aria-hidden="true">📅</span> {event.date}
                      </span>
                    )}
                    {event.venue && (
                      <span className="event-meta-item">
                        <span aria-hidden="true">📍</span> {event.venue}
                      </span>
                    )}
                  </div>
                )}

                {event.description && <p className="event-desc">{event.description}</p>}

                {event.competitions?.length > 0 && (
                  <div className="event-competitions">
                    <h3 className="event-section-title">Competitions</h3>
                    {event.competitions.map((comp, i) => (
                      <div className="comp-card" key={i}>
                        <button
                          type="button"
                          className="comp-header"
                          onClick={() => toggle(`${event._id}-${i}`)}
                          aria-expanded={!!expanded[`${event._id}-${i}`]}
                        >
                          <span className="comp-title">{comp.title}</span>
                          {comp.rules?.length > 0 && (
                            <span className="comp-toggle" aria-hidden="true">
                              {expanded[`${event._id}-${i}`] ? '−' : '+'}
                            </span>
                          )}
                        </button>

                        {comp.description && <p className="comp-desc">{comp.description}</p>}

                        {expanded[`${event._id}-${i}`] && comp.rules?.length > 0 && (
                          <ul className="comp-rules">
                            {comp.rules.map((rule, ri) => (
                              <li key={ri}>{rule}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {event.googleFormUrl && (
                  <a
                    className="event-register-btn"
                    href={event.googleFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Register — Google Form
                  </a>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </>
  );
}

export default Events;
