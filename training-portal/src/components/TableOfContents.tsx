"use client";

import { useEffect, useState, useMemo } from "react";

interface TocEntry {
  id: string;
  text: string;
}

export default function TableOfContents({ contentHtml }: { contentHtml: string }) {
  const [activeId, setActiveId] = useState("");

  // Extract h2 headings from the rendered HTML
  const entries: TocEntry[] = useMemo(() => {
    const regex = /<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/gi;
    const results: TocEntry[] = [];
    let match;
    while ((match = regex.exec(contentHtml)) !== null) {
      results.push({
        id: match[1],
        text: match[2].replace(/<[^>]*>/g, ""), // strip any inner HTML tags
      });
    }
    return results;
  }, [contentHtml]);

  useEffect(() => {
    if (entries.length === 0) return;

    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );

    entries.forEach((entry) => {
      const el = document.getElementById(entry.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [entries]);

  if (entries.length < 2) return null;

  return (
    <nav className="sticky top-20 space-y-0.5">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
        Содержание
      </p>
      {entries.map((entry) => (
        <a
          key={entry.id}
          href={`#${entry.id}`}
          className={`block rounded-md px-2.5 py-1.5 text-xs transition-colors ${
            activeId === entry.id
              ? "bg-white text-[#1e1e1e] font-medium"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {entry.text}
        </a>
      ))}
    </nav>
  );
}
