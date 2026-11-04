"use client";

import { useEffect, useState } from "react";

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme ? savedTheme === "dark" : prefersDark;
    setDark(isDark);
    document.body.classList.toggle("dark-mode", isDark);
  }, []);

  function toggleTheme() {
    const nextTheme = !dark;
    setDark(nextTheme);
    document.body.classList.toggle("dark-mode", nextTheme);
    localStorage.setItem("theme", nextTheme ? "dark" : "light");
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <nav className="nav container" aria-label="Main navigation">
      <a className="logo" href="#home" onClick={closeMenu}>DA.dev</a>
      <button
        className="menu-toggle"
        aria-expanded={open}
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen(!open)}
      >
        {open ? "×" : "☰"}
      </button>
      <div className={`nav-links ${open ? "nav-open" : ""}`}>
        <a href="#about" onClick={closeMenu}>About</a>
        <a href="#projects" onClick={closeMenu}>Projects</a>
        <a href="/blog" onClick={closeMenu}>Blog</a>
        <a href="#contact" onClick={closeMenu}>Contact</a>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle color theme">
          {dark ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}
