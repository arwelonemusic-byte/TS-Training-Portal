const DISCORD_API = "https://discord.com/api/v10";

export function getOAuthURL(): string {
  const clientId = process.env.DISCORD_CLIENT_ID!;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const redirectUri = `${baseUrl}/api/auth/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify guilds.members.read",
  });

  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

export async function exchangeCode(code: string): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const res = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: `${baseUrl}/api/auth/callback`,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Discord token exchange failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.access_token;
}

export interface DiscordUser {
  id: string;
  username: string;
  avatar: string | null;
}

export async function fetchDiscordUser(accessToken: string): Promise<DiscordUser> {
  const res = await fetch(`${DISCORD_API}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error(`Failed to fetch Discord user: ${res.status}`);
  const data = await res.json();
  return { id: data.id, username: data.username, avatar: data.avatar };
}

export interface DiscordGuildMember {
  roles: string[]; // array of role IDs
  nick: string | null; // server-specific nickname
}

export async function fetchGuildMember(
  accessToken: string,
  guildId: string,
): Promise<DiscordGuildMember> {
  const res = await fetch(`${DISCORD_API}/users/@me/guilds/${guildId}/member`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("NOT_IN_GUILD");
    }
    throw new Error(`Failed to fetch guild member: ${res.status}`);
  }

  const data = await res.json();
  return { roles: data.roles, nick: data.nick ?? null };
}

export function mapRoleIdsToNames(roleIds: string[]): string[] {
  const mapStr = process.env.DISCORD_ROLE_MAP;
  if (!mapStr) return [];

  const roleMap: Record<string, string> = JSON.parse(mapStr);
  return roleIds
    .map((id) => roleMap[id])
    .filter((name): name is string => !!name);
}
