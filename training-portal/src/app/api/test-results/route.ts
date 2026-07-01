import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getTestResultsForUser, upsertTestResult } from "@/lib/db";
import { testRegistry } from "@/data/tests";
import { sendTestPassedWebhook } from "@/lib/discord/webhook";
import { assignRolesToMember } from "@/lib/auth/discord";
import { trainingProgression, extrasProgression } from "@/data/training";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await getTestResultsForUser(session.userId);
    return NextResponse.json({ results });
  } catch (e) {
    console.error("Failed to fetch test results:", e);
    return NextResponse.json({ results: {} });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { testId, answers } = body as {
    testId: string;
    answers: Record<number, string>;
  };

  const config = testRegistry[testId];
  if (!config) {
    return NextResponse.json({ error: "Test not found" }, { status: 404 });
  }

  const { questions, passThreshold } = config;

  // Grade answers server-side
  const details = questions.map((q) => {
    const selectedKey = answers[q.id] ?? "";
    const isCorrect = selectedKey === q.correctKey;
    const selectedOption = q.options.find((o) => o.key === selectedKey);
    return {
      questionId: q.id,
      question: q.question,
      selectedKey,
      selectedText: selectedOption?.text ?? "—",
      isCorrect,
    };
  });

  const score = details.filter((d) => d.isCorrect).length;
  const total = questions.length;
  const passed = score >= passThreshold;

  // Persist result (non-fatal — DB may not be configured yet)
  try {
    await upsertTestResult(session.userId, testId, score, total, passed);
  } catch (e) {
    console.error("Failed to persist test result:", e);
  }

  // Fire webhook if passed (fire-and-forget)
  if (passed) {
    // Determine if this test completes the entire tier
    const tier = [...trainingProgression, ...extrasProgression].find((t) => t.manuals.some((m) => m.id === testId));

    let tierCompleted = false;
    if (tier) {
      // Get existing results to check if other tests in this tier are already passed
      let existingResults: Record<string, { passed: boolean }> = {};
      try {
        existingResults = await getTestResultsForUser(session.userId);
      } catch {
        // DB not available — assume not completed
      }
      // Current test is passed, check the rest
      tierCompleted = tier.manuals.every(
        (m) => m.id === testId || existingResults[m.id]?.passed,
      );
    }

    // Check if user already has the role this tier grants (i.e. a refresh/revisit)
    const isRefresh = tier?.grantsRole
      ? session.roles.includes(tier.grantsRole)
      : false;

    // Auto-assign this tier's Discord roles via the bot (only tiers that opt in
    // via botRoles; SL/PL and extras stay manual). Failures are non-fatal and
    // fall back to the "granted by admin" messaging + no ✅ reaction.
    let rolesGranted = false;
    if (tierCompleted && !isRefresh && tier?.botRoles?.length) {
      const guildId = process.env.DISCORD_GUILD_ID;
      if (guildId) {
        try {
          rolesGranted = await assignRolesToMember(session.userId, guildId, tier.botRoles);
        } catch (e) {
          console.error("Failed to auto-assign roles:", e);
        }
      }
    }

    // Defer the webhook (message + ✅ reaction) via after() so it runs on the
    // platform's waitUntil rather than as untracked work after the response —
    // otherwise the serverless instance can freeze mid-flight and drop the
    // trailing reaction call (message posts, but the ✅ never lands).
    after(async () => {
      try {
        await sendTestPassedWebhook({
          userId: session.userId,
          username: session.displayName,
          testId,
          tierCompleted,
          tierTitle: tier?.title ?? testId,
          requiresInGameConfirmation: tier?.requiresInGameConfirmation ?? false,
          isRefresh,
          rolesGranted,
        });
      } catch (e) {
        console.error("Failed to send webhook:", e);
      }
    });
  }

  return NextResponse.json({
    testId,
    score,
    total,
    passed,
    details,
  });
}
