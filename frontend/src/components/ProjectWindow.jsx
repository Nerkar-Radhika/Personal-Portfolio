import "./ProjectWindow.css";

function ProjectWindow({ project }) {
  return (
    <div className="project-window">
      <h2>{project.name}</h2>
      <p className="project-tagline">{project.tagline}</p>

      <p className="project-description">{project.description}</p>

      {project.stack.length > 0 && (
        <>
          <h3>Tech stack</h3>
          <div className="project-stack">
            {project.stack.map((tech) => (
              <span key={tech} className="stack-chip">
                {tech}
              </span>
            ))}
          </div>
        </>
      )}

      {project.notes.length > 0 && (
        <>
          <h3>Notes</h3>
          <ul className="project-notes">
            {project.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default ProjectWindow;