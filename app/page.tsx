"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.replace("/bridge-home/");
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        background: "#f8f5ef",
        color: "#27302d",
        fontFamily: "sans-serif",
        textAlign: "center",
      }}
    >
      <p>
        브릿지 덴탈 노트 홈페이지로 이동 중입니다.{" "}
        <a href="/bridge-home/" style={{ color: "inherit", fontWeight: 700 }}>
          바로 이동하기
        </a>
      </p>
    </main>
  );
}
