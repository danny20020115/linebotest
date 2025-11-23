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
import HealthKeeper from "./pages/HealthKeeper";

import AIGame from "./pages/AIGame";
import Signup from "./pages/Signup.jsx";
import HealthChat from "./pages/HealthChat.jsx";

import "./styles.css";
import "./pages/HealthKeeper.css";

/** 首頁 */
function HomeOnlyHero() {
  return <Hero />;
}

/** /games：AI 遊戲 + VR + 助理 */
function GamesPage() {
  const location = useLocation();

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

  /** ⭐ 新增：讓 Signup.jsx 可以呼叫登入彈窗 */
  useEffect(() => {
    const openLogin = () => setIsLoginOpen(true);
    window.addEventListener("open-login", openLogin);
    return () => window.removeEventListener("open-login", openLogin);
  }, []);

  return (
    <BrowserRouter>
      {/* 傳入開啟登入視窗的方法 */}
      <Header onLoginClick={() => setIsLoginOpen(true)} />

      <Routes>
        {/* 首頁 */}
        <Route path="/" element={<HomeOnlyHero />} />

        {/* 遊戲區 */}
        <Route path="/games" element={<GamesPage />} />

        {/* 健康管家 */}
        <Route path="/health-keeper" element={<HealthKeeper />} />

        {/* AI 測驗遊戲 */}
        <Route path="/ai-game" element={<AIGame />} />

        {/* 註冊頁 */}
        <Route path="/signup" element={<Signup />} />

        {/* 健康諮詢聊天頁 */}
        <Route path="/health/chat" element={<HealthChat />} />

        {/* 兜底：回首頁 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* ⭐ 登入彈窗（LoginModal） */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </BrowserRouter>
  );
}
