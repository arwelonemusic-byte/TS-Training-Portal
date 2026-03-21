import { testRegistry } from "@/data/tests";

export async function sendTestPassedWebhook(
  username: string,
  testId: string,
  score: number,
  total: number,
): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const testTitle = testRegistry[testId]?.title ?? testId;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const leadershipTests = ["ftl", "sl"];
  const description = leadershipTests.includes(testId)
    ? `Гордимся тобой, ${username}! Роль будет выдана после подтверждения на игре.\n\n[Перейти на портал обучения](${baseUrl})`
    : `Гордимся тобой, ${username}! Роль будет вскоре выдана администратором.\n\n[Перейти на портал обучения](${baseUrl})`;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: `${username} прошел обучение "${testTitle}"`,
            description,
            color: 0x76e176,
            timestamp: new Date().toISOString(),
            footer: { text: "Tactical Shift Training Portal" },
          },
        ],
      }),
    });
  } catch (err) {
    console.error("Webhook send failed:", err);
  }
}
