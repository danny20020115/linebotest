// src/components/Header.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header({ onLoginClick }) {
  // 讀取目前登入使用者（存在 localStorage 裡）
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("auth:user") || "null"); }
    catch { return null; }
  });

  // 監聽登入/登出事件，讓 Header 即時更新
  useEffect(() => {
    const onAuthChanged = () => {
      try { setUser(JSON.parse(localStorage.getItem("auth:user") || "null")); }
      catch { setUser(null); }
    };
    window.addEventListener("auth:changed", onAuthChanged);
    return () => window.removeEventListener("auth:changed", onAuthChanged);
  }, []);

  // 登出：清掉 localStorage 並廣播事件
  function handleLogout() {
    localStorage.removeItem("auth:token");
    localStorage.removeItem("auth:user");
    window.dispatchEvent(new CustomEvent("auth:changed"));
  }

  return (
    <header className="header">
      <div className="container-heard">
        <div className="nav-wrapper">
          {/* Logo（點 Logo 一律回到 /health 首頁） */}
          <Link to="/health" className="logo" aria-label="回首頁">
            <div className="logo-icon">❤️</div>
            <span className="logo-text">醫資心聯新</span>
          </Link>

          {/* Navigation：絕對路徑 + 錨點 */}
          <nav className="nav">
            <Link to="/health#games" className="nav-link">AI遊戲</Link>
            <Link to="/health#vr" className="nav-link">VR復健</Link>
            <Link to="/health#assistant" className="nav-link">AI助手</Link>
            <Link to="/health#contact" className="nav-link">聯絡我們</Link>
          </nav>

          {/* 右側：登入/使用者 */}
          <div className="auth-area">
            {user ? (
              <div className="auth-logged-in">
                <span className="hello">你好，{user.username || user.email}</span>
                <button className="login-btn" onClick={handleLogout}>
                  登出
                </button>
              </div>
            ) : (
              <button className="login-btn" onClick={onLoginClick}>
                <span className="login-icon">👤</span>
                登入
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
