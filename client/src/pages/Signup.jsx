// client/src/pages/Signup.jsx
import { useState } from "react";
import "./signup.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

const DISEASE_OPTIONS = [
  "糖尿病",
  "高血壓",
  "心臟病",
  "中風（腦中風）",
  "帕金森氏症",
  "慢性腎病",
  "慢性肝炎",
  "憂鬱症",
  "痛風",
  "長期失眠",
  "過敏性鼻炎",
  "無",
];

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    birthday: "",
    height: "",
    weight: "",
    notes: "",
    diseases: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleDisease = (label) => {
    setForm((prev) => {
      const exists = prev.diseases.includes(label);
      if (label === "無") {
        return { ...prev, diseases: exists ? [] : ["無"] };
      }
      const next = exists
        ? prev.diseases.filter((d) => d !== label)
        : [...prev.diseases.filter((d) => d !== "無"), label];
      return { ...prev, diseases: next };
    });
  };

  const update = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("兩次密碼不一致");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        gender: form.gender,
        birthday: form.birthday, // yyyy-mm-dd
        height: Number(form.height),
        weight: Number(form.weight),
        notes: form.notes,
        diseases: form.diseases,
      };

      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "註冊失敗");
      }

      // 與登入一致：存 auth token + user，並通知全站更新
      localStorage.setItem("auth:token", data.token);
      localStorage.setItem("auth:user", JSON.stringify(data.user));
      window.dispatchEvent(new CustomEvent("auth:changed"));

      alert("註冊成功！");
      window.location.href = "/"; // 你想導去哪裡都可以
    } catch (err) {
      setError(err.message || "註冊失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <div className="logo">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2966/2966486.png"
            alt="hospital icon"
          />
          <h1>醫資心聯新</h1>
        </div>

        {/* 基本帳號資料 */}
        <div className="grid-2">
          <input
            type="text"
            placeholder="使用者名稱"
            required
            value={form.username}
            onChange={update("username")}
          />
          <input
            type="email"
            placeholder="電子郵件"
            required
            value={form.email}
            onChange={update("email")}
          />
          <input
            type="password"
            placeholder="密碼"
            required
            value={form.password}
            onChange={update("password")}
            minLength={6}
          />
          <input
            type="password"
            placeholder="確認密碼"
            required
            value={form.confirmPassword}
            onChange={update("confirmPassword")}
            minLength={6}
          />
        </div>

        {/* 個人資料 */}
        <div className="grid-2">
          <select required value={form.gender} onChange={update("gender")}>
            <option value="">選擇性別</option>
            <option value="male">男性</option>
            <option value="female">女性</option>
            <option value="other">其他</option>
          </select>
          <input
            type="date"
            required
            value={form.birthday}
            onChange={update("birthday")}
          />
          <input
            type="number"
            placeholder="身高 (cm)"
            required
            value={form.height}
            onChange={update("height")}
            min="1"
          />
          <input
            type="number"
            placeholder="體重 (kg)"
            required
            value={form.weight}
            onChange={update("weight")}
            min="1"
          />
        </div>

        {/* 病史 */}
        <label className="section-title">過去的長期病病紀錄：</label>
        <div className="checkbox-group">
          {DISEASE_OPTIONS.map((label) => (
            <label key={label}>
              <input
                type="checkbox"
                checked={form.diseases.includes(label)}
                onChange={() => toggleDisease(label)}
              />
              {label}
            </label>
          ))}
        </div>

        {/* 其他說明 */}
        <textarea
          placeholder="其他健康說明（選填）"
          value={form.notes}
          onChange={update("notes")}
        />

        {error && <p className="error-msg">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "註冊中…" : "註冊"}
        </button>

        <p className="login-link">
          已有帳號？ <a href="/?login=1">點此登入</a>
        </p>
      </form>
    </div>
  );
}
