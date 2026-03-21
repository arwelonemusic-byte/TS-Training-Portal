CREATE TABLE IF NOT EXISTS test_results (
  id            SERIAL PRIMARY KEY,
  user_id       VARCHAR(20) NOT NULL,
  test_id       VARCHAR(32) NOT NULL,
  score         INTEGER NOT NULL,
  total         INTEGER NOT NULL,
  passed        BOOLEAN NOT NULL,
  completed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, test_id)
);

CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON test_results(user_id);
