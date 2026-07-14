import { NextResponse } from "next/server";
import { ensureSubmissionsTable } from "../../../db/submissions";

type Payload = {
  studentName?: string; school?: string; studentForm?: string; testLevel?: string; score?: number;
  total?: number; percentage?: number; band?: string; cefr?: string; placement?: string;
  answers?: number[]; skills?: Record<string, number>;
};

const clean = (value: unknown, max = 120) => typeof value === "string" ? value.trim().slice(0, max) : "";
const number = (value: unknown) => typeof value === "number" && Number.isFinite(value) ? Math.round(value) : 0;

export async function POST(request: Request) {
  let body: Payload;
  try { body = await request.json() as Payload; } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  const studentName = clean(body.studentName, 80);
  const school = clean(body.school, 120);
  const studentForm = clean(body.studentForm, 20);
  if (!studentName || !school || !studentForm || !["junior", "senior"].includes(clean(body.testLevel))) {
    return NextResponse.json({ error: "Missing student details" }, { status: 400 });
  }
  const answers = Array.isArray(body.answers) ? body.answers.slice(0, 20).map(number) : [];
  if (answers.length !== 12) return NextResponse.json({ error: "Incomplete test" }, { status: 400 });
  const skills = body.skills ?? {};
  const db = await ensureSubmissionsTable();
  await db.prepare(`INSERT INTO submissions (
    id, student_name, school, student_form, test_level, score, total, percentage, band, cefr,
    placement, grammar, vocabulary, reading, writing, speaking, answers_json, submitted_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
    crypto.randomUUID(), studentName, school, studentForm, clean(body.testLevel), number(body.score),
    number(body.total), number(body.percentage), clean(body.band), clean(body.cefr), clean(body.placement),
    number(skills.Grammar), number(skills.Vocabulary), number(skills.Reading), number(skills.Writing),
    number(skills.Speaking), JSON.stringify(answers), new Date().toISOString(),
  ).run();
  return NextResponse.json({ ok: true }, { status: 201 });
}
