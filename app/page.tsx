import Image from "next/image";
import ContactForm from "./components/contact-form";
import ProjectBrowser from "./components/project-browser";
import SiteNav from "./components/site-nav";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = (await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
  })).map((project) => ({
    slug: project.slug,
    title: project.title,
    description: project.description,
    technologies: JSON.parse(project.technologies) as string[],
    githubUrl: project.githubUrl,
    demoUrl: project.demoUrl
  }));

  return (
    <main>
      <header className="site-header">
        <SiteNav />
      </header>

      <section id="home" className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">FULL-STACK DEVELOPER &amp; PROBLEM SOLVER</p>
          <h1>Building useful software that solves real problems.</h1>
          <p className="hero-text">
            I&apos;m Diriba Adugna Teka, a Computer Science and Engineering student at ASTU
            and full-stack engineer at BMC Software.
          </p>
          <div className="button-row">
            <a className="button primary" href="#projects">View projects</a>
            <a className="button secondary" href="#contact">Let&apos;s connect</a>
            <span className="button disabled-button" title="Add your CV file to enable this button">
              CV coming soon
            </span>
          </div>
        </div>
        <div className="portrait-wrap">
          <Image
            className="portrait"
            src="/myphoto.JPG"
            alt="Diriba Adugna Teka"
            width={280}
            height={280}
            priority
          />
        </div>
      </section>

      <section id="about" className="section container">
        <p className="eyebrow">ABOUT ME</p>
        <h2>Curiosity today, impact tomorrow.</h2>
        <p className="section-intro">
          I combine competitive programming, full-stack development, and continuous learning
          to turn ideas into practical applications. I care about understanding systems deeply
          and shipping software people can actually use.
        </p>
        <div className="skill-grid">
          <div><strong>Languages</strong><span>Python, Java, JavaScript, C++</span></div>
          <div><strong>Frontend</strong><span>React, Next.js, HTML, CSS</span></div>
          <div><strong>Backend</strong><span>Node.js, APIs, SQL, Prisma</span></div>
          <div><strong>Tools</strong><span>Git, GitHub, Linux, VS Code</span></div>
        </div>
        <div className="experience-card">
          <div className="experience-heading">
            <div>
              <p className="project-number">CURRENTLY</p>
              <h3>Full-Stack Engineer</h3>
            </div>
            <span>BMC Software</span>
          </div>
          <p>
            Building reliable software while studying Computer Science and Engineering
            at Adama Science and Technology University. My work combines practical
            product development with strong foundations in algorithms and system design.
          </p>
        </div>
      </section>

      <section id="projects" className="section container">
        <p className="eyebrow">SELECTED WORK</p>
        <h2>Projects I&apos;m proud of.</h2>
        <ProjectBrowser projects={projects} />
      </section>

      <section className="section stats-section container">
        <p className="eyebrow">PROBLEM SOLVING</p>
        <h2>Always learning, always improving.</h2>
        <div className="stats-grid">
          <a className="stat-card" href="https://codeforces.com/profile/diro15" target="_blank" rel="noreferrer">
            <strong>603</strong>
            <span>Codeforces rating</span>
            <small>100+ problems solved ↗</small>
          </a>
          <a className="stat-card" href="https://leetcode.com/u/everydaaycode/" target="_blank" rel="noreferrer">
            <strong>100+</strong>
            <span>LeetCode problems</span>
            <small>Algorithms and data structures ↗</small>
          </a>
          <div className="stat-card">
            <strong>∞</strong>
            <span>Curiosity</span>
            <small>Learning something new every day</small>
          </div>
        </div>
      </section>

      <section id="contact" className="section contact-section container">
        <div>
          <p className="eyebrow">GET IN TOUCH</p>
          <h2>Have a project in mind?</h2>
          <p className="section-intro">Send a message and I&apos;ll get back to you as soon as possible.</p>
          <div className="social-links">
            <a href="https://github.com/diro25" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/diriba-adugna-4ab337383" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="mailto:diribaaadunyaa@gmail.com">Email</a>
          </div>
        </div>
        <ContactForm />
      </section>

      <footer className="footer">
        <p>© 2026 Diriba Adugna Teka. Built with Next.js.</p>
      </footer>
    </main>
  );
}
