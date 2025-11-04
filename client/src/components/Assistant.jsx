// src/components/Assistant.jsx
import { Link } from "react-router-dom";

function Assistant() {
  const features = [
    "💬 即時症狀評估",
    "🩺 藥物提醒與交互作用檢查",
    "❤️ 健康監測與追蹤",
  ];

  const messages = [
    { sender: "ai", text: "您好！我在這裡幫助您解答健康問題。今天感覺如何？" },
    { sender: "user", text: "我這幾天一直頭痛..." },
    { sender: "ai", text: "我可以幫您評估症狀。讓我問您幾個問題..." },
  ];

  return (
    <section id="assistant" className="section">
      <div className="container">
        {/* 標題區 */}
        <div className="section-header">
          <h2 className="section-title">24/7 AI醫療助手</h2>
          <p className="section-description">
            從我們先進的AI助手獲得即時醫療指導、症狀分析和健康建議。
          </p>
        </div>

        <div className="ai-assistant-demo">
          {/* 左側功能 */}
          <div className="assistant-content">
            <h3 className="assistant-title">您的個人健康夥伴</h3>
            <ul className="assistant-features">
              {features.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            {/* 前往獨立聊天室頁 */}
            <Link to="/health/chat" className="btn btn-white">
              與AI助手對話
            </Link>
          </div>

          {/* 右側聊天 demo */}
          <div className="chat-demo">
            <div className="chat-header">
              <div className="chat-avatar">🤖</div>
              <span className="chat-name">AI助手</span>
              <div className="online-status"></div>
            </div>
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}-message`}>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Assistant;
