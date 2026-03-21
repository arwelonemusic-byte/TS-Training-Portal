"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ManualIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/manual/rifleman");
  }, [router]);
  return null;
}
