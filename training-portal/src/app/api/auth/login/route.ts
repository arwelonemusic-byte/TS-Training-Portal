import { NextResponse } from "next/server";
import { getOAuthURL } from "@/lib/auth/discord";

export async function GET() {
  return NextResponse.redirect(getOAuthURL());
}
