"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Project = {
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string | null;
  demoUrl: string | null;
};

export default function ProjectBrowser({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [technology, setTechnology] = useState("All");
  const technologies = ["All", ...new Set(projects.flatMap((project) => project.technologies))];
  const filteredProjects = useMemo(() => projects.filter((project) => {
    const matchesQuery = `${project.title} ${project.description}`.toLowerCase().includes(query.toLowerCase());
    const matchesTechnology = technology === "All" || project.technologies.includes(technology);
    return matchesQuery && matchesTechnology;
  }), [projects, query, technology]);

  return (
    <>
      <div className="project-controls">
        <input
          aria-label="Search projects"
          placeholder="Search projects..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select aria-label="Filter projects by technology" value={technology} onChange={(event) => setTechnology(event.target.value)}>
          {technologies.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="project-grid">
        {filteredProjects.map((project, index) => (
          <article className="project-card" key={project.slug}>
            <p className="project-number">0{index + 1}</p>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="tags">{project.technologies.map((item) => <span key={item}>{item}</span>)}</div>
            <div className="project-actions">
              <Link href={`/projects/${project.slug}`}>View details →</Link>
              {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a>}
            </div>
          </article>
        ))}
      </div>
      {filteredProjects.length === 0 && <p className="empty-state">No projects match your search.</p>}
    </>
  );
}
