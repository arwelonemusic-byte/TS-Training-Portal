import { NextResponse } from "next/server";
import { getSession, createSessionToken, sessionCookieOptions } from "@/lib/auth/session";
import { fetchGuildMemberByBot, mapRoleIdsToNames } from "@/lib/auth/discord";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ user: null });
  }

  // Re-fetch roles from Discord so changes apply on page refresh
  let roles = session.roles;
  let displayName = session.displayName;
  try {
    const guildId = process.env.DISCORD_GUILD_ID!;
    const member = await fetchGuildMemberByBot(session.userId, guildId);
    roles = mapRoleIdsToNames(member.roles);
    if (member.nick) {
      displayName = member.nick;
    }
  } catch (err) {
    console.error("Failed to refresh roles from Discord:", err);
    // Fall back to cached session roles
  }

  // Update the session cookie if roles or displayName changed
  const rolesChanged = JSON.stringify(roles) !== JSON.stringify(session.roles);
  const nameChanged = displayName !== session.displayName;

  const response = NextResponse.json({
    user: {
      id: session.userId,
      username: session.username,
      displayName,
      avatar: session.avatar,
      roles,
    },
  });

  if (rolesChanged || nameChanged) {
    const newToken = await createSessionToken({
      ...session,
      roles,
      displayName,
    });
    const cookieOpts = sessionCookieOptions();
    response.cookies.set(cookieOpts.name, newToken, cookieOpts);
  }

  return response;
}
