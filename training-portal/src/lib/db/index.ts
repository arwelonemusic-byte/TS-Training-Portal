import postgres from "postgres";

// Long-lived `next start` process: keep one pooled client for the lifetime
// of the server instead of a per-request client.
let db: ReturnType<typeof postgres> | null = null;

function getDb() {
  if (!db) {
    if (!process.env.POSTGRES_URL) {
      throw new Error("POSTGRES_URL is not set");
    }
    db = postgres(process.env.POSTGRES_URL);
  }
  return db;
}

export interface TestResultRow {
  user_id: string;
  test_id: string;
  score: number;
  total: number;
  passed: boolean;
  completed_at: string;
}

export async function getTestResultsForUser(
  userId: string,
): Promise<Record<string, { passed: boolean; score: number; total: number }>> {
  const sql = getDb();
  const rows = await sql`
    SELECT test_id, score, total, passed
    FROM test_results
    WHERE user_id = ${userId}
  ` as TestResultRow[];

  const results: Record<string, { passed: boolean; score: number; total: number }> = {};
  for (const row of rows) {
    results[row.test_id] = {
      passed: row.passed,
      score: row.score,
      total: row.total,
    };
  }
  return results;
}

export async function upsertTestResult(
  userId: string,
  testId: string,
  score: number,
  total: number,
  passed: boolean,
): Promise<void> {
  const sql = getDb();
  await sql`
    INSERT INTO test_results (user_id, test_id, score, total, passed, completed_at)
    VALUES (${userId}, ${testId}, ${score}, ${total}, ${passed}, NOW())
    ON CONFLICT (user_id, test_id)
    DO UPDATE SET score = ${score}, total = ${total}, passed = ${passed}, completed_at = NOW()
  `;
}
