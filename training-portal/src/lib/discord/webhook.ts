import { testRegistry } from "@/data/tests";

interface WebhookOptions {
  userId: string;
  username: string;
  testId: string;
  tierCompleted: boolean;
  tierTitle: string;
  requiresInGameConfirmation: boolean;
  isRefresh: boolean;
}

export async function sendTestPassedWebhook(options: WebhookOptions): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const { userId, username, testId, tierCompleted, tierTitle, requiresInGameConfirmation, isRefresh } = options;
  const testTitle = testRegistry[testId]?.title ?? testId;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const mention = `<@${userId}>`;

  let title: string;
  let description: string;
  let color: number;

  if (isRefresh) {
    title = `${username} освежил в памяти обучение "${testTitle}"`;
    description = `**${username}**\n\n[Перейти на портал обучения](${baseUrl})`;
    color = 0x7e828c; // neutral grey
  } else if (tierCompleted) {
    title = `${username} прошел обучение "${tierTitle}"`;
    if (testId === "scenario-creation") {
      description = `Гордимся тобой, **${username}**, и ждем от тебя новых миссий!`;
    } else if (requiresInGameConfirmation) {
      description = `Гордимся тобой, **${username}**! Роль будет выдана после подтверждения на игре.`;
    } else {
      description = `Гордимся тобой, **${username}**! Роль будет вскоре выдана администратором.`;
    }
    description += `\n\n[Перейти на портал обучения](${baseUrl})`;
    color = 0x76e176; // green
  } else {
    title = `${username} сдал тест "${testTitle}"`;
    description = `Продолжай в том же духе, **${username}**!`;
    description += `\n\n[Перейти на портал обучения](${baseUrl})`;
    color = 0x5996DC; // blue
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // Mention lives in top-level content so Discord delivers a resolved
        // user object — embed mentions rely on each viewer's local cache and
        // render as a raw, unclickable <@id> when the user isn't cached.
        content: mention,
        allowed_mentions: { parse: ["users"] },
        embeds: [
          {
            title,
            description,
            color,
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
