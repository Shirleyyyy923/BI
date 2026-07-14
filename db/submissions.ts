import { env } from "cloudflare:workers";

export type SubmissionRecord = {
  id: string; student_name: string; school: string; student_form: string; test_level: string;
  score: number; total: number; percentage: number; band: string; cefr: string;
  placement: string; grammar: number; vocabulary: number; reading: number;
  writing: number; speaking: number; answers_json: string; submitted_at: string;
};

function database(): D1Database {
  const db = (env as unknown as { DB?: D1Database }).DB;
  if (!db) throw new Error("D1 binding DB is unavailable");
  return db;
}

export async function ensureSubmissionsTable() {
  const db = database();
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY NOT NULL,
      student_name TEXT NOT NULL,
      school TEXT NOT NULL,
      student_form TEXT NOT NULL,
      test_level TEXT NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      percentage INTEGER NOT NULL,
      band TEXT NOT NULL,
      cefr TEXT NOT NULL,
      placement TEXT NOT NULL,
      grammar INTEGER NOT NULL,
      vocabulary INTEGER NOT NULL,
      reading INTEGER NOT NULL,
      writing INTEGER NOT NULL,
      speaking INTEGER NOT NULL,
      answers_json TEXT NOT NULL,
      submitted_at TEXT NOT NULL
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS submissions_submitted_at_idx ON submissions (submitted_at)"),
    db.prepare("CREATE INDEX IF NOT EXISTS submissions_student_name_idx ON submissions (student_name)"),
  ]);
  return db;
}

export async function listSubmissions(): Promise<SubmissionRecord[]> {
  const db = await ensureSubmissionsTable();
  const result = await db.prepare("SELECT * FROM submissions ORDER BY submitted_at DESC LIMIT 1000").all<SubmissionRecord>();
  return result.results;
}

export function teacherEmails(): string[] {
  const value = (env as unknown as { TEACHER_EMAILS?: string }).TEACHER_EMAILS ?? "";
  return value.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
}
