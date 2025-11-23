// src/components/LoginModal.jsx
import React, { useEffect, useState } from "react";
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "登入失敗");
      localStorage.setItem("token", data.token);
      alert("登入成功！");
      onClose();
      // 需要時刷新頁面或拉個人資料
      // window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className={`modal ${isOpen ? "is-open" : ""}`} onClick={onClose}>
      <div className="modal-content login-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">登入</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="login_email">電子郵件</label>
            <input
              id="login_email" type="email" placeholder="請輸入您的電子郵件"
              value={email} onChange={(e)=>setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="login_password">密碼</label>
            <input
              id="login_password" type="password" placeholder="請輸入您的密碼"
              value={password} onChange={(e)=>setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full">登入</button>
        </form>

        <p className="signup-line">
          還沒有帳號？ <button className="link-like" type="button" onClick={() => {
            onClose();
            window.location.href = "/signup";
          }}>立即註冊</button>
        </p>
      </div>
    </div>
  );
}
