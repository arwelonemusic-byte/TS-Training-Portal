"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TestIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/test/rifleman");
  }, [router]);
  return null;
}
