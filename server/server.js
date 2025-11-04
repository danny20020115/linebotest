// =============================================
// server/server.js  (整檔覆蓋)
// 強制以 server/.env 的值覆蓋任何系統環境變數
// 含：Auth(註冊/登入/JWT) + 題目產生(AI/本地) + 測驗寫入/查詢 + 助手 + 診斷 + 健康檢查
// =============================================

const path = require("path");
const dotenv = require("dotenv");

// 讀取 server/.env，並把需要的值強制寫回 process.env（避免被系統殘留覆蓋）
const loaded = dotenv.config({ path: path.join(__dirname, ".env") });
const envFromFile = loaded.parsed || {};
for (const k of [
  "OPENAI_API_KEY",
  "OPENAI_MODEL",
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASS",
  "DB_NAME",
  "PORT",
  "JWT_SECRET",
  "JWT_EXPIRES",
]) {
  if (envFromFile[k] !== undefined) process.env[k] = envFromFile[k];
}

// ---- 基本中介層 ----
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const mysql = require("mysql2/promise");

const app = express();
const PORT = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json()); // 解析 JSON body

// ---- MySQL 連線池 ----
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ========== Auth（bcrypt + JWT）==========
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "dev-secret", {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
}

function authMiddleware(req, _res, next) {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
  } catch {
    req.user = null;
  }
  next();
}
app.use(authMiddleware);

