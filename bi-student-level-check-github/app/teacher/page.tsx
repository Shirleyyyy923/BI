import { requireChatGPTUser } from "../chatgpt-auth";
import { listSubmissions, teacherEmails } from "../../db/submissions";
import { TeacherDashboard } from "./teacher-dashboard";

export const dynamic = "force-dynamic";

export default async function TeacherPage() {
  const user = await requireChatGPTUser("/teacher");
  const allowed = teacherEmails();
  if (!allowed.includes(user.email.toLowerCase())) {
    return <main className="teacher-shell denied"><div className="teacher-login"><img src="/xueba-logo.png" alt="学霸教育补习学院" /><span>Teacher Access</span><h1>此账号没有后台权限</h1><p>你目前使用 {user.email} 登入。请联络网站管理员加入教师名单。</p><a href="/signout-with-chatgpt?return_to=/teacher">更换账号</a></div></main>;
  }
  const submissions = await listSubmissions();
  return <TeacherDashboard submissions={submissions} teacherName={user.displayName} />;
}
