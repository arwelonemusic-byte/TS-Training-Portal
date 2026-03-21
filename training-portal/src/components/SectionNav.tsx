"use client";

import { useEffect, useState } from "react";
import { ManualSection } from "@/types";

interface SectionNavProps {
  sections: ManualSection[];
}

export default function SectionNav({ sections }: SectionNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="sticky top-20 space-y-1">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
        Содержание
      </p>
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={`block rounded px-3 py-1.5 text-sm transition-colors ${
            activeId === s.id
              ? "bg-accent-green/15 text-accent-green-light font-medium"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {s.title}
        </a>
      ))}
    </nav>
  );
}
