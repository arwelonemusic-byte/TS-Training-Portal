"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { testRegistry } from "@/data/tests";
import { useUser } from "@/context/UserContext";

export default function TestClient({ testId }: { testId: string }) {
  const router = useRouter();
  const { isMockMode, refreshTestResults } = useUser();
  const config = testRegistry[testId];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!config) {
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

  const { questions, title } = config;
  const question = questions[currentIndex];
  const total = questions.length;
  const isLast = currentIndex === total - 1;
  const progress = ((currentIndex + 1) / total) * 100;

  function handleSelect(key: string) {
    setSelectedKey(key);
  }

  async function handleNext() {
    if (!selectedKey || isSubmitting) return;

    const newAnswers = { ...answers, [question.id]: selectedKey };
    setAnswers(newAnswers);

    if (isLast) {
      if (isMockMode) {
        // Mock mode: client-side grading via URL params (legacy flow)
        const encoded = questions
          .map((q) => newAnswers[q.id] ?? "")
          .join(",");
        router.push(
          `/results?test=${testId}&a=${encodeURIComponent(encoded)}`,
        );
      } else {
        // Real mode: POST to API for server-side grading
        setIsSubmitting(true);
        try {
          const res = await fetch("/api/test-results", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ testId, answers: newAnswers }),
          });
          if (!res.ok) {
            throw new Error(`Server responded with ${res.status}`);
          }
          const result = await res.json();
          sessionStorage.setItem("lastTestResult", JSON.stringify(result));
          await refreshTestResults();
          router.push(`/results?test=${testId}&server=1`);
        } catch (err) {
          console.error("Failed to submit test:", err);
          setIsSubmitting(false);
        }
      }
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedKey(null);
    }
  }

  return (
    <div className="mx-auto px-6" style={{ maxWidth: '640px', paddingTop: '49px', paddingBottom: '49px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h1
          className="text-[20px] font-bold text-text-primary"
          style={{ fontFamily: "'Roboto Slab', serif" }}
        >
          Тест: {title}
        </h1>

        {/* Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span className="text-[16px] font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Вопрос {currentIndex + 1} из {total}
          </span>
          <div className="overflow-hidden" style={{ height: '8px', borderRadius: '14px', backgroundColor: '#2a2a2a' }}>
            <div
              className="transition-all duration-300"
              style={{
                height: '100%',
                width: `${progress}%`,
                borderRadius: '14px',
                backgroundColor: '#e13346',
              }}
            />
          </div>
        </div>
      </div>

      {/* Question + Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '48px' }}>
        <h2
          className="font-bold text-text-primary"
          style={{ fontFamily: "'Roboto Slab', serif", fontSize: '24px', lineHeight: '1.3' }}
        >
          {question.question}
        </h2>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {question.options.map((option) => {
            const isSelected = selectedKey === option.key;
            return (
              <button
                key={option.key}
                onClick={() => handleSelect(option.key)}
                className={`test-answer-card text-left${isSelected ? ' selected' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  padding: '20px',
                  borderRadius: '8px',
                }}
              >
                {/* Letter badge */}
                <span
                  className="shrink-0 text-[16px] font-bold"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? '#2a2a2a' : 'white',
                    color: isSelected ? 'white' : '#2a2a2a',
                    textTransform: 'uppercase',
                  }}
                >
                  {option.key}
                </span>

                {/* Answer text */}
                <span
                  className="text-[16px] font-medium leading-[22px]"
                  style={{
                    flex: '1 1 0',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    color: isSelected ? '#2a2a2a' : 'white',
                  }}
                >
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Next button */}
      <div style={{ marginTop: '32px' }}>
        <button
          onClick={handleNext}
          disabled={!selectedKey}
          className="w-full text-center text-[13px] font-black transition-all duration-150"
          style={{
            padding: '14px 16px',
            borderRadius: '8px',
            backgroundColor: selectedKey ? '#E13346' : '#2a2a2a',
            color: selectedKey ? 'white' : 'rgba(255,255,255,0.3)',
            cursor: selectedKey ? 'pointer' : 'not-allowed',
          }}
        >
          {isLast ? "Завершить тест" : "Следующий вопрос"}
        </button>
      </div>
    </div>
  );
}
