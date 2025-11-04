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

import AIGame from "./pages/AIGame";
import Signup from "./pages/Signup.jsx";
import HealthChat from "./pages/HealthChat.jsx";

import "./styles.css";

/** 首頁只有 Hero + Footer */
function HomeOnlyHero() {
  return (
    <>
      <Hero />
      
    </>
  );
}

/** ✅ 直接把 GamesPage 定義在這支檔案內（避免找不到檔案） */
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
      <Games />      {/* id="games" 在元件內 */}
      <VR />         {/* 最外層已是 id="vr" */}
      <Assistant />  {/* 最外層已是 id="assistant" */}
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

        {/* /games：依序顯示 Games → VR → Assistant → Footer */}
        <Route path="/games" element={<GamesPage />} />

        {/* 單獨的 AI 測驗頁 */}
        <Route path="/ai-game" element={<AIGame />} />

        {/* 其他頁面 */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/health/chat" element={<HealthChat />} />

        {/* 兜底導回首頁 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </BrowserRouter>
  );
}
