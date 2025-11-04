// src/pages/HealthChat.jsx
import React, { useEffect, useRef, useState } from "react";
import "./HealthChat.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

export default function HealthChat() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "您好！我是醫資心連新的 AI 助手，需要我幫什麼忙？" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const endRef = useRef(null);
  const inputRef = useRef(null);

  // ← 改成直接抓「外層可捲動容器」.hc-faq-viewport
  const faqViewportRef = useRef(null);

  // 每次有新訊息，自動捲到底
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 支援網址 ?q=xxx 直接帶入輸入框
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setInput(q);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, []);

  function handleQuickAsk(q) {
    setInput(q);
    inputRef.current?.focus();
    // 如果要點了直接送出，打開下兩行
    // if (!loading) {
    //   sendMessage(q);
    // }
  }

  // 左右箭頭控制捲動（單位用 viewport 寬度 80%，最小 320 px）
  function scrollFaq(direction) {
    const viewport = faqViewportRef.current;
    if (!viewport) return;
    const gap = Math.max(viewport.clientWidth * 0.8, 320);
    viewport.scrollBy({
      left: direction === "left" ? -gap : gap,
      behavior: "smooth",
    });
  }

  async function sendMessage(text) {
    if (!text.trim()) return;
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", text }]);

    try {
      const res = await fetch(`${API_BASE}/api/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const ct = res.headers.get("content-type") || "";
      const payload = ct.includes("application/json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        const err =
          typeof payload === "string" ? payload : payload?.error || "Server error";
        throw new Error(err);
      }

      const reply =
        (typeof payload === "object" &&
          (payload.reply || payload.message || payload.answer)) ||
        (typeof payload === "string" ? payload : "");

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: reply || "（沒有取得回覆內容）" },
      ]);
    } catch (e) {
      const msg = e?.message?.startsWith("<!DOCTYPE")
        ? "API 回傳非 JSON：多半是路由不存在或被 Proxy 擋到。"
        : e?.message || "無法連線到伺服器";
      setMessages((prev) => [...prev, { role: "system", text: `⚠️ ${msg}` }]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    sendMessage(text);
  }

  return (
    <div className="hc-page">
      {/* 頁面頂部：跟站上導覽列銜接的子 Header（左上角有頭像） */}
      <header className="hc-header">
        <div className="hc-header-inner">
          <div className="hc-brand">
            <div className="hc-avatar-lg" aria-hidden>
              🤖
            </div>
            <div>
              <h1 className="hc-title">AI 醫療助手</h1>
              <p className="hc-sub">
                點選下方常見健康問題即可快速帶入輸入框，也可直接輸入你想聊的主題。
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* FAQ：一列橫向滑動；兩端是圓圈內的箭頭 */}
      <section className="hc-faq-strip">
        <button
          className="hc-faq-nav btn-left"
          onClick={() => scrollFaq("left")}
          aria-label="往左"
          type="button"
        >
          <span>‹</span>
        </button>

        <div className="hc-faq-viewport" ref={faqViewportRef}>
          <div className="hc-faq-rail">
            {CARD_GROUPS.map((g) => (
              <section key={g.title} className="hc-card">
                <h3 className="hc-card-title">{g.title}</h3>
                <ul className="hc-card-list">
                  {g.items.map((it, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        className="hc-link"
                        onClick={() => handleQuickAsk(it.ask)}
                        title={it.ask}
                      >
                        {it.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>

        <button
          className="hc-faq-nav btn-right"
          onClick={() => scrollFaq("right")}
          aria-label="往右"
          type="button"
        >
          <span>›</span>
        </button>
      </section>

      {/* 聊天面板：加大、可滾動 */}
      <main className="hc-chat-wrap">
        <div className="hc-chat-panel">
          <div className="hc-thread">
            {messages.map((m, i) => (
              <Message key={i} role={m.role} text={m.text} />
            ))}
            <div ref={endRef} />
          </div>

          <form onSubmit={handleSubmit} className="hc-composer">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="輸入訊息（Enter 送出，Shift+Enter 換行）…"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button type="submit" disabled={loading}>
              {loading ? "送出中…" : "送出"}
            </button>
          </form>

          <p className="hc-disclaimer">
            此頁僅提供一般性健康/保健資訊示意，非醫囑；如有緊急或嚴重不適請盡速就醫。
          </p>
        </div>
      </main>
    </div>
  );
}

/* ---- AI 回覆美化：把以 - 或 • 開頭的行視為清單，其餘視為段落 ---- */
function RichText({ text }) {
  const lines = String(text)
    .split(/\r?\n/)
    .map((s) => s.trim());
  const blocks = [];
  let currentList = [];

  const flushList = () => {
    if (currentList.length) {
      blocks.push(
        <ul className="hc-list" key={`ul-${blocks.length}`}>
          {currentList.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line) => {
    if (!line) {
      flushList();
      return;
    }
    if (/^[-•]\s+/.test(line)) {
      currentList.push(line.replace(/^[-•]\s+/, ""));
    } else {
      flushList();
      blocks.push(
        <p className="hc-paragraph" key={`p-${blocks.length}`}>
          {line}
        </p>
      );
    }
  });
  flushList();
  return <>{blocks}</>;
}

/* ---- 訊息泡泡 ---- */
function Message({ role, text }) {
  const cls =
    role === "user" ? "hc-row user" : role === "system" ? "hc-row system" : "hc-row ai";
  return (
    <div className={cls}>
      {role === "ai" && <div className="hc-avatar">🤖</div>}
      <div className="hc-bubble">
        <RichText text={text} />
      </div>
    </div>
  );
}

/* ---- 顧客常見問題（健康/保健） ---- */
const CARD_GROUPS = [
  {
    title: "飲食與營養",
    items: [
      { text: "三餐怎麼吃才均衡？", ask: "想吃得均衡健康，三餐的主食、蛋白質與蔬果份量怎麼抓？" },
      { text: "外食族如何選擇？", ask: "外食常見品項中，哪些較健康？有什麼點餐與替換小技巧？" },
      { text: "高蛋白飲食適合我嗎？", ask: "高蛋白飲食對一般人有什麼好處與注意事項？腎功能正常者可行嗎？" },
      { text: "油、鹽、糖要怎麼控？", ask: "日常飲食中，如何實際降低油鹽糖的攝取？有簡單做法嗎？" },
      { text: "益生菌與腸道保健", ask: "想改善腸道健康，益生菌、膳食纖維與發酵食品要怎麼搭配？" },
    ],
  },
  {
    title: "睡眠與作息",
    items: [
      { text: "睡不著怎麼辦？", ask: "常常入睡困難或半夜醒，想改善需要從哪些習慣著手？" },
      { text: "理想睡眠時長", ask: "不同年齡層建議的睡眠時數是多少？補眠有效嗎？" },
      { text: "改善打呼與鼾聲", ask: "打呼很大聲，白天常想睡，怎麼自我改善？有哪些生活建議？" },
      { text: "晚睡追劇如何戒？", ask: "總是滑手機追劇到很晚，有哪些實用的作息重整技巧？" },
      { text: "白天精神不濟", ask: "白天容易疲倦分心，可能與哪些睡眠或生活習慣有關？" },
    ],
  },
  {
    title: "心理與壓力調適",
    items: [
      { text: "壓力大怎麼紓壓？", ask: "長期壓力大，日常有哪些簡單可行的放鬆與減壓方法？" },
      { text: "專注力下降", ask: "最近很難專心工作或讀書，如何調整環境與作息來改善？" },
      { text: "焦慮與緊張", ask: "容易緊張焦慮，想學一些呼吸或身心放鬆技巧，有哪些方法？" },
      { text: "情緒飲食怎麼辦", ask: "情緒低落就想吃甜食，如何避免情緒性進食？" },
      { text: "建立穩定習慣", ask: "想建立運動與早睡等新習慣，如何降低放棄率？" },
    ],
  },
  {
    title: "慢性病自我管理（健康向）",
    items: [
      { text: "高血壓日常注意", ask: "如果血壓偏高，日常飲食與運動怎麼做能穩定血壓？" },
      { text: "血脂不佳怎麼吃？", ask: "膽固醇或三酸甘油脂偏高，日常飲食要注意什麼？" },
      { text: "血糖控制觀念", ask: "容易餐後血糖高，怎麼安排飲食順序與運動改善？" },
      { text: "代謝症候群", ask: "腰圍、血糖、血壓、血脂異常的生活改善策略有哪些？" },
      { text: "體檢指標怎麼看", ask: "年度健檢常見指標（如肝功能、腎功能）基礎解讀與生活建議？" },
    ],
  },
  {
    title: "居家急救與用藥（一般常識）",
    items: [
      { text: "居家常備藥怎麼準備？", ask: "家裡常備藥需要哪些？感冒、腸胃不適與外傷的基本配備？" },
      { text: "頭痛/胃痛處理", ask: "偶發頭痛或胃痛時，先做哪些自我觀察與舒緩？何時需就醫？" },
      { text: "過敏急性反應", ask: "季節交替容易鼻過敏或皮膚癢，居家有哪些緩解方式？" },
      { text: "運動傷害處理", ask: "扭傷拉傷，RICE 原則如何操作？後續恢復與復健重點？" },
      { text: "營養品怎麼選", ask: "維他命與礦物質補充品需要嗎？怎麼評估是否該補充？" },
    ],
  },
  {
    title: "不同族群的健康照護",
    items: [
      { text: "孩童發育與飲食", ask: "學齡兒童需要注意哪些飲食與運動重點，幫助成長與免疫？" },
      { text: "青少年作息與近視", ask: "青少年常晚睡與長時間使用 3C，如何降低近視與注意力問題？" },
      { text: "女性常見健康議題", ask: "經期不適、鐵質不足、骨質保健，日常有哪些調整建議？" },
      { text: "男性健康自我檢測", ask: "中年男性常見的啤酒肚、血脂偏高，如何自我檢視與調整？" },
      { text: "長者行動與防跌", ask: "長輩在家如何安全行走與訓練肌力，降低跌倒風險？" },
    ],
  },
];
