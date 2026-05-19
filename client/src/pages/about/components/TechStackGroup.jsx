export function TechStackGroup({ group }) {
  return (
    <div className="tech-stack-group">
      <h3>{group.title}</h3>
      <div className="tech-stack-group__items">
        {group.items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  );
}
