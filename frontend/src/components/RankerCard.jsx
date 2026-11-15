import './RankerCard.css';

const ROMAN = { 1: 'I', 2: 'II', 3: 'III' };

const initialsOf = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

function RankerCard({ ranker }) {
  const roman = ROMAN[ranker.rank] || String(ranker.rank || '');
  const meta = [ranker.year, ranker.score].filter(Boolean).join(' • ');

  return (
    <article
      className="ranker-card"
      aria-label={`Rank ${ranker.rank}: ${ranker.name}`}
    >
      <div className="ranker-profile-section">
        <div className="ranker-dots-bg" aria-hidden="true" />

        <div className="ranker-profile-image">
          {ranker.photo ? (
            <img src={ranker.photo} alt={ranker.name} />
          ) : (
            <span>{initialsOf(ranker.name) || '?'}</span>
          )}
        </div>

        <h3 className="ranker-student-name" title={ranker.name}>
          {ranker.name}
        </h3>

        {ranker.branch && (
          <p className="ranker-department" title={ranker.branch}>
            {ranker.branch}
          </p>
        )}

        {meta && <p className="ranker-meta-line">{meta}</p>}
      </div>

      <div className="ranker-divider" />

      <div className="ranker-rank-section">
        <div className="ranker-emblem">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M45 91 C20 82 10 57 18 29" />
              <path d="M55 91 C80 82 90 57 82 29" />
            </g>

            <g fill="currentColor">
              <path d="M43 86 Q29 88 25 76 Q38 76 43 86Z" />
              <path d="M32 78 Q18 77 16 64 Q29 67 32 78Z" />
              <path d="M24 66 Q11 60 13 47 Q25 52 24 66Z" />
              <path d="M19 52 Q9 43 15 31 Q24 41 19 52Z" />
              <path d="M18 38 Q13 26 23 18 Q27 30 18 38Z" />

              <path d="M39 79 Q26 72 29 60 Q41 66 39 79Z" />
              <path d="M30 65 Q18 56 23 44 Q34 53 30 65Z" />
              <path d="M23 49 Q17 37 26 28 Q32 40 23 49Z" />

              <path d="M57 86 Q71 88 75 76 Q62 76 57 86Z" />
              <path d="M68 78 Q82 77 84 64 Q71 67 68 78Z" />
              <path d="M76 66 Q89 60 87 47 Q75 52 76 66Z" />
              <path d="M81 52 Q91 43 85 31 Q76 41 81 52Z" />
              <path d="M82 38 Q87 26 77 18 Q73 30 82 38Z" />

              <path d="M61 79 Q74 72 71 60 Q59 66 61 79Z" />
              <path d="M70 65 Q82 56 77 44 Q66 53 70 65Z" />
              <path d="M77 49 Q83 37 74 28 Q68 40 77 49Z" />

              <path d="M50 5 L53 12 L61 13 L55 18 L57 26 L50 21 L43 26 L45 18 L39 13 L47 12 Z" />
            </g>

            <g fill="currentColor">
              <circle cx="50" cy="29" r="1.5" />
              <circle cx="50" cy="93" r="1.5" />
            </g>
          </svg>

          <span className={`ranker-number${roman.length > 1 ? ' ranker-number-multi' : ''}`}>
            {roman}
          </span>
        </div>

        <h4 className="ranker-rank-title">RANK</h4>
      </div>
    </article>
  );
}

export default RankerCard;
