"use client";

import { FormEvent, useEffect, useState } from "react";

type Project = {
  id: number;
  slug: string;
  title: string;
  description: string;
  details: string;
  technologies: string[];
  githubUrl: string | null;
  demoUrl: string | null;
  featured: boolean;
  published: boolean;
};

const emptyProject = {
  slug: "",
  title: "",
  description: "",
  details: "",
  technologies: "",
  githubUrl: "",
  demoUrl: "",
  featured: false,
  published: true
};

export default function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState(emptyProject);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadProjects() {
    const response = await fetch("/api/projects");
    const data = await response.json();
    setProjects(data.projects);
    setLoading(false);
  }

  useEffect(() => { void loadProjects(); }, []);

  function updateField(field: string, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function editProject(project: Project) {
    setEditingId(project.id);
    setForm({
      slug: project.slug,
      title: project.title,
      description: project.description,
      details: project.details,
      technologies: project.technologies.join(", "),
      githubUrl: project.githubUrl ?? "",
      demoUrl: project.demoUrl ?? "",
      featured: project.featured,
      published: project.published
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const response = await fetch(editingId ? `/api/projects/${editingId}` : "/api/projects", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        technologies: form.technologies.split(",").map((item) => item.trim()).filter(Boolean)
      })
    });
    const result = await response.json();
    if (!response.ok) {
      setStatus(result.message ?? "Could not save project.");
      return;
    }
    setStatus(editingId ? "Project updated." : "Project created.");
    setForm(emptyProject);
    setEditingId(null);
    await loadProjects();
  }

  async function deleteProject(id: number) {
    if (!window.confirm("Delete this project permanently?")) return;
    const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (response.ok) {
      setProjects((current) => current.filter((project) => project.id !== id));
      setStatus("Project deleted.");
    }
  }

  return (
    <section className="admin-projects">
      <div className="admin-section-heading">
        <div>
          <p className="eyebrow">PROJECT MANAGEMENT</p>
          <h2>{editingId ? "Edit project" : "Add a project"}</h2>
        </div>
        {editingId && <button className="text-button" onClick={() => { setEditingId(null); setForm(emptyProject); }}>Cancel editing</button>}
      </div>
      <form className="project-form" onSubmit={submit}>
        <div className="form-two-column">
          <label>Title<input required value={form.title} onChange={(event) => updateField("title", event.target.value)} /></label>
          <label>URL slug<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(event) => updateField("slug", event.target.value)} /></label>
        </div>
        <label>Short description<input required value={form.description} onChange={(event) => updateField("description", event.target.value)} /></label>
        <label>Full details<textarea required rows={4} value={form.details} onChange={(event) => updateField("details", event.target.value)} /></label>
        <label>Technologies <span className="field-hint">(comma separated)</span><input required value={form.technologies} onChange={(event) => updateField("technologies", event.target.value)} /></label>
        <div className="form-two-column">
          <label>GitHub URL<input type="url" value={form.githubUrl} onChange={(event) => updateField("githubUrl", event.target.value)} /></label>
          <label>Demo URL<input type="url" value={form.demoUrl} onChange={(event) => updateField("demoUrl", event.target.value)} /></label>
        </div>
        <div className="checkbox-row">
          <label><input type="checkbox" checked={form.featured} onChange={(event) => updateField("featured", event.target.checked)} /> Featured</label>
          <label><input type="checkbox" checked={form.published} onChange={(event) => updateField("published", event.target.checked)} /> Published</label>
        </div>
        <button className="button primary" type="submit">{editingId ? "Update project" : "Create project"}</button>
        {status && <p className="form-status" role="status">{status}</p>}
      </form>

      <div className="admin-list">
        <h2>All projects</h2>
        {loading ? <p>Loading projects...</p> : projects.map((project) => (
          <article className="admin-project-row" key={project.id}>
            <div>
              <strong>{project.title}</strong>
              <p>{project.technologies.join(" · ")}</p>
            </div>
            <div className="row-status">
              <span className={project.published ? "status-published" : "status-draft"}>{project.published ? "Published" : "Draft"}</span>
              {project.featured && <span className="status-featured">Featured</span>}
            </div>
            <div className="row-actions">
              <button className="text-button" onClick={() => editProject(project)}>Edit</button>
              <button className="text-button danger" onClick={() => void deleteProject(project.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
