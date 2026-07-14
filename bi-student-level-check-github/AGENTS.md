# AGENTS.md

## Project purpose

This project is the BI English Level Check for 学霸教育补习学院. It is a five-minute placement test for Malaysian secondary students, split into:

- Junior: Form 1–3, approximately CEFR A1–B1
- Senior: Form 4–5, approximately CEFR B1–B2

The live site is `https://bi-student-level-check.minxuen-0923.chatgpt.site`.

## Required product behaviour

- Test Grammar, Vocabulary, Reading, Writing accuracy, and situational Speaking.
- Keep the test short, student-friendly, and suitable for KSSM/CEFR learners.
- Require student name, school, current Form, and data-use consent before starting.
- Allow students to return to previous questions and change answers before submission.
- At completion, save the result successfully before revealing the formal report.
- If saving fails, show a retry action. Never silently discard a result.
- The report must include score, performance band, CEFR indicator, suggested placement, skill breakdown, learning priorities, and a printable/PDF layout.
- Preserve academy branding, teacher imagery, and the two WhatsApp contact links.

## Student data and privacy

- Treat student names, schools, grades, answers, and results as private educational data.
- Store durable records only in the platform D1 database bound as `DB`.
- Never replace D1 with localStorage, sessionStorage, or in-memory storage.
- Student-facing routes may submit records but must never list or retrieve other students' records.
- Do not expose database bindings, teacher emails, credentials, access tokens, or environment values to client code.
- Keep the consent statement visible and required.
- Do not log full student submissions or personal information to the browser console.

## Teacher dashboard and authorization

- The teacher dashboard is `/teacher`.
- It must remain protected by ChatGPT sign-in plus a server-side email allowlist.
- The allowlist is provided by the `TEACHER_EMAILS` production environment variable.
- Authentication alone is insufficient: always enforce the allowlist on the server.
- Never move the authorization check into a client component.
- The dashboard may search, filter, inspect skill results, and export CSV.
- Students and anonymous visitors must not be able to read dashboard data or call a record-listing API.

## Architecture

- Framework: Next.js-compatible Vinext app running on Cloudflare Workers.
- Main student experience: `app/page.tsx`
- Global visual system: `app/globals.css`
- Submission API: `app/api/submissions/route.ts`
- Teacher page: `app/teacher/page.tsx`
- Teacher client UI: `app/teacher/teacher-dashboard.tsx`
- Authentication helpers: `app/chatgpt-auth.ts`
- Database schema: `db/schema.ts`
- D1 helpers: `db/submissions.ts`
- Database migrations: `drizzle/`
- Sites configuration: `.openai/hosting.json`

Keep the existing Vinext structure, `sites()` Vite plugin, package manager, lockfiles, and Cloudflare-compatible ESM output.

## Visual direction

- Preserve the premium education-technology look: dark navy, cyan/violet light, glass panels, fine grid, and restrained motion.
- Keep readability more important than decorative effects.
- Maintain strong mobile layouts and touch targets.
- Do not replace supplied academy or teacher assets with generated approximations.
- Do not introduce unrelated stock imagery, generic dashboard chrome, or a childish visual style.

## Content and scoring

- Student-facing language may mix clear Chinese and English labels.
- Keep question wording concise and age-appropriate.
- Avoid adult-business vocabulary unless specifically requested.
- Do not claim that a five-minute screening is a formal CEFR certification.
- Always retain the disclaimer that final placement should also consider trial-class interaction and authentic writing.
- When changing questions or thresholds, update answers, explanations, placement bands, report copy, and teacher interpretation together.

## Database changes

- Define schema changes in `db/schema.ts`.
- Generate a migration with `pnpm run db:generate`.
- Inspect every generated SQL migration before publishing.
- Use prepared statements for runtime D1 queries.
- Pass one SQL statement to each `prepare()` call.
- Preserve existing student records; do not drop or destructively recreate tables without explicit user approval and a migration plan.

## Validation

Before publishing any change:

1. Run `pnpm run build`.
2. Fix all build or type failures.
3. If the database schema changed, generate and inspect migrations.
4. Check that student submission still blocks the report until the save succeeds.
5. Check that `/teacher` remains server-authorized.
6. Preserve `.openai/hosting.json` with the existing `project_id` and `d1: "DB"`.

Do not perform browser interaction or visual QA unless the user requests it.

## Publishing

- This project is hosted with Sites; follow the installed Sites building and hosting skills.
- Reuse the existing Sites project. Never create a replacement site.
- Push the exact validated source before saving a version.
- Package the validated build with the Sites packaging helper.
- The student test is intentionally public to anyone with the link; the teacher dashboard still requires server-side authorization.
- Never disclose source credentials, repository tokens, deployment IDs, or environment secrets.
- Return the existing live URL after a successful deployment.

## Change discipline

- Preserve user-provided branding and unrelated user changes.
- Keep changes scoped to the request.
- Prefer small, reviewable edits over broad rewrites.
- Do not delete student data, migrations, branding assets, or access controls without explicit approval.
