"use client";

import Link from "next/link";
import { trainingProgression } from "@/data/training";
import { useUser } from "@/context/UserContext";
import RoleCard from "@/components/RoleCard";

export default function Home() {
  const { user, roles, testResults, isLoading } = useUser();

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

      <div className="flex flex-col gap-2.5">
        {trainingProgression.map((tier, i) => (
          <RoleCard
            key={tier.id}
            tier={tier}
            status={getTierStatus(i)}
            manualResults={testResults}
            defaultOpen={i === firstAvailable}
          />
        ))}
      </div>
    </div>
  );
}
