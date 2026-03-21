"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { testRegistry } from "@/data/tests";

interface ResultDetail {
  questionText: string;
  selectedText: string;
  isCorrect: boolean;
}

function useResults() {
  const searchParams = useSearchParams();
  const testId = searchParams.get("test") ?? "rifleman";
  const isServerGraded = searchParams.get("server") === "1";

  const config = testRegistry[testId];

  if (!config) return null;

  // Server-graded mode: read from sessionStorage
  if (isServerGraded) {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem("lastTestResult") : null;
    if (stored) {
      const result = JSON.parse(stored);
      if (result.testId === testId) {
        const details: ResultDetail[] = (result.details ?? []).map((d: { question: string; selectedText: string; isCorrect: boolean }) => ({
          questionText: d.question,
          selectedText: d.selectedText,
          isCorrect: d.isCorrect,
        }));
        return {
          testId,
          title: config.title,
          manualId: config.manualId,
          score: result.score as number,
          total: result.total as number,
          passed: result.passed as boolean,
          details,
        };
      }
    }
  }

  // Mock/fallback mode: client-side grading from URL params
  const raw = searchParams.get("a") ?? "";
  const userAnswers = raw.split(",");
  const { questions, passThreshold } = config;

  const details: ResultDetail[] = questions.map((q, i) => {
    const selectedKey = userAnswers[i] ?? "";
    return {
      questionText: q.question,
      selectedText: q.options.find((o) => o.key === selectedKey)?.text ?? "—",
      isCorrect: selectedKey === q.correctKey,
    };
  });

  const score = details.filter((d) => d.isCorrect).length;

  return {
    testId,
    title: config.title,
    manualId: config.manualId,
    score,
    total: questions.length,
    passed: score >= passThreshold,
    details,
  };
}

