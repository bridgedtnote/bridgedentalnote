import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "브릿지덴탈노트 | 환자와 치과를 이해로 잇다",
  description: "어르신도 이해하기 쉬운 그림 중심 치과 안내 콘텐츠와 반복 업무 효율화 도구",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
