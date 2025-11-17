// client/src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Games from "./components/Games";
import VR from "./components/VR";
import Assistant from "./components/Assistant";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import HealthKeeper from "./pages/HealthKeeper"; // 健康管家頁面

import AIGame from "./pages/AIGame";
import Signup from "./pages/Signup.jsx";
import HealthChat from "./pages/HealthChat.jsx";

import "./styles.css";
import "./pages/HealthKeeper.css"; // ✅ 全域匯入健康管家的 CSS（重點）

/** 首頁：目前只有 Hero */
function HomeOnlyHero() {
  return (
    <>
      <Hero />
    </>
  );
}

/** /games：AI 遊戲 + VR + 助理 + Footer */
function GamesPage() {
  const location = useLocation();

  // 支援 /games#vr /games#assistant 平滑捲動
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location]);

  return (
    <>
      <Games />
      <VR />
      <Assistant />
      <Footer />
    </>
  );
}

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <BrowserRouter>
      <Header onLoginClick={() => setIsLoginOpen(true)} />

      <Routes>
        {/* 首頁 */}
        <Route path="/" element={<HomeOnlyHero />} />

        {/* 遊戲總頁（AI 遊戲 + VR + 助理） */}
        <Route path="/games" element={<GamesPage />} />

        {/* 健康管家頁面 */}
        <Route path="/health-keeper" element={<HealthKeeper />} />

        {/* 單獨 AI 測驗頁 */}
        <Route path="/ai-game" element={<AIGame />} />

        {/* 其他頁面 */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/health/chat" element={<HealthChat />} />

        {/* 兜底導回首頁 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </BrowserRouter>
  );
}
