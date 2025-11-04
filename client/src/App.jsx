// client/src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

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

/** 首頁：支援 initialSection 或 URL hash 自動捲動 */
function Home({ initialSection }) {
  const location = useLocation();

  useEffect(() => {
    const target =
      initialSection || (location.hash ? location.hash.replace("#", "") : "");
    if (!target) return;

    // 等待一個 frame，確保子元件 render 完成
    requestAnimationFrame(() => {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [initialSection, location.hash]);

  return (
    <>
      <Hero />
      {/* 請在這些元件的最外層各加上對應 id */}
      {/* <section id="games"><Games/></section> 等同於在元件內加 id */}
      <Games />      {/* 內層最外層要有 id="games" */}
      <VR />         {/* id="vr" */}
      <Assistant />  {/* id="assistant" */}
      <Footer />     {/* id="contact"（如果聯絡區放 Footer） */}
    </>
  );
}

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <BrowserRouter>
      <Header onLoginClick={() => setIsLoginOpen(true)} />

      <Routes>
        {/* 首頁（含區塊版） */}
        <Route path="/" element={<Home />} />
        <Route path="/health" element={<Home />} />

        {/* 直接導到特定區塊 */}
        <Route path="/health/games" element={<Home initialSection="games" />} />
        <Route path="/health/vr" element={<Home initialSection="vr" />} />
        <Route path="/health/assistant" element={<Home initialSection="assistant" />} />
        <Route path="/health/contact" element={<Home initialSection="contact" />} />

        {/* 其它頁面 */}
        <Route path="/ai-game" element={<AIGame />} />
        <Route path="/signup" element={<Signup />} />

        {/* 獨立聊天室頁 */}
        <Route path="/health/chat" element={<HealthChat />} />

        {/* 未匹配導回首頁 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </BrowserRouter>
  );
}
