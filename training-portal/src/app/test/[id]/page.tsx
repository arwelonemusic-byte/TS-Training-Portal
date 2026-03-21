import { testRegistry } from "@/data/tests";
import TestClient from "./TestClient";

export function generateStaticParams() {
  return Object.keys(testRegistry).map((id) => ({ id }));
}

export default async function TestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TestClient testId={id} />;
}
