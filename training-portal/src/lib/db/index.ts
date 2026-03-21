import { neon } from "@neondatabase/serverless";

function getDb() {
  const sql = neon(process.env.POSTGRES_URL!);
  return sql;
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
