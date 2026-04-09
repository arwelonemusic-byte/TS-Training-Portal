import { marked, Renderer } from "marked";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function createRenderer(): Renderer {
  const renderer = new Renderer();

  // Headings with auto-generated IDs
  renderer.heading = function ({ text, depth }) {
    const id = slugify(text);
    const tag = `h${depth}`;
    return `<${tag} id="${id}">${text}</${tag}>\n`;
  };

  // Callouts
  renderer.blockquote = function (token) {
    let inner = (token.text || token.raw || "").trim();
    inner = inner.replace(/^<blockquote>\n?/, "").replace(/<\/blockquote>\n?$/, "").trim();
    inner = inner.replace(/^&gt;\s*/gm, "").replace(/^>\s*/gm, "");

    let variant = "info";
    if (inner.includes("⚠")) {
      variant = "warning";
      inner = inner.replace(/⚠\s*/g, "");
    } else if (inner.includes("🔴")) {
      variant = "important";
      inner = inner.replace(/🔴\s*/g, "");
    }

    const parsedInner = marked.parse(inner) as string;
    return `<div class="callout callout-${variant}">${parsedInner}</div>\n`;
  };

  // Code blocks
  renderer.code = function ({ text, lang }) {
    if (lang === "example") {
      const lines = text.split("\n").filter((l) => l.trim());
      const html = lines
        .map((l) => `<p class="example-line">${l}</p>`)
        .join("\n");
      return `<div class="example-block">${html}</div>\n`;
    }

    if (lang === "steps") {
      const steps = text.split("\n").filter((l) => l.trim());
      const html = steps.map((s) => `<li>${s}</li>`).join("\n");
      return `<ol class="procedure-block">${html}</ol>\n`;
    }

    return `<pre><code class="language-${lang || ""}">${text}</code></pre>\n`;
  };

  return renderer;
}

function preprocessFormations(md: string): string {
  const regex = /:::formation\[([^\]]+)\]\{name="([^"]+)"\}\n([\s\S]*?):::/g;

  return md.replace(regex, (_match, gif: string, name: string, body: string) => {
    const lines = body.trim().split("\n");
    const descLines: string[] = [];
    const pros: string[] = [];
    const cons: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("+ ")) {
        pros.push(trimmed.slice(2));
      } else if (trimmed.startsWith("- ")) {
        cons.push(trimmed.slice(2));
      } else if (trimmed) {
        descLines.push(trimmed);
      }
    }

    const prosHtml = pros
      .map((p) => `<li><span class="formation-badge formation-pro">+</span>${p}</li>`)
      .join("");
    const consHtml = cons
      .map((c) => `<li><span class="formation-badge formation-con">−</span>${c}</li>`)
      .join("");

    return `<div class="formation-card">
<div class="formation-img"><img src="/animations/${gif}" alt="${name}" /></div>
<h4 class="formation-name">${name}</h4>
<p class="formation-desc">${descLines.join(" ")}</p>
<div class="formation-grid">
<div><h5 class="formation-pros-title">Плюсы</h5><ul class="formation-pros">${prosHtml}</ul></div>
<div><h5 class="formation-cons-title">Минусы</h5><ul class="formation-cons">${consHtml}</ul></div>
</div>
</div>`;
  });
}

function preprocessYouTube(md: string): string {
  return md.replace(
    /:::youtube\[([^\]]+)\]/g,
    (_match, videoId: string) =>
      `<div class="video-embed"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`,
  );
}

export function parseManualMarkdown(content: string): string {
  let preprocessed = preprocessFormations(content);
  preprocessed = preprocessYouTube(preprocessed);
  const renderer = createRenderer();
  marked.setOptions({ gfm: true, breaks: false });
  marked.use({ renderer });
  let result = marked.parse(preprocessed) as string;
  result = result.replace(/<p>(<div[^>]*>[\s\S]*?<\/div>\s*<\/div>)<\/p>/g, "$1");
  result = result.replace(/<p>(<div[\s\S]*?<\/div>)<\/p>/g, "$1");
  return result;
}
