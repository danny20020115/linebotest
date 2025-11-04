// client/src/components/LoginModal.jsx
import React, { useState, useEffect } from "react";
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "登入失敗");

      // ✅ 登入成功：儲存登入資料
      localStorage.setItem("auth:token", data.token);
      localStorage.setItem("auth:user", JSON.stringify(data.user));

      // ✅ 通知 Header 更新
      window.dispatchEvent(new CustomEvent("auth:changed"));
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`modal ${isOpen ? "is-open" : ""}`} onClick={onClose}>
      <div className="modal-content login-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">登入</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login_email">電子郵件</label>
            <input
              id="login_email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="請輸入您的電子郵件"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login_password">密碼</label>
            <input
              id="login_password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="請輸入您的密碼"
              required
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "登入中..." : "登入"}
          </button>
        </form>

        {/* Footer */}
        <p className="signup-line">
          還沒有帳號？{" "}
          <button
            className="link-like"
            type="button"
            onClick={() => {
              onClose();
              window.location.href = "/signup";
            }}
          >
            立即註冊
          </button>
        </p>
      </div>
    </div>
  );
}
