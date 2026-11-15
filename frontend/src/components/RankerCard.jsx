import './RankerCard.css';

const initialsOf = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

function RankerCard({ ranker }) {
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
      </div>

      <div className="ranker-divider" />

      <div className="ranker-rank-section">
        <span className="ranker-rank-number">{ranker.rank}</span>
        <h4 className="ranker-rank-title">RANK</h4>
      </div>
    </article>
  );
}

export default RankerCard;