function ResultsContent() {
  const data = useResults();

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10 text-center">
        <h1 className="mb-4 text-2xl font-bold text-text-primary">
          Тест не найден
        </h1>
        <Link href="/" className="text-accent-red hover:underline">
          Вернуться на главную
        </Link>
      </div>
    );
  }

  const { title, manualId, score, total, passed, details } = data;
  const correctCount = score;

  useEffect(() => {
    if (!passed) return;
    const end = Date.now() + 1500;
    const colors = ["#FFCA4F", "#76e176", "#E13346", "#ffffff"];
    (function frame() {
      confetti({ particleCount: 2, angle: 60, spread: 70, origin: { x: 0 }, colors });
      confetti({ particleCount: 2, angle: 120, spread: 70, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, [passed]);

  return (
    <div className="mx-auto px-6" style={{ maxWidth: '640px', paddingTop: '49px', paddingBottom: '49px' }}>
      {/* Banner */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          padding: '20px',
          borderRadius: '16px',
          backgroundColor: '#2a2a2a',
          textAlign: 'center',
        }}
      >
        {/* Icon */}
        {passed ? (
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip-medal)">
              <path d="M18.927 27.6691L4.95044 54.0014L17.6424 52.8289L23.7853 63.9981L37.7618 37.6658L18.927 27.6691Z" fill="#E95454"/>
              <path d="M20.5285 56.3307C20.9207 55.4883 20.5105 54.4818 19.6901 54.0456L18.8857 53.6174C18.0814 53.1592 17.7752 52.1407 18.2134 51.3163C18.6576 50.4779 19.7021 50.1578 20.5405 50.602L22.8136 51.8086C23.5159 52.1807 24.3963 51.9106 24.7585 51.2043L24.8145 51.0962C25.2307 50.4299 24.9846 49.5495 24.2923 49.1833L17.4931 45.5756C16.6647 45.1354 16.2585 44.133 16.6447 43.2886C17.0709 42.3901 18.1474 42.036 19.0138 42.4962L25.3207 45.8438C26.0231 46.2159 26.9035 45.9458 27.2757 45.2435L27.3117 45.1514L27.3217 45.1314C27.7239 44.3951 27.4417 43.4706 26.6994 43.0765L23.1617 41.1996C22.3333 40.7594 21.9272 39.7569 22.3193 38.9025C22.7415 38.0141 23.822 37.6499 24.6884 38.1101L28.5963 40.1851C29.3266 40.5733 30.199 40.2491 30.5772 39.5128C30.5832 39.5028 30.5832 39.5028 30.5872 39.4928C30.5932 39.4828 30.5932 39.4828 30.5972 39.4728C30.9954 38.7464 30.7753 37.842 30.043 37.4558L25.827 35.2188C25.0086 34.7846 24.6024 33.7821 24.9886 32.9377C25.4148 32.0393 26.4913 31.6851 27.3577 32.1453L37.7586 37.6659L23.782 63.9983L19.9302 56.997C20.1783 56.8289 20.3944 56.6208 20.5285 56.3307Z" fill="#ED6362"/>
              <path d="M45.0719 27.6693L59.0484 54.0016L46.3565 52.829L40.2136 63.9983L26.2371 37.6659L45.0719 27.6693Z" fill="#ED6362"/>
              <path d="M43.4706 56.3305C43.0784 55.4881 43.4886 54.4817 44.309 54.0455L45.1133 53.6173C45.9177 53.159 46.2239 52.1406 45.7857 51.3162C45.3414 50.4778 44.297 50.1576 43.4586 50.6018L41.1855 51.8084C40.4832 52.1806 39.6028 51.9105 39.2406 51.2041L39.1846 51.0961C38.7684 50.4298 39.0145 49.5494 39.7068 49.1832L46.508 45.5735C47.3364 45.1333 47.7426 44.1308 47.3564 43.2864C46.9302 42.388 45.8537 42.0338 44.9873 42.494L38.6803 45.8416C37.978 46.2138 37.0976 45.9437 36.7254 45.2413L36.6894 45.1493L36.6794 45.1293C36.2772 44.3929 36.5593 43.4685 37.3017 43.0743L40.8393 41.1974C41.6677 40.7572 42.0739 39.7548 41.6817 38.9004C41.2595 38.0119 40.179 37.6478 39.3126 38.108L35.4008 40.187C34.6704 40.5751 33.798 40.251 33.4199 39.5147C33.4139 39.5046 33.4139 39.5046 33.4099 39.4946C33.4039 39.4846 33.4039 39.4846 33.3999 39.4746C33.0017 38.7483 33.2218 37.8439 33.9541 37.4577L38.1701 35.2206C38.9885 34.7864 39.3947 33.784 39.0085 32.9396C38.5823 32.0411 37.5058 31.687 36.6394 32.1472L26.2385 37.6678L40.215 64.0001L44.0669 56.9988C43.8207 56.8288 43.6046 56.6207 43.4706 56.3305Z" fill="#E95454"/>
              <circle cx="31.9992" cy="23.3531" r="23.353" fill="#FFCC5B"/>
              <path d="M31.9991 40.0209C22.8068 40.0209 15.3293 32.5414 15.3293 23.3511C15.3293 14.1608 22.8068 6.68325 31.9991 6.68325C41.1915 6.68325 48.669 14.1628 48.669 23.3531C48.669 32.5434 41.1915 40.0209 31.9991 40.0209Z" fill="#FFDB70"/>
              <path d="M43.6365 19.6613H35.5287L33.0215 11.9497C32.6994 10.9592 31.2967 10.9592 30.9745 11.9497L28.4694 19.6613H20.3616C19.3191 19.6613 18.8849 20.9959 19.7293 21.6082L26.2883 26.3745L23.7832 34.0861C23.461 35.0765 24.5956 35.9009 25.4399 35.2886L31.999 30.5224L38.5581 35.2886C39.4025 35.9009 40.537 35.0765 40.2149 34.0861L37.7097 26.3745L44.2688 21.6082C45.1112 20.9959 44.679 19.6613 43.6365 19.6613Z" fill="#EC9922"/>
            </g>
            <defs>
              <clipPath id="clip-medal"><rect width="64" height="64" fill="white"/></clipPath>
            </defs>
          </svg>
        ) : (
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(5 5)">
              <path d="M27 0C12.0867 0 0 12.0867 0 27C0 41.9133 12.0867 54 27 54C41.9133 54 54 41.9133 54 27C54 12.0867 41.9133 0 27 0ZM37.0723 32.073C38.4539 33.4547 38.4539 35.6906 37.0723 37.0723C35.6906 38.4539 33.4547 38.4539 32.073 37.0723L27 31.9992L21.927 37.0723C20.5453 38.4539 18.3094 38.4539 16.9277 37.0723C15.5461 35.6906 15.5461 33.4547 16.9277 32.073L22.0008 27L16.9277 21.927C15.5461 20.5453 15.5461 18.3094 16.9277 16.9277C18.3094 15.5461 20.5453 15.5461 21.927 16.9277L27 22.0008L32.073 16.9277C33.4547 15.5461 35.6906 15.5461 37.0723 16.9277C38.4539 18.3094 38.4539 20.5453 37.0723 21.927L31.9992 27L37.0723 32.073Z" fill="url(#paint-fail)"/>
            </g>
            <defs>
              <linearGradient id="paint-fail" x1="-0.215" y1="-0.215" x2="52.144" y2="52.144" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FD7F60"/><stop offset="1" stopColor="#FA262A"/>
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* Title + subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
          <p
            className="font-medium"
            style={{ fontSize: '16px', lineHeight: '22px', color: 'rgba(255,255,255,0.3)' }}
          >
            {title}
          </p>
          <h1
            className="font-bold"
            style={{
              fontFamily: "'Roboto Slab', serif",
              fontSize: '36px',
              color: 'white',
            }}
          >
            {passed ? "Тест пройден!" : "Тест не пройден :("}
          </h1>
        </div>

        {/* Score */}
        <p
          className="font-bold"
          style={{
            fontFamily: "'Roboto Slab', serif",
            fontSize: '36px',
            color: passed ? '#76e176' : '#E13346',
          }}
        >
          {correctCount} / {total}
        </p>
      </div>

      {/* Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '32px' }}>
        {details.map((d, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              padding: '20px',
              borderRadius: '8px',
              backgroundColor: '#2a2a2a',
            }}
          >
            {/* Status badge */}
            <span
              className="shrink-0 font-bold"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: d.isCorrect ? '#3a9e5c' : '#E13346',
                color: 'white',
              }}
            >
              {d.isCorrect ? "✓" : "✗"}
            </span>

            {/* Question + answer */}
            <div style={{ flex: '1 1 0', paddingTop: '5px', paddingBottom: '5px' }}>
              <p
                className="font-medium"
                style={{ fontSize: '16px', lineHeight: '22px', color: 'white' }}
              >
                {d.questionText}
              </p>
              <p
                className="font-medium"
                style={{
                  fontSize: '14px',
                  marginTop: '8px',
                  color: d.isCorrect ? '#76e176' : '#E13346',
                }}
              >
                {d.selectedText}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '32px' }}>
        {!passed && manualId && (
          <Link
            href={`/manual/${manualId}`}
            className="text-center font-black transition-all duration-150 hover:opacity-90"
            style={{
              flex: '1 1 0',
              padding: '14px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              backgroundColor: '#2a2a2a',
              color: 'white',
              border: '1px solid #333',
            }}
          >
            Перечитать пособие
          </Link>
        )}
        <Link
          href="/"
          className="text-center font-black transition-all duration-150 hover:bg-[#ff3a50] hover:scale-[1.02] active:scale-[0.98]"
          style={{
            flex: '1 1 0',
            padding: '14px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            backgroundColor: '#E13346',
            color: 'white',
          }}
        >
          На главную
        </Link>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-text-muted">
          Загрузка результатов...
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
