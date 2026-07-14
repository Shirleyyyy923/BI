"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Level = "junior" | "senior";
type Category = "Grammar" | "Vocabulary" | "Reading" | "Writing" | "Speaking";
type Question = { category: Category; prompt: string; options: string[]; answer: number; note: string; passage?: string };

const tests: Record<Level, { label: string; form: string; questions: Question[] }> = {
  junior: {
    label: "初中组 Junior",
    form: "Form 1–3 · CEFR A1–B1",
    questions: [
      { category: "Grammar", prompt: "Aina ___ to school by bus every day.", options: ["go", "goes", "going", "gone"], answer: 1, note: "第三人称单数的一般现在时用 goes。" },
      { category: "Grammar", prompt: "We ___ our homework last night.", options: ["finish", "finishes", "finished", "finishing"], answer: 2, note: "last night 表示过去，使用 finished。" },
      { category: "Grammar", prompt: "There ___ some milk in the fridge.", options: ["is", "are", "were", "be"], answer: 0, note: "milk 是不可数名词，搭配 is。" },
      { category: "Grammar", prompt: "This book is ___ than that one.", options: ["interesting", "more interesting", "most interesting", "interest"], answer: 1, note: "两者比较使用 more interesting。" },
      { category: "Grammar", prompt: "You ___ wear a helmet when riding a bicycle.", options: ["should", "would", "could have", "used"], answer: 0, note: "should 表示建议。" },
      { category: "Vocabulary", prompt: "The word closest in meaning to ‘rapid’ is ___.", options: ["slow", "quick", "quiet", "weak"], answer: 1, note: "rapid 与 quick 都表示快速的。" },
      { category: "Vocabulary", prompt: "Please ___ the lights before leaving the room.", options: ["turn off", "look after", "give up", "put on"], answer: 0, note: "turn off the lights 表示关灯。" },
      { category: "Reading", passage: "Nadia joined the school gardening club in March. Every Friday, she waters the plants and removes weeds. She enjoys the club because she has learnt how to grow vegetables.", prompt: "When does Nadia work in the garden?", options: ["Every Monday", "Every Friday", "In the morning", "In December"], answer: 1, note: "短文明确说明 Every Friday。" },
      { category: "Reading", passage: "Nadia joined the school gardening club in March. Every Friday, she waters the plants and removes weeds. She enjoys the club because she has learnt how to grow vegetables.", prompt: "Why does Nadia enjoy the club?", options: ["She gets free food.", "Her friend asked her to join.", "She learns to grow vegetables.", "She does not need to study."], answer: 2, note: "原因是她学会种植蔬菜。" },
      { category: "Writing", prompt: "Choose the best sentence for a school notice.", options: ["All student must brings their bottle.", "All students must bring their bottles.", "All students must brought bottle.", "All student bringing their bottles."], answer: 1, note: "复数 students/bottles，情态动词 must 后用原形 bring。" },
      { category: "Speaking", prompt: "Your teacher says, “Could you close the window, please?” What is the best reply?", options: ["Yes, of course.", "I close yesterday.", "No window.", "You are welcome."], answer: 0, note: "礼貌接受请求可回答 Yes, of course。" },
      { category: "Speaking", prompt: "You did not hear your classmate clearly. What should you say?", options: ["Speak!", "What you say?", "Could you say that again, please?", "I don’t care."], answer: 2, note: "这是自然且礼貌的请求重复说法。" },
    ],
  },
  senior: {
    label: "高中组 Senior",
    form: "Form 4–5 · CEFR B1–B2",
    questions: [
      { category: "Grammar", prompt: "If Amir had left earlier, he ___ the train.", options: ["would catch", "would have caught", "caught", "had caught"], answer: 1, note: "第三条件句：would have + 过去分词。" },
      { category: "Grammar", prompt: "The new library ___ by the minister next month.", options: ["opens", "will open", "will be opened", "has opened"], answer: 2, note: "未来被动语态：will be opened。" },
      { category: "Grammar", prompt: "Neither the coach nor the players ___ satisfied with the result.", options: ["was", "is", "were", "has"], answer: 2, note: "就近一致：players 为复数，使用 were。" },
      { category: "Grammar", prompt: "She admitted ___ the confidential email.", options: ["to forward", "forward", "forwarding", "forwarded"], answer: 2, note: "admit 后接动名词 forwarding。" },
      { category: "Grammar", prompt: "By the time we arrived, the presentation ___.", options: ["started", "has started", "had started", "was starting"], answer: 2, note: "较早发生的过去动作使用过去完成时。" },
      { category: "Vocabulary", prompt: "The committee reached a ___ decision after hours of debate.", options: ["unanimous", "temporary", "careless", "fragile"], answer: 0, note: "unanimous decision 表示全体一致的决定。" },
      { category: "Vocabulary", prompt: "His explanation was so ___ that even beginners understood it.", options: ["ambiguous", "concise", "reluctant", "scarce"], answer: 1, note: "concise 表示简洁清晰；最符合语境。" },
      { category: "Reading", passage: "Many schools have introduced device-free periods. Supporters argue that these periods improve concentration and encourage face-to-face interaction. Critics, however, say that responsible technology use should be taught rather than avoided. Early studies suggest that the outcome depends largely on how consistently each school applies its policy.", prompt: "What is the writer’s main point?", options: ["Technology should be banned everywhere.", "All students dislike device-free periods.", "The effect of the policy depends on its implementation.", "Early studies have proved the policy always works."], answer: 2, note: "末句总结：成效主要取决于政策执行的一致性。" },
      { category: "Reading", passage: "Many schools have introduced device-free periods. Supporters argue that these periods improve concentration and encourage face-to-face interaction. Critics, however, say that responsible technology use should be taught rather than avoided. Early studies suggest that the outcome depends largely on how consistently each school applies its policy.", prompt: "Which statement would critics most likely support?", options: ["Students should learn to use devices responsibly.", "Schools should remove all digital tools.", "Face-to-face interaction is unnecessary.", "Policies never affect behaviour."], answer: 0, note: "批评者主张教授负责任的科技使用方式。" },
      { category: "Writing", prompt: "Choose the most effective sentence for a formal email.", options: ["I wanna know about the programme ASAP.", "Tell me the programme details.", "I would appreciate it if you could provide further details about the programme.", "Can give details or not?"], answer: 2, note: "语气正式、礼貌且句子完整。" },
      { category: "Speaking", prompt: "You disagree with a classmate during a discussion. Choose the most appropriate response.", options: ["That is completely wrong.", "I see your point, but I interpret the evidence differently.", "Whatever you say.", "You clearly did not read it."], answer: 1, note: "先认可对方观点，再礼貌表达不同意见。" },
      { category: "Speaking", prompt: "You need time to think during an oral response. What could you say naturally?", options: ["Give me answer.", "That’s an interesting question; let me think for a moment.", "I cannot speaking.", "Wait lah."], answer: 1, note: "这是自然、得体的争取思考时间表达。" },
    ],
  },
};

