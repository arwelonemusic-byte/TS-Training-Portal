"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { trainingProgression, extrasProgression } from "@/data/training";
import { useUser } from "@/context/UserContext";
import RoleCard from "@/components/RoleCard";

export default function Home() {
  const { user, roles, testResults, isLoading } = useUser();
  const [activeTab, setActiveTab] = useState<"basics" | "extras">("basics");
  const tabsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  function getTierStatus(
    tierIndex: number,
  ): "locked" | "available" | "completed" {
    const tier = trainingProgression[tierIndex];

    const hasRequiredRoles = tier.requiredRoles.every((role) =>
      roles.includes(role),
    );

    if (!hasRequiredRoles) return "locked";

    // If user already has the role this tier grants, infer completion
    if (tier.grantsRole && roles.includes(tier.grantsRole)) return "completed";

    if (tier.manuals.length === 0) return "available";

    const allPassed = tier.manuals.every(
      (m) => testResults[m.id]?.passed,
    );

    return allPassed ? "completed" : "available";
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-text-muted">
        Загрузка...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-[900px] px-6 py-12 text-center">
        <h1
          className="mb-6 text-[32px] font-bold leading-[1.1] tracking-tight text-text-primary sm:text-[64px]"
          style={{ fontFamily: "var(--font-roboto-slab), serif" }}
        >
          Tactical Shift
        </h1>
        <p className="mb-8 text-lg text-text-secondary">
          Учебный портал сообщества. Войдите через Discord, чтобы начать обучение.
        </p>
        <Link
          href="/api/auth/login"
          className="inline-flex items-center gap-3 rounded-lg bg-[#5865F2] px-8 py-4 text-base font-bold text-white transition-opacity hover:opacity-90"
        >
          <svg width="20" height="15" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.8 40.8 0 00-1.8 3.7 54 54 0 00-16.2 0A37.4 37.4 0 0025.4.3a.2.2 0 00-.2-.1A58.4 58.4 0 0010.5 4.9.2.2 0 0010.4 5C1.5 18.7-.9 32 .3 45.2v.1a58.7 58.7 0 0017.9 9.1.2.2 0 00.3-.1 42 42 0 003.6-5.9.2.2 0 00-.1-.3 38.6 38.6 0 01-5.5-2.6.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 41.9 41.9 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .3 36.3 36.3 0 01-5.5 2.7.2.2 0 00-.1.3 47.2 47.2 0 003.6 5.9.2.2 0 00.3.1A58.5 58.5 0 0070.3 45.3v-.1C71.7 30.1 67.7 16.9 60.1 5a.2.2 0 000-.1zM23.7 37.1c-3.5 0-6.4-3.2-6.4-7.1s2.8-7.1 6.4-7.1 6.5 3.2 6.4 7.1c0 3.9-2.8 7.1-6.4 7.1zm23.6 0c-3.5 0-6.4-3.2-6.4-7.1s2.8-7.1 6.4-7.1 6.5 3.2 6.4 7.1c0 3.9-2.8 7.1-6.4 7.1z" fill="white"/>
          </svg>
          Войти через Discord
        </Link>
      </div>
    );
  }

  const firstAvailable = trainingProgression.findIndex(
    (_, idx) => getTierStatus(idx) === "available",
  );

  return (
    <div className="mx-auto max-w-[900px] px-6 py-12">
      <div className="mb-10">
        <h1
          className="mb-3 text-[32px] font-bold leading-[1.1] tracking-tight text-text-primary sm:text-[64px]"
          style={{ fontFamily: "var(--font-roboto-slab), serif" }}
        >
          Привет, {user.displayName}!
        </h1>
        <p className="text-lg text-accent-amber">
          Самое время получить новую роль
        </p>
      </div>

      <div className="relative mb-6 flex gap-6">
        {(["basics", "extras"] as const).map((tab) => (
          <button
            key={tab}
            ref={(el) => { tabsRef.current[tab] = el; }}
            onClick={() => setActiveTab(tab)}
            className="cursor-pointer pb-2"
          >
            <span
              className={`text-2xl font-bold transition-colors duration-200 ${activeTab === tab ? "text-text-primary" : "text-text-primary/30 hover:text-text-primary"}`}
              style={{ fontFamily: "var(--font-roboto-slab), serif" }}
            >
              {tab === "basics" ? "Основы" : "Допы"}
            </span>
          </button>
        ))}
        <div
          className="absolute bottom-0 h-0.5 bg-text-primary transition-all duration-300 ease-in-out"
          style={{
            left: tabsRef.current[activeTab]?.offsetLeft ?? 0,
            width: tabsRef.current[activeTab]?.offsetWidth ?? 0,
          }}
        />
      </div>

      {activeTab === "basics" ? (
        <div className="flex flex-col gap-2.5">
          {trainingProgression.map((tier, i) => (
            <div
              key={tier.id}
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                transition: `opacity 400ms cubic-bezier(0.25, 1, 0.5, 1) ${i * 80}ms, transform 400ms cubic-bezier(0.25, 1, 0.5, 1) ${i * 80}ms`,
              }}
            >
              <RoleCard
                tier={tier}
                status={getTierStatus(i)}
                manualResults={testResults}
                defaultOpen={i === firstAvailable}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {extrasProgression.map((tier, i) => {
            const hasRequired = tier.requiredRoles.every((role) =>
              roles.includes(role),
            );
            const allPassed = tier.manuals.length > 0 && tier.manuals.every(
              (m) => testResults[m.id]?.passed,
            );
            const status: "locked" | "available" | "completed" = !hasRequired
              ? "locked"
              : allPassed
                ? "completed"
                : "available";
            return (
              <div
                key={tier.id}
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                  transition: `opacity 400ms cubic-bezier(0.25, 1, 0.5, 1) ${i * 80}ms, transform 400ms cubic-bezier(0.25, 1, 0.5, 1) ${i * 80}ms`,
                }}
              >
                <RoleCard
                  tier={tier}
                  status={status}
                  manualResults={testResults}
                  defaultOpen={status === "available"}
                />
              </div>
            );
          })}
          <div className="flex items-center gap-4 rounded-2xl bg-bg-card p-5 opacity-50">
            <svg className="shrink-0 text-text-muted" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            <span
              className="flex-1 text-2xl font-bold text-text-primary/30"
              style={{ fontFamily: "var(--font-roboto-slab), serif" }}
            >
              Рецепт плова от Кабана
            </span>
            <span className="text-sm font-semibold uppercase text-text-muted">
              Скоро
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
