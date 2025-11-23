// src/pages/AIGame.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./aigame.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

// 每題秒數（可自行調整）
const PER_QUESTION_SECONDS = 15;
// 初始生命值
const MAX_HEARTS = 3;

export default function AIGame() {
  // 工具列
  const [topic, setTopic] = useState("健康知識");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(5);
  const [nickname, setNickname] = useState("Danny"); // 可改成你的玩家暱稱

  // 遊戲狀態
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0); // 連擊
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [flash, setFlash] = useState(""); // "good" | "bad" | ""
  const [timeLeft, setTimeLeft] = useState(PER_QUESTION_SECONDS);

  // 歷史紀錄用
  const [sessionId, setSessionId] = useState(null);
  const [startTimeMs, setStartTimeMs] = useState(0);
  const [answersLog, setAnswersLog] = useState([]); // [{ qIndex, questionText, options, correctIndex, chosenIndex }]
  const [historySent, setHistorySent] = useState(false);

  const hasStarted = questions.length > 0;
  const finished = hasStarted && (index >= questions.length || hearts <= 0);

  // ---- 後端 API ----
  async function startQuizAPI({ topic, difficulty, count, nickname }) {
    const res = await fetch(`${API_BASE}/api/quiz/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, difficulty, count, nickname }),
    });
    if (!res.ok) throw new Error("無法建立測驗場次");
    return res.json(); // { sessionId }
  }

  async function submitQuizAPI({ sessionId, score, durationSeconds, answers }) {
    const res = await fetch(`${API_BASE}/api/quiz/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, score, durationSeconds, answers }),
    });
    if (!res.ok) throw new Error("送出歷史紀錄失敗");
    return res.json();
  }

  // 產生題目（並建立 session）
  async function generate() {
    setError("");
    setQuestions([]);
    setIndex(0);
    setSelected(null);
    setLocked(false);
    setScore(0);
    setStreak(0);
    setHearts(MAX_HEARTS);
    setTimeLeft(PER_QUESTION_SECONDS);
    setFlash("");

    // 歷史紀錄狀態重置
    setSessionId(null);
    setStartTimeMs(0);
    setAnswersLog([]);
    setHistorySent(false);

    setLoading(true);
    try {
      // 1) 建立一個新的測驗場次，拿 sessionId
      const s = await startQuizAPI({ topic, difficulty, count, nickname });
      setSessionId(s.sessionId);
      setStartTimeMs(Date.now());

      // 2) 產生題目
      const res = await fetch(`${API_BASE}/api/game/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, count }),
      });
      const ct = res.headers.get("content-type") || "";
      const payload = ct.includes("application/json") ? await res.json() : await res.text();
      if (!res.ok) throw new Error(typeof payload === "string" ? payload : payload?.error || "Unknown error");

      const qs = Array.isArray(payload.questions) ? payload.questions : [];
      setQuestions(qs);
      setTimeLeft(PER_QUESTION_SECONDS);
    } catch (e) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // 進度（%）
  const progress = useMemo(() => {
    if (!hasStarted) return 0;
    const done = Math.min(index, questions.length);
    return (done / questions.length) * 100;
  }, [hasStarted, index, questions.length]);

  // 每次換題：重置倒數與選擇
  useEffect(() => {
    if (!hasStarted || finished) return;
    setTimeLeft(PER_QUESTION_SECONDS);
    setSelected(null);
    setLocked(false);
    setFlash("");
  }, [index, hasStarted, finished]);

  // 倒數計時（自動判錯）
  useEffect(() => {
    if (!hasStarted || finished) return;
    if (locked) return;
    if (timeLeft <= 0) {
      // 時間到：當作答錯
      handleEvaluate(false, true);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, hasStarted, finished, locked]);

  function pick(i) {
    if (locked || finished) return;
    setSelected(i);
  }

  // 評分 + 動畫 + 進下一題 + 紀錄答案
  function handleEvaluate(isCorrect, isTimeout = false) {
    if (locked || finished) return;
    setLocked(true);

    // 先把這一題的作答寫進 answersLog
    const q = questions[index];
    const chosenIndex = isTimeout ? -1 : selected; // 超時用 -1 標記
    setAnswersLog((prev) => [
      ...prev,
      {
        qIndex: index,
        questionText: q.question,
        options: q.options,
        correctIndex: q.answerIndex,
        chosenIndex,
      },
    ]);

    if (isCorrect) {
      const bonus = Math.max(0, streak); // 連擊加分
      setScore((s) => s + 1 + bonus);
      setStreak((s) => s + 1);
      setFlash("good");
    } else {
      setStreak(0);
      setHearts((h) => Math.max(0, h - 1));
      setFlash("bad");
    }

    setTimeout(() => {
      setFlash("");
      if (hearts - (isCorrect ? 0 : 1) <= 0) {
        // Game Over
        setSelected(null);
        return;
      }
      setIndex((i) => i + 1);
    }, 800);
  }

  function submit() {
    if (selected == null || locked || finished) return;
    const isCorrect = selected === questions[index].answerIndex;
    handleEvaluate(isCorrect);
  }

  // 結束後自動送出歷史紀錄
  useEffect(() => {
    async function sendHistory() {
      try {
        const durationSeconds = Math.max(0, Math.round((Date.now() - startTimeMs) / 1000));
        const answers = answersLog.map((a) => ({
          qIndex: a.qIndex,
          questionText: a.questionText,
          options: a.options,
          correctIndex: a.correctIndex,
          chosenIndex: a.chosenIndex,
        }));
        await submitQuizAPI({ sessionId, score, durationSeconds, answers });
        setHistorySent(true);
      } catch (e) {
        console.error("送出歷史紀錄失敗：", e);
        // 不阻斷 UI；你也可以用 setError 顯示
      }
    }

    if (finished && sessionId && !historySent) {
      sendHistory();
    }
  }, [finished, sessionId, historySent, startTimeMs, answersLog, score]);

  // 鍵盤操作：1-4 / A-D 選項、Enter 送出
  useEffect(() => {
    function onKey(e) {
      if (!hasStarted || finished) return;
      const k = e.key.toLowerCase();
      const map = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 };
      if (Object.prototype.hasOwnProperty.call(map, k)) {
        pick(map[k]);
      } else if (k === "enter") {
        submit();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasStarted, finished, selected, locked, index, questions]);

  function restart() {
    setQuestions([]);
    setIndex(0);
    setSelected(null);
    setLocked(false);
    setScore(0);
    setStreak(0);
    setHearts(MAX_HEARTS);
    setFlash("");
    setTimeLeft(PER_QUESTION_SECONDS);
    setError("");

    setSessionId(null);
    setStartTimeMs(0);
    setAnswersLog([]);
    setHistorySent(false);
  }

  return (
    <div className={`quiz-page ${flash === "good" ? "flash-good" : ""} ${flash === "bad" ? "flash-bad" : ""}`}>
      <div className="quiz-wrap">
        <h1 className="quiz-title">AI 遊戲｜出題測驗</h1>
        <p className="quiz-sub">選好主題、難度與題數後，按「生成題目」。題目會一題一題出現，結束會自動儲存歷史紀錄。</p>

        {/* 工具列 */}
        <div className="quiz-toolbar">
          <div className="field">
            <label>暱稱</label>
            <input className="input" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          </div>
          <div className="field">
            <label>主題</label>
            <input className="input" value={topic} onChange={(e) => setTopic(e.target.value)} />
          </div>
          <div className="field">
            <label>難度</label>
            <select className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
          </div>
          <div className="field">
            <label>題數</label>
            <input
              className="input"
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Math.min(50, Math.max(1, parseInt(e.target.value || 5, 10))))}
            />
          </div>
          <div className="actions">
            <button className="btn btn-primary" onClick={generate} disabled={loading}>
              {loading ? "生成中…" : "生成題目"}
            </button>
          </div>
        </div>

        {error && <div className="error-box">錯誤：{error}</div>}

        {/* HUD */}
        {hasStarted && !finished && (
          <div className="hud">
            <div className="hearts">
              {Array.from({ length: MAX_HEARTS }).map((_, i) => (
                <span key={i} className={`heart ${i < hearts ? "on" : ""}`}>❤</span>
              ))}
            </div>

            <div className="hud-center">
              <div className="progress">
                <div className="bar" style={{ width: `${progress}%` }} />
              </div>
              <div className="hud-sub">
                <span>第 {index + 1} / {questions.length} 題</span>
                <span>STREAK × {streak}</span>
              </div>
            </div>

            <div className="timer">
              <div
                className="ring"
                style={{
                  background: `conic-gradient(#2563eb ${(timeLeft / PER_QUESTION_SECONDS) * 360}deg, #e5e7eb 0)`
                }}
              />
              <div className="sec">{timeLeft}</div>
            </div>
          </div>
        )}

        {/* 主區 */}
        {!hasStarted && !loading && !error && (
          <div className="quiz-hint">按「生成題目」開始遊戲！</div>
        )}

        {hasStarted && !finished && (
          <div className="quiz-card">
            <div className="quiz-question">
              {questions[index].question}
            </div>

            <div className="quiz-options">
              {questions[index].options.map((opt, i) => {
                const isPicked = selected === i;
                const correctIdx = questions[index].answerIndex;
                const showCorrectWrong = locked && selected != null;

                const state =
                  showCorrectWrong && i === correctIdx ? "correct"
                  : showCorrectWrong && i === selected && i !== correctIdx ? "wrong"
                  : isPicked ? "picked" : "";

                return (
                  <button
                    key={i}
                    className={`opt ${state}`}
                    onClick={() => pick(i)}
                    disabled={locked}
                  >
                    <span className="opt-key">{String.fromCharCode(65 + i)}.</span>
                    <span className="opt-text">{opt}</span>
                  </button>
                );
              })}
            </div>

            <div className="quiz-actions">
              <button className="btn btn-primary" onClick={submit} disabled={selected == null || locked}>
                送出答案（Enter）
              </button>
            </div>
          </div>
        )}

        {finished && (
          <div className="quiz-result">
            <div className="result-score">
              {hearts <= 0 ? "Game Over！" : "完成！"} 你的分數：{score} / {questions.length}
              {historySent ? "（已儲存歷史）" : "（儲存中…）"}
            </div>
            <div className="result-actions">
              <button className="btn btn-primary" onClick={restart}>再玩一次</button>
            </div>

            {/* 詳解（可選） */}
            <div className="result-explain">
              {questions.map((q, i) => (
                <div key={q.id ?? i} className="exp-item">
                  <div className="exp-q">{i + 1}. {q.question}</div>
                  <div className="exp-a">正確答案：{String.fromCharCode(65 + q.answerIndex)}</div>
                  {q.explanation && <div className="exp-txt">{q.explanation}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 簡易彩紙特效（正確時） */}
        {flash === "good" && <Confetti />}
      </div>
    </div>
  );
}

/** 小型彩紙動畫（純 CSS/Emoji） */
function Confetti() {
  const pieces = Array.from({ length: 24 }, (_, i) => i);
  return (
    <div className="confetti">
      {pieces.map((i) => (
        <span
          key={i}
          style={{
            left: Math.random() * 100 + "%",
            animationDelay: Math.random() * 0.2 + "s",
            fontSize: 14 + Math.random() * 10 + "px",
          }}
        >
          🎉
        </span>
      ))}
    </div>
  );
}