const categoryZh: Record<Category, string> = { Grammar: "语法", Vocabulary: "词汇", Reading: "阅读", Writing: "写作", Speaking: "口语" };

export default function Home() {
  const [level, setLevel] = useState<Level | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [teacher, setTeacher] = useState(false);
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [studentForm, setStudentForm] = useState("");
  const [consent, setConsent] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const savedRef = useRef(false);

  const test = level ? tests[level] : null;
  const result = useMemo(() => {
    if (!test || !finished) return null;
    const categories = Object.keys(categoryZh) as Category[];
    const stats = categories.map((category) => {
      const items = test.questions.map((q, i) => ({ q, i })).filter(({ q }) => q.category === category);
      const correct = items.filter(({ q, i }) => answers[i] === q.answer).length;
      return { category, correct, total: items.length, pct: Math.round((correct / items.length) * 100) };
    });
    const score = test.questions.filter((q, i) => answers[i] === q.answer).length;
    const pct = Math.round((score / test.questions.length) * 100);
    const band = pct >= 85 ? "优秀" : pct >= 70 ? "良好" : pct >= 50 ? "中等" : "基础";
    const cefr = level === "junior" ? (pct >= 85 ? "B1" : pct >= 70 ? "A2+" : pct >= 50 ? "A2" : "A1") : (pct >= 85 ? "B2" : pct >= 70 ? "B1+" : pct >= 50 ? "B1" : "A2");
    const placement = level === "junior"
      ? (pct >= 85 ? "Junior Advanced · F3 Bridge" : pct >= 70 ? "Junior Plus · F2–F3" : pct >= 50 ? "Junior Core · F1–F2" : "Junior Foundation")
      : (pct >= 85 ? "Senior Advanced · SPM Plus" : pct >= 70 ? "Senior Plus · F4–F5" : pct >= 50 ? "Senior Core · F4" : "Senior Foundation Bridge");
    const strongest = [...stats].sort((a, b) => b.pct - a.pct)[0];
    const priority = [...stats].sort((a, b) => a.pct - b.pct)[0];
    return { stats, score, pct, band, cefr, placement, strongest, priority };
  }, [test, finished, answers, level]);

  useEffect(() => {
    if (!finished || !result || !level || savedRef.current) return;
    savedRef.current = true;
    setSaveStatus("saving");
    fetch("/api/submissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        studentName: name.trim(), school: school.trim(), studentForm, testLevel: level,
        score: result.score, total: test?.questions.length ?? 12,
        percentage: result.pct, band: result.band, cefr: result.cefr,
        placement: result.placement, answers,
        skills: Object.fromEntries(result.stats.map((s) => [s.category, s.pct])),
      }),
    }).then((response) => {
      if (!response.ok) throw new Error("save failed");
      setSaveStatus("saved");
    }).catch(() => setSaveStatus("error"));
  }, [finished, result, level, name, school, studentForm, answers, test, saveStatus]);

  const start = (choice: Level) => {
    if (!name.trim() || !school.trim() || !studentForm || !consent) return;
    savedRef.current = false; setSaveStatus("idle"); setLevel(choice); setIndex(0); setAnswers([]); setSelected(null); setFinished(false); setTeacher(false);
  };
  const next = () => {
    if (!test || selected === null) return;
    const nextAnswers = [...answers];
    nextAnswers[index] = selected;
    setAnswers(nextAnswers);
    if (index === test.questions.length - 1) setFinished(true);
    else { const nextIndex = index + 1; setIndex(nextIndex); setSelected(nextAnswers[nextIndex] ?? null); }
  };
  const previous = () => {
    if (index === 0) return;
    const saved = [...answers];
    if (selected !== null) saved[index] = selected;
    const previousIndex = index - 1;
    setAnswers(saved); setIndex(previousIndex); setSelected(saved[previousIndex] ?? null);
  };
  const restart = () => { savedRef.current = false; setSaveStatus("idle"); setLevel(null); setFinished(false); setAnswers([]); setIndex(0); setSelected(null); setTeacher(false); };

  if (!level || !test) return (
    <main className="shell landing">
      <div className="brand"><span className="academy-mark"><img src="/xueba-logo.png" alt="学霸教育补习学院" /></span><div><b>学霸教育补习学院</b><small>BI English Level Check</small></div></div>
      <section className="hero">
        <div className="eyebrow">KSSM · CEFR · 约 5 分钟</div>
        <h1>先了解程度，<br/><em>再开始进步。</em></h1>
        <p>一份轻松、快速的英文程度测试，帮助老师了解你的语法、词汇、阅读、写作与日常表达能力。</p>
        <div className="student-fields"><label className="name-field">学生姓名 <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" /></label><label className="name-field">学校 <input required value={school} onChange={(e) => setSchool(e.target.value)} placeholder="School name" /></label><label className="name-field">目前年级 <select required value={studentForm} onChange={(e) => setStudentForm(e.target.value)}><option value="">请选择 Form</option>{[1,2,3,4,5].map((form) => <option key={form} value={`Form ${form}`}>Form {form}</option>)}</select></label></div>
        <label className="consent"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /><span>我同意将姓名及测试成绩保存给学霸教育补习学院，用于程度分析与课程建议。</span></label>
        <aside className="contact-panel">
          <img className="teachers-art" src="/teachers.png" alt="Ms Shirley 与 Ms Jolene" />
          <div className="contact-copy"><span>课程咨询 · WhatsApp</span><strong>让老师先了解程度，再为学生建议合适课程。</strong><div className="contact-links"><a href="https://wa.me/601110923800" target="_blank" rel="noreferrer"><b>MS SHIRLEY</b><small>011-10923800 · WhatsApp ↗</small></a><a href="https://wa.me/601121531662" target="_blank" rel="noreferrer"><b>MS JOLENE</b><small>011-21531662 · WhatsApp ↗</small></a></div></div>
        </aside>
        <div className="level-grid">
          <button disabled={!name.trim() || !school.trim() || !studentForm || !consent} className="level-card coral" onClick={() => start("junior")}><span className="card-no">01</span><b>初中组</b><small>Junior · Form 1–3</small><i>开始测试 →</i></button>
          <button disabled={!name.trim() || !school.trim() || !studentForm || !consent} className="level-card blue" onClick={() => start("senior")}><span className="card-no">02</span><b>高中组</b><small>Senior · Form 4–5</small><i>开始测试 →</i></button>
        </div>
        <div className="meta"><span>● 自动批改</span><span>● 即时能力分析</span><span>● 无需 Listening</span><a href="/teacher">教师后台 →</a></div>
      </section>
    </main>
  );

  if (finished && result) {
    if (saveStatus !== "saved") return <main className="shell submit-page"><div className="submit-card"><span className="academy-mark"><img src="/xueba-logo.png" alt="学霸教育补习学院" /></span><div className="eyebrow">Submitting Assessment</div><h1>{saveStatus === "error" ? "成绩尚未发送" : "正在发送成绩…"}</h1><p>{saveStatus === "error" ? "网络暂时无法连接老师后台。请重新发送，成功后才会显示正式报告。" : "请稍候，不要关闭页面。成绩正安全保存到老师后台。"}</p>{saveStatus === "error" ? <button onClick={() => { savedRef.current = false; setSaveStatus("idle"); }}>重新发送成绩 →</button> : <div className="loader"><i /></div>}</div></main>;
    const weak = result.stats.filter((s) => s.pct < 70).map((s) => categoryZh[s.category]);
    const reportDate = new Intl.DateTimeFormat("en-MY", { year: "numeric", month: "short", day: "2-digit" }).format(new Date());
    return <main className="shell result-page">
      <header className="topbar"><div className="brand"><span className="academy-mark"><img src="/xueba-logo.png" alt="学霸教育补习学院" /></span><div><b>学霸教育补习学院</b><small>Placement Report</small></div></div><div className="report-actions"><button className="text-btn" onClick={() => window.print()}>打印 / 存成 PDF</button><button className="text-btn" onClick={restart}>重新测试</button></div></header>
      <section className="result-head">
        <div><div className="eyebrow">Student Placement Report · {reportDate}</div><h1>{name}：<em>{result.band}</em></h1><p>{school} · {studentForm} · {test.label} · CEFR 参考 {result.cefr}</p></div>
        <div className="score-ring"><strong>{result.pct}</strong><span>/ 100</span><small>{result.score} / {test.questions.length} 题</small></div>
      </section>
      <div className="save-status saved">✓ 测试记录已发送并安全保存，老师可在后台查看。</div>
      <section className="report-summary">
        <div><span>Recommended Placement</span><strong>{result.placement}</strong></div>
        <div><span>CEFR Indicator</span><strong>{result.cefr}</strong></div>
        <div><span>Strongest Area</span><strong>{categoryZh[result.strongest.category]} · {result.strongest.pct}%</strong></div>
        <div><span>Priority Area</span><strong>{categoryZh[result.priority.category]} · {result.priority.pct}%</strong></div>
      </section>
      <section className="result-grid">
        <div className="panel"><h2>Skill Performance · 能力表现</h2>{result.stats.map((s) => <div className="skill-row" key={s.category}><div><b>{categoryZh[s.category]} <small>{s.category}</small></b><span>{s.correct}/{s.total} · {s.pct}%</span></div><div className="bar"><i style={{width: `${s.pct}%`}} /></div></div>)}</div>
        <div className="panel recommendation"><h2>Learning Prescription · 学习建议</h2><div className="recommend-icon">✦</div><p>{weak.length ? `优先补强：${weak.join("、")}。` : "各项能力表现均衡，可进入综合应用训练。"}</p><p className="sub">{result.band === "基础" ? "建议从核心句型、高频词汇和短篇理解开始，每周安排明确的小目标。" : result.band === "中等" ? "建议巩固时态及句型准确度，并加强语境词汇与段落理解。" : result.band === "良好" ? "建议加入复杂句、推论阅读与正式表达训练，提升稳定性。" : "建议挑战进阶写作、批判性阅读及自然口语表达。"}</p><div className="course-note"><b>试听课观察重点</b><span>口头反应速度、造句准确度，以及能否解释自己的答案。</span></div></div>
      </section>
      <div className="report-disclaimer"><b>Assessment note</b><span>本报告来自 5 分钟筛查测试，仅作为初步分班依据。最终程度应结合试听课口语互动及一份真实写作样本确认。</span></div>
      <button className="teacher-toggle" onClick={() => setTeacher(!teacher)}>{teacher ? "收起教师分析与答案" : "查看教师分析与答案"} <span>↘</span></button>
      {teacher && <section className="answer-key"><div className="teacher-note"><b>评分标准</b><span>基础 0–49 · 中等 50–69 · 良好 70–84 · 优秀 85–100</span><small>本测试为 5 分钟筛查工具，CEFR 仅供初步参考；建议结合试听课互动与真实写作再确认程度。</small></div><h2>答案与学生作答</h2>{test.questions.map((q, i) => <div className={`answer-row ${answers[i] === q.answer ? "right" : "wrong"}`} key={i}><b>{i + 1}. {categoryZh[q.category]}</b><p>{q.prompt}</p><span>正确：{q.options[q.answer]}</span><span>学生：{q.options[answers[i]]}</span><small>{q.note}</small></div>)}</section>}
    </main>;
  }

  const q = test.questions[index];
  return <main className="shell quiz-page">
    <header className="topbar"><div className="brand"><span className="academy-mark"><img src="/xueba-logo.png" alt="学霸教育补习学院" /></span><div><b>学霸教育补习学院</b><small>{test.label}</small></div></div><div className="timer">约 5 分钟</div></header>
    <div className="progress-head"><span>{categoryZh[q.category]} · {q.category}</span><b>{String(index + 1).padStart(2, "0")} <i>/ {test.questions.length}</i></b></div>
    <div className="progress"><i style={{width: `${((index + 1) / test.questions.length) * 100}%`}} /></div>
    <section className="question-card">
      {q.passage && <div className="passage">{q.passage}</div>}
      <h1>{q.prompt}</h1>
      <div className="options">{q.options.map((option, i) => <button key={option} className={selected === i ? "selected" : ""} onClick={() => setSelected(i)}><span>{String.fromCharCode(65 + i)}</span>{option}<i>{selected === i ? "●" : "○"}</i></button>)}</div>
      <div className="actions"><button className="back-btn" disabled={index === 0} onClick={previous}>← 上一题</button><small>答案可在提交前返回修改</small><button disabled={selected === null} onClick={next}>{index === test.questions.length - 1 ? "查看成绩" : "下一题"} →</button></div>
    </section>
  </main>;
}
