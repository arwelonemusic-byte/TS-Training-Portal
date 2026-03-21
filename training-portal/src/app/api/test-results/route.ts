import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getTestResultsForUser, upsertTestResult } from "@/lib/db";
import { testRegistry } from "@/data/tests";
import { sendTestPassedWebhook } from "@/lib/discord/webhook";

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
    sendTestPassedWebhook(session.displayName, testId, score, total).catch((e) =>
      console.error("Failed to send webhook:", e),
    );
  }

  return NextResponse.json({
    testId,
    score,
    total,
    passed,
    details,
  });
}
