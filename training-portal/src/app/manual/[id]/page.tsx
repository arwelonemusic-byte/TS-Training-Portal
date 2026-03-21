import Link from "next/link";
import { manualRegistry } from "@/data/manuals";
import { testRegistry } from "@/data/tests";
import { parseManualMarkdown } from "@/lib/parseManual";
import MarkdownManual from "@/components/MarkdownManual";
import TableOfContents from "@/components/TableOfContents";

export function generateStaticParams() {
  return Object.keys(manualRegistry).map((id) => ({ id }));
}

export default async function ManualPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const config = manualRegistry[id];

  if (!config) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10 text-center">
        <h1 className="mb-4 text-2xl font-bold text-text-primary">
          Пособие не найдено
        </h1>
        <Link href="/" className="text-accent-red hover:underline">
          Вернуться на главную
        </Link>
      </div>
    );
  }

  const test = testRegistry[config.testId];
  const html = config.markdown ? parseManualMarkdown(config.markdown) : "";

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-text-muted transition-colors hover:text-text-secondary"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        На главную
      </Link>

      <div className="flex gap-10">
        {/* Sidebar TOC — desktop only */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <TableOfContents contentHtml={html} />
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {html ? (
            <MarkdownManual html={html} />
          ) : (
            <p className="text-text-secondary">
              Содержание пособия в разработке.
            </p>
          )}

          {test && (
            <div className="mt-16 rounded-2xl bg-[#FFCA4F] text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '20px' }}>
              <h2 className="text-4xl font-bold text-[#1e1e1e]" style={{ fontFamily: "var(--font-roboto-slab), serif" }}>
                Готовы к тесту?
              </h2>
              <div className="flex flex-col gap-1 text-base font-medium text-[#1e1e1e]">
                <p>
                  {test.questions.length} вопросов по материалам пособия
                </p>
                <p>
                  Необходимо набрать {test.passThreshold} из{" "}
                  {test.questions.length} для прохождения
                </p>
              </div>
              <Link
                href={`/test/${config.testId}`}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-red px-4 py-3.5 text-[13px] font-black text-white transition-all duration-150 hover:bg-[#ff3a50] hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg width="14" height="16" viewBox="0 0 14.4168 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.61197 0.352788C1.16948 -0.474645 0 0.203198 0 1.86558V14.1332C0 15.7973 1.16948 16.4743 2.61197 15.6476L13.3345 9.4983C14.7775 8.67057 14.7775 7.32953 13.3345 6.502L2.61197 0.352788Z" fill="white"/>
                </svg>
                Начать тест
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
