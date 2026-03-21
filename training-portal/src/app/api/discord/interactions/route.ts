import { NextRequest, NextResponse } from "next/server";
import { getTestResultsForUser } from "@/lib/db";
import { mapRoleIdsToNames } from "@/lib/auth/discord";
import { trainingProgression } from "@/data/training";

async function verifySignature(
  request: NextRequest,
  body: string,
): Promise<boolean> {
  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  if (!publicKey) return false;

  const signature = request.headers.get("x-signature-ed25519");
  const timestamp = request.headers.get("x-signature-timestamp");
  if (!signature || !timestamp) return false;

  try {
    const ed = await import("@noble/ed25519");
    const message = new TextEncoder().encode(timestamp + body);
    const sig = hexToBytes(signature);
    const key = hexToBytes(publicKey);
    return await ed.verifyAsync(sig, message, key);
  } catch {
    return false;
  }
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

export async function POST(request: NextRequest) {
  const body = await request.text();

  const isValid = await verifySignature(request, body);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const interaction = JSON.parse(body);

  // PING
  if (interaction.type === 1) {
    return NextResponse.json({ type: 1 });
  }

  // APPLICATION_COMMAND
  if (interaction.type === 2 && interaction.data?.name === "training") {
    const userId = interaction.member?.user?.id;
    const memberRoleIds: string[] = interaction.member?.roles ?? [];
    const roleNames = mapRoleIdsToNames(memberRoleIds);

    // Get test results from DB
    let testResults: Record<string, { passed: boolean; score: number; total: number }> = {};
    if (userId) {
      try {
        testResults = await getTestResultsForUser(userId);
      } catch {
        // DB not available, show roles only
      }
    }

    // Build tier status
    const tierLines = trainingProgression.map((tier) => {
      const hasRoles = tier.requiredRoles.every((r) => roleNames.includes(r));
      if (!hasRoles) return `🔒 ${tier.title}`;

      if (tier.manuals.length === 0) return `🔓 ${tier.title}`;

      const allPassed = tier.manuals.every((m) => testResults[m.id]?.passed);
      return allPassed ? `✅ ${tier.title}` : `📖 ${tier.title}`;
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://training.tacticalshift.ru";

    return NextResponse.json({
      type: 4,
      data: {
        embeds: [
          {
            title: "Tactical Shift — Учебный портал",
            color: 0xe13446,
            description: tierLines.join("\n"),
            fields: [
              {
                name: "Ваши роли",
                value: roleNames.length > 0 ? roleNames.join(", ") : "Нет ролей",
              },
            ],
            footer: {
              text: `🔒 Заблокировано · 🔓 Доступно · 📖 В процессе · ✅ Пройдено`,
            },
          },
        ],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 5,
                label: "Открыть портал",
                url: baseUrl,
              },
            ],
          },
        ],
        flags: 64, // Ephemeral — only visible to the user
      },
    });
  }

  return NextResponse.json({ type: 1 });
}
