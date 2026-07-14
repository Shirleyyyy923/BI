"use client";

import { useMemo, useState } from "react";
import type { SubmissionRecord } from "../../db/submissions";

export function TeacherDashboard({ submissions, teacherName }: { submissions: SubmissionRecord[]; teacherName: string }) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const filtered = useMemo(() => submissions.filter((item) =>
    (level === "all" || item.test_level === level) &&
    `${item.student_name} ${item.school} ${item.student_form} ${item.placement}`.toLowerCase().includes(query.toLowerCase())
  ), [submissions, query, level]);
  const average = submissions.length ? Math.round(submissions.reduce((sum, item) => sum + item.percentage, 0) / submissions.length) : 0;
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = submissions.filter((item) => item.submitted_at.slice(0, 10) === today).length;
  const exportCsv = () => {
    const rows = [["Student","School","Form","Group","Score","Percentage","Band","CEFR","Placement","Grammar","Vocabulary","Reading","Writing","Speaking","Submitted At"], ...filtered.map((s) => [s.student_name,s.school,s.student_form,s.test_level,`${s.score}/${s.total}`,s.percentage,s.band,s.cefr,s.placement,s.grammar,s.vocabulary,s.reading,s.writing,s.speaking,s.submitted_at])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"','""')}"`).join(",")).join("\n");
    const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" })); link.download = `bi-student-results-${today}.csv`; link.click(); URL.revokeObjectURL(link.href);
  };
  return <main className="teacher-shell">
    <header className="teacher-header"><div className="brand"><span className="academy-mark"><img src="/xueba-logo.png" alt="学霸教育补习学院" /></span><div><b>学霸教育补习学院</b><small>Student Records</small></div></div><div><span>{teacherName}</span><a href="/signout-with-chatgpt?return_to=/teacher">Sign out</a></div></header>
    <section className="teacher-title"><div><span>Teacher Dashboard</span><h1>学生程度测试记录</h1><p>查看所有已完成 BI 程度测试的学生与分班建议。</p></div><button onClick={exportCsv}>导出 CSV ↓</button></section>
    <section className="teacher-stats"><div><span>全部学生</span><strong>{submissions.length}</strong></div><div><span>今日完成</span><strong>{todayCount}</strong></div><div><span>平均成绩</span><strong>{average}%</strong></div><div><span>需要基础班</span><strong>{submissions.filter((s) => s.band === "基础").length}</strong></div></section>
    <section className="teacher-panel"><div className="teacher-tools"><input placeholder="搜寻学生姓名、年级或班级…" value={query} onChange={(e) => setQuery(e.target.value)} /><select value={level} onChange={(e) => setLevel(e.target.value)}><option value="all">全部组别</option><option value="junior">初中组</option><option value="senior">高中组</option></select><span>{filtered.length} records</span></div>
      <div className="records-table"><div className="record-row record-head"><span>学生</span><span>组别</span><span>成绩</span><span>程度</span><span>建议班级</span><span>日期</span></div>{filtered.map((s) => <details className="record" key={s.id}><summary className="record-row"><span><b>{s.student_name}</b><small>{s.school} · {s.student_form}</small></span><span>{s.test_level === "junior" ? "初中" : "高中"}</span><span><b>{s.percentage}%</b><small>{s.score}/{s.total}</small></span><span><b>{s.band}</b><small>CEFR {s.cefr}</small></span><span>{s.placement}</span><span>{new Date(s.submitted_at).toLocaleDateString("en-MY")} <i>⌄</i></span></summary><div className="record-detail">{[["语法",s.grammar],["词汇",s.vocabulary],["阅读",s.reading],["写作",s.writing],["口语",s.speaking]].map(([label,value]) => <div key={label}><span>{label}</span><strong>{value}%</strong><i><b style={{width:`${value}%`}} /></i></div>)}</div></details>)}{!filtered.length && <div className="empty-records">还没有符合条件的学生记录。</div>}</div>
    </section>
  </main>;
}
