// src/pages/GamesPage.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Games from "../components/Games";
import VR from "../components/VR";
import Assistant from "../components/Assistant";
import Footer from "../components/Footer";

function useScrollToHash() {
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location]);
}

export default function GamesPage() {
  useScrollToHash();
  return (
    <>
      <Games />      {/* id="games" 已在元件內 */}
      <VR />         {/* 最外層已是 id="vr" */}
      <Assistant />  {/* 請確保最外層是 id="assistant" */}
      <Footer />
    </>
  );
}