// ===== Auth: 註冊 =====
app.post("/api/auth/signup", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      gender,     // 'male' | 'female' | 'other'
      birthday,   // 'YYYY-MM-DD'
      height,     // cm
      weight,     // kg
      notes,
      diseases,   // 陣列，如 ["糖尿病","高血壓"] 或 ["無"]
    } = req.body || {};

    if (!username || !email || !password || !gender || !birthday || !height || !weight) {
      return res.status(400).json({ error: "缺少必要欄位" });
    }

    const [dup] = await pool.execute("SELECT id FROM users WHERE email = ?", [email]);
    if (dup.length) return res.status(409).json({ error: "此 email 已被註冊" });

    const password_hash = await bcrypt.hash(password, 12);

    const [r] = await pool.execute(
      `INSERT INTO users (email, password_hash, username, gender, birthday, height_cm, weight_kg, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [email, password_hash, username, gender, birthday, Number(height), Number(weight), notes || null]
    );
    const userId = r.insertId;

    if (Array.isArray(diseases) && diseases.length && !diseases.includes("無")) {
      const values = diseases
        .filter(d => typeof d === "string" && d.trim())
        .map(d => [userId, d.trim()]);
      if (values.length) {
        await pool.query(`INSERT INTO user_diseases (user_id, label) VALUES ?`, [values]);
      }
    }

    const token = signToken({ uid: userId, email });
    return res.json({
      ok: true,
      token,
      user: { id: userId, email, username, gender, birthday, height_cm: Number(height), weight_kg: Number(weight) },
    });
  } catch (e) {
    console.error("signup error:", e);
    return res.status(500).json({ error: "註冊失敗" });
  }
});

// ===== Auth: 登入 =====
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "缺少 email 或密碼" });

    const [rows] = await pool.execute(
      `SELECT id, email, password_hash, username, gender, birthday, height_cm, weight_kg
       FROM users WHERE email = ?`,
      [email]
    );
    if (!rows.length) return res.status(401).json({ error: "帳號或密碼錯誤" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "帳號或密碼錯誤" });

    const token = signToken({ uid: user.id, email: user.email });
    return res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        gender: user.gender,
        birthday: user.birthday,
        height_cm: user.height_cm,
        weight_kg: user.weight_kg,
      },
    });
  } catch (e) {
    console.error("login error:", e);
    return res.status(500).json({ error: "登入失敗" });
  }
});

// ===== 取得自己檔案（需要 Bearer token）=====
app.get("/api/me", async (req, res) => {
  if (!req.user?.uid) return res.status(401).json({ error: "未登入" });
  const [rows] = await pool.execute(
    `SELECT id, email, username, gender, birthday, height_cm, weight_kg, created_at
     FROM users WHERE id = ?`,
    [req.user.uid]
  );
  if (!rows.length) return res.status(404).json({ error: "找不到使用者" });
  res.json({ profile: rows[0] });
});

// ========== OpenAI 初始化 + 診斷 ==========
let openaiClient = null;
let usingProjKey = false;

try {
  const OpenAI = require("openai");
  const rawKey = (process.env.OPENAI_API_KEY || "").trim();
  usingProjKey = rawKey.startsWith("sk-proj-");
  if (rawKey) openaiClient = new OpenAI({ apiKey: rawKey });

  console.log("[assistant] OpenAI SDK loaded");
  console.log(
    `[assistant] key prefix: ${rawKey ? rawKey.slice(0, 8) + "…" : "(none)"} | type: ${
      usingProjKey ? "project-key" : rawKey ? "user-key" : "none"
    }`
  );
} catch {
  console.log("[assistant] openai SDK not installed; assistant will use local replies.");
}

// 診斷：檢測 key/模型是否可用（含 sk-proj）
app.get("/api/assistant/diag", async (_req, res) => {
  try {
    if (!openaiClient) {
      return res.json({
        ok: false,
        reason: "missing_key_or_sdk",
        hint: "請確認 server/.env 有 OPENAI_API_KEY，且在 server/ 安裝了 openai；並重啟 server。",
      });
    }
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const r = await openaiClient.chat.completions.create({
      model,
      messages: [{ role: "user", content: "ping" }],
      max_tokens: 5,
    });
    return res.json({
      ok: true,
      mode: usingProjKey ? "sk-proj" : "sk-user",
      model,
      finish_reason: r.choices?.[0]?.finish_reason,
    });
  } catch (e) {
    return res.status(200).json({
      ok: false,
      error: e.message,
      status: e.status || e.code,
      request_id: e.requestID || e.response?.headers?.get?.("x-request-id"),
      hint:
        "若是 401：1) key 是否正確且未失效；2) Project 是否允許該模型；3) .env 是否被覆蓋/有多餘空白；4) openai 套件為最新版。",
    });
  }
});

// 除錯：顯示目前 key 前後碼與長度
app.get("/api/assistant/which-key", (_req, res) => {
  const k = (process.env.OPENAI_API_KEY || "");
  res.json({ prefix: k.slice(0, 12), suffix: k.slice(-8), length: k.length });
});

// ---- 健康檢查 ----
app.get("/api/health", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ ok: rows[0]?.ok === 1 });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ---- 題目產生（優先用 OpenAI；失敗改本地）----
app.post("/api/game/generate", async (req, res) => {
  const { topic = "健康知識", difficulty = "medium", count: rawCount = 5 } = req.body || {};
  const count = Math.max(1, Math.min(20, Number(rawCount) || 5));

  const localBase = [
    { q: "水每天至少要喝多少較健康？", opts: ["100ml", "500ml", "1500~2000ml", "3000ml"], a: 2, exp: "一般建議成人每日約1500~2000ml，視活動量調整。" },
    { q: "哪個動作有助於緩解肩頸痠痛？", opts: ["長時間低頭滑手機", "溫和伸展", "整天躺著", "只喝能量飲"], a: 1, exp: "定時做肩頸伸展、活動關節可緩解緊繃。" },
    { q: "良好睡眠建議每晚約？", opts: ["3-4小時", "5-6小時", "7-9小時", "10-12小時"], a: 2, exp: "多數成人建議7~9小時。" },
    { q: "心肺有氧運動建議每週至少？", opts: ["30分鐘", "60分鐘", "150分鐘", "300分鐘"], a: 2, exp: "多數指引建議每週至少150分鐘中等強度。" },
    { q: "下列何者是常見腰痛的保護動作？", opts: ["彎腰搬重物", "背部打直蹲下起身", "猛然扭轉身體", "長時間保持同一姿勢"], a: 1, exp: "蹲下、靠近重量、背打直再起身可減少負擔。" },
  ];
  const toLocal = () => {
    const questions = Array.from({ length: count }).map((_, i) => {
      const it = localBase[i % localBase.length];
      return { id: i + 1, question: it.q, options: it.opts, answerIndex: it.a, explanation: it.exp };
    });
    return res.json({ questions });
  };

  if (!openaiClient) return toLocal();

  try {
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const system =
      "你是出題機器。請根據主題與難度產生多題四選一單選題。" +
      "只輸出 JSON（不要任何多餘字）。每題需包含 question、options(4個字串)、answerIndex(0~3)、explanation。";
    const user = `主題: ${topic}
難度: ${difficulty}
題數: ${count}
請輸出：
{
  "questions":[
    {"question":"...","options":["A","B","C","D"],"answerIndex":2,"explanation":"為何正確"}
  ]
}`;

    const r = await openaiClient.chat.completions.create({
      model,
      response_format: { type: "json_object" },
      temperature: difficulty === "hard" ? 0.9 : difficulty === "easy" ? 0.5 : 0.7,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const raw = r.choices?.[0]?.message?.content || "{}";
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return toLocal();
    }

    const items = Array.isArray(data.questions) ? data.questions.slice(0, count) : [];
    const cleaned = items
      .map((q, i) => {
        const opts = Array.isArray(q.options) ? q.options.slice(0, 4) : [];
        const ans = Number(q.answerIndex);
        if (
          typeof q.question !== "string" ||
          opts.length !== 4 ||
          !opts.every((s) => typeof s === "string" && s.trim()) ||
          !(ans >= 0 && ans < 4)
        ) return null;

        return {
          id: i + 1,
          question: q.question.trim(),
          options: opts.map((s) => s.trim()),
          answerIndex: ans,
          explanation: typeof q.explanation === "string" ? q.explanation.trim() : "",
        };
      })
      .filter(Boolean);

    if (cleaned.length === 0) return toLocal();
    while (cleaned.length < count) {
      const it = localBase[cleaned.length % localBase.length];
      cleaned.push({ id: cleaned.length + 1, question: it.q, options: it.opts, answerIndex: it.a, explanation: it.exp });
    }

    return res.json({ questions: cleaned.slice(0, count) });
  } catch (e) {
    console.warn("AI generate failed, fallback to local:", e.message);
    return toLocal();
  }
});

// ---- 開始一場測驗（用舊表欄位）----
app.post("/api/quiz/start", async (req, res) => {
  try {
    const { topic, difficulty, count, nickname = null } = req.body || {};
    if (!topic || !difficulty || !count) {
      return res.status(400).json({ error: "Missing topic/difficulty/count" });
    }
    const sessionUuid = uuidv4();

    await pool.execute(
      `INSERT INTO quiz_sessions (session_uuid, nickname, topic, difficulty, question_count)
       VALUES (?, ?, ?, ?, ?)`,
      [sessionUuid, nickname, topic, difficulty, count]
    );

    return res.json({ sessionId: sessionUuid });
  } catch (err) {
    console.error("start error:", err);
    return res.status(500).json({ error: "Failed to start session" });
  }
});

// ---- 交卷（用舊表欄位）----
app.post("/api/quiz/submit", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { sessionId, score, durationSeconds, answers } = req.body || {};
    if (!sessionId || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Missing sessionId or answers" });
    }

    await conn.beginTransaction();

    const [rows] = await conn.execute(
      `SELECT id FROM quiz_sessions WHERE session_uuid = ?`,
      [sessionId]
    );
    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: "Session not found" });
    }
    const sessionPk = rows[0].id;

    for (const a of answers) {
      const isCorrect = Number(a.chosenIndex === a.correctIndex);
      await conn.execute(
        `INSERT INTO quiz_answers
          (session_id, q_index, question_text, options_json, correct_index, chosen_index, is_correct)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          sessionPk,
          a.qIndex,
          a.questionText,
          JSON.stringify(a.options || []),
          a.correctIndex,
          a.chosenIndex,
          isCorrect,
        ]
      );
    }

    await conn.execute(
      `UPDATE quiz_sessions
       SET score = ?, duration_seconds = ?
       WHERE id = ?`,
      [Number(score || 0), Number(durationSeconds || 0), sessionPk]
    );

    await conn.commit();
    return res.json({ ok: true });
  } catch (err) {
    await conn.rollback();
    console.error("submit error:", err);
    return res.status(500).json({ error: "Failed to submit answers" });
  } finally {
    conn.release();
  }
});

