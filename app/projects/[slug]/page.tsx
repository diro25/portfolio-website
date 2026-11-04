import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug, published: true } });
  if (!project) notFound();

  return (
    <main className="detail-page">
      <div className="container">
        <Link className="back-link" href="/#projects">← Back to projects</Link>
        <p className="eyebrow">PROJECT DETAILS</p>
        <h1>{project.title}</h1>
        <p className="detail-lead">{project.description}</p>
        <div className="tags">{JSON.parse(project.technologies).map((item: string) => <span key={item}>{item}</span>)}</div>
        <div className="detail-content"><p>{project.details}</p></div>
        <div className="button-row">
          {project.githubUrl && <a className="button primary" href={project.githubUrl} target="_blank" rel="noreferrer">View source ↗</a>}
          {project.demoUrl && <a className="button secondary" href={project.demoUrl} target="_blank" rel="noreferrer">Live demo ↗</a>}
        </div>
      </div>
    </main>
  );
}
