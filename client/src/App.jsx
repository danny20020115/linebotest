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
import MedicalBodyMap from "./pages/MedicalBodyMap"; // 🔥 新增互動人體頁面
import AIGame from "./pages/AIGame";
import Signup from "./pages/Signup.jsx";
import HealthChat from "./pages/HealthChat.jsx";

import "./styles.css";
import "./pages/HealthKeeper.css";

/** 首頁（只有 Hero） */
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
      {/* 所有頁面都會先看到 Header */}
      <Header onLoginClick={() => setIsLoginOpen(true)} />

      <Routes>
        {/* 首頁 */}
        <Route path="/" element={<HomeOnlyHero />} />

        {/* 遊戲主頁（AI遊戲 + VR + 助理） */}
        <Route path="/games" element={<GamesPage />} />

        {/* 健康管家 */}
        <Route path="/health-keeper" element={<HealthKeeper />} />

        {/* AI Game */}
        <Route path="/ai-game" element={<AIGame />} />

        {/* 🔥 新增互動人體疾病地圖頁 */}
        <Route path="/MedicalBodyMap" element={<MedicalBodyMap />} />

        {/* 註冊 / 健康小助手聊天 */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/health/chat" element={<HealthChat />} />

        {/* 兜底：全部導回首頁 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* 登入 Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </BrowserRouter>
  );
}