// ---- 歷史（單場）----
app.get("/api/quiz/history/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const [sRows] = await pool.execute(
      `SELECT id, session_uuid, nickname, topic, difficulty, question_count, score, duration_seconds, created_at
       FROM quiz_sessions WHERE session_uuid = ?`,
      [sessionId]
    );
    if (sRows.length === 0) return res.status(404).json({ error: "Not found" });

    const session = sRows[0];

    const [aRows] = await pool.execute(
      `SELECT q_index, question_text, options_json, correct_index, chosen_index, is_correct, created_at
       FROM quiz_answers WHERE session_id = ? ORDER BY q_index ASC`,
      [session.id]
    );

    return res.json({
      session: {
        sessionId: session.session_uuid,
        nickname: session.nickname,
        topic: session.topic,
        difficulty: session.difficulty,
        questionCount: session.question_count,
        score: session.score,
        durationSeconds: session.duration_seconds,
        createdAt: session.created_at,
      },
      answers: aRows.map((r) => ({
        qIndex: r.q_index,
        questionText: r.question_text,
        options: r.options_json,
        correctIndex: r.correct_index,
        chosenIndex: r.chosen_index,
        isCorrect: !!r.is_correct,
        createdAt: r.created_at,
      })),
    });
  } catch (err) {
    console.error("history error:", err);
    return res.status(500).json({ error: "Failed to fetch history" });
  }
});

