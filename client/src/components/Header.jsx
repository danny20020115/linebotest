// src/components/Header.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header({ onLoginClick }) {
  // 讀取目前登入使用者（存在 localStorage 裡）
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("auth:user") || "null");
    } catch {
      return null;
    }
  });

  // 監聽登入/登出事件
  useEffect(() => {
    const onAuthChanged = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("auth:user") || "null"));
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("auth:changed", onAuthChanged);
    return () => window.removeEventListener("auth:changed", onAuthChanged);
  }, []);

  // 登出
  function handleLogout() {
    localStorage.removeItem("auth:token");
    localStorage.removeItem("auth:user");
    window.dispatchEvent(new CustomEvent("auth:changed"));
  }

  return (
    <header className="header">
      <div className="nav-wrapper">
        {/* ✅ Logo + 品牌文字 */}
        <Link to="/health" className="logo" aria-label="回首頁">
          <img
            className="log-img"
            src="/images/logo.png"   // 放在 public/images/logo.png
            alt="醫資心聯新 Logo"
          />
          <span className="logo-text">醫資心聯新</span>
        </Link>

        {/* 右側登入/使用者 */}
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
              <span className="login-icon" aria-hidden>👤</span>
              登入
            </button>
            
          )}
                  <button
          className="login-btn"onClick={() => (window.location.href = "/signup")}>
          <span className="login-icon" aria-hidden>👤</span>
            註冊
        </button>
        </div>
      </div>
    </header>
  );
}
