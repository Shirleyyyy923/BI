import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BI English Level Check | 英文程度测试",
  description: "适合马来西亚 Form 1–5 学生的 5 分钟 KSSM / CEFR 英文程度测试。",
  metadataBase: new URL("https://bi-student-level-check.minxuen-0923.chatgpt.site"),
  openGraph: {
    title: "BI English Level Check",
    description: "5 分钟了解学生的真实英文程度。",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BI English Level Check",
    description: "5 分钟 KSSM · CEFR 英文程度测试",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hans"><body>{children}</body></html>;
}
