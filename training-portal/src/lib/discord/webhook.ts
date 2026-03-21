import { testRegistry } from "@/data/tests";

interface WebhookOptions {
  username: string;
  testId: string;
  tierCompleted: boolean;
  tierTitle: string;
  requiresInGameConfirmation: boolean;
}

export async function sendTestPassedWebhook(options: WebhookOptions): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const { username, testId, tierCompleted, tierTitle, requiresInGameConfirmation } = options;
  const testTitle = testRegistry[testId]?.title ?? testId;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  let title: string;
  let description: string;

  if (tierCompleted) {
    title = `${username} прошел обучение "${tierTitle}"`;
    description = requiresInGameConfirmation
      ? `Гордимся тобой, ${username}! Роль будет выдана после подтверждения на игре.`
      : `Гордимся тобой, ${username}! Роль будет вскоре выдана администратором.`;
  } else {
    title = `${username} сдал тест "${testTitle}"`;
    description = `Продолжай в том же духе!`;
  }

  description += `\n\n[Перейти на портал обучения](${baseUrl})`;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title,
            description,
            color: tierCompleted ? 0x76e176 : 0x5996DC,
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