// ---- 歷史列表（某玩家）----
app.get("/api/quiz/history", async (req, res) => {
  try {
    const { nickname } = req.query;
    if (!nickname) return res.status(400).json({ error: "Missing nickname" });

    const [rows] = await pool.execute(
      `SELECT session_uuid, topic, difficulty, question_count, score, duration_seconds, created_at
       FROM quiz_sessions
       WHERE nickname = ?
       ORDER BY created_at DESC
       LIMIT 100`,
      [nickname]
    );

    return res.json({
      sessions: rows.map((r) => ({
        sessionId: r.session_uuid,
        topic: r.topic,
        difficulty: r.difficulty,
        questionCount: r.question_count,
        score: r.score,
        durationSeconds: r.duration_seconds,
        createdAt: r.created_at,
      })),
    });
  } catch (err) {
    console.error("history list error:", err);
    return res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

// ---- 可選：GET / ----
app.get("/", (_req, res) => {
  res.type("text").send("API running. Try GET /api/health, /api/assistant/diag or POST /api/game/generate");
});

// ==== AI 助手：POST /api/assistant/chat（失敗自動降級） ====
function localReply(message) {
  return `（示範回覆）你剛剛說：「${message}」。先提供一般建議：保持規律作息、適度運動、均衡飲食與補充水分。`;
}

app.post("/api/assistant/chat", async (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: "Missing message" });

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!openaiClient) {
    return res.json({ reply: localReply(message), mode: "local" });
  }

  try {
    const out = await openaiClient.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "你是友善且簡潔的健康助理。" },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    const reply = out.choices?.[0]?.message?.content?.trim() || "(沒有內容)";
    return res.json({
      reply,
      mode: usingProjKey ? "openai:sk-proj" : "openai:sk-user",
    });
  } catch (e) {
    console.warn("Assistant OpenAI error → fallback to local:", {
      status: e.status || e.code,
      request_id: e.requestID,
      message: e.message,
    });
    return res.json({ reply: localReply(message), mode: "local-fallback" });
  }
});

// ---- 啟動伺服器 ----
const server = app.listen(PORT, () => {
  console.log(`✅ Server listening at http://localhost:${PORT}`);
});
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} 已被占用，請先關掉舊的行程或改用其他 PORT。`);
  } else {
    console.error(err);
  }
});
