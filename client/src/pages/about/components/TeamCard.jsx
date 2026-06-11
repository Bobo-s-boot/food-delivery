export function TeamCard({ member, index }) {
  return (
    <article className="team-card">
      <div className="team-card__image">
        <img src={member.image} alt={member.name} />
        <span className="team-card__counter">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="team-card__details">
        <div>
          <p className="team-card__role">{member.role}</p>
          <h3>{member.name}</h3>
        </div>

        <p className="team-card__summary">{member.summary}</p>
      </div>

      <div className="team-card__extra">
        <p>{member.details[0]}</p>
      </div>
    </article>
  );
}
