import { ManualSection as ManualSectionType, ContentBlock } from "@/types";
import FormationCard from "./FormationCard";

function renderBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={index} className="mb-4 text-text-primary leading-relaxed">
          {block.text}
        </p>
      );

    case "heading":
      if (block.level === 2) {
        return (
          <h2 key={index} className="mb-4 mt-8 text-2xl font-bold text-text-primary">
            {block.text}
          </h2>
        );
      }
      return (
        <h3 key={index} className="mb-3 mt-6 text-lg font-semibold text-text-primary">
          {block.text}
        </h3>
      );

    case "list":
      const ListTag = block.ordered ? "ol" : "ul";
      return (
        <ListTag
          key={index}
          className={`mb-4 space-y-2 pl-6 ${
            block.ordered ? "list-decimal" : "list-disc"
          } marker:text-accent-green`}
        >
          {block.items.map((item, i) => (
            <li key={i} className="text-text-primary">
              {item}
            </li>
          ))}
        </ListTag>
      );

    case "callout": {
      const styles = {
        info: "border-accent-green bg-accent-green/10",
        warning: "border-accent-amber bg-accent-amber/10",
        important: "border-accent-red bg-accent-red/10",
      };
      return (
        <div
          key={index}
          className={`mb-4 rounded-r-lg border-l-4 p-4 ${styles[block.variant]}`}
        >
          <p className="text-text-primary">{block.text}</p>
        </div>
      );
    }

    case "formation":
      return (
        <FormationCard
          key={index}
          name={block.name}
          gif={block.gif}
          description={block.description}
          pros={block.pros}
          cons={block.cons}
        />
      );

    case "table":
      return (
        <div key={index} className="mb-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border-military bg-bg-card">
                {block.headers.map((header, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left font-semibold text-accent-green-light"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr
                  key={ri}
                  className={`border-b border-border-military ${
                    ri % 2 === 0 ? "bg-bg-card/50" : ""
                  }`}
                >
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 text-text-primary">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "example":
      return (
        <div key={index} className="mb-4 space-y-2 rounded-lg bg-bg-card p-4">
          {block.lines.map((line, i) => (
            <p key={i} className="font-mono text-sm text-accent-green-light italic">
              {line}
            </p>
          ))}
        </div>
      );

    case "procedure":
      return (
        <div key={index} className="mb-4 space-y-3">
          {block.steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-green/20 text-sm font-bold text-accent-green-light">
                {i + 1}
              </span>
              <p className="pt-0.5 text-text-primary">{step}</p>
            </div>
          ))}
        </div>
      );
  }
}

interface ManualSectionProps {
  section: ManualSectionType;
}

export default function ManualSection({ section }: ManualSectionProps) {
  return (
    <section id={section.id} className="scroll-mt-20">
      <h2 className="mb-6 border-b border-border-military pb-3 text-2xl font-bold text-text-primary">
        {section.title}
      </h2>
      {section.content.map((block, i) => renderBlock(block, i))}
    </section>
  );
}
