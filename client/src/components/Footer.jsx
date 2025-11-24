// src/components/Footer.jsx
import { Link } from "react-router-dom";

function Footer() {
  const services = [
    { text: "知識王", href: "/ai-game" }, // ✅ 改成路由
    { text: "健康管家", href: "/Health-keeper" },
    { text: "疾病專區", href: "/assistant" },
    { text: "AI醫療助手", href: "#" },
  ];

  const company = [
    { text: "關於我們", href: "" },
    { text: "隱私政策", href: "" },
  ];

  const contacts = [
    { icon: "📞", text: "+886-3-265-9999" },
    { icon: "📍", text: "320桃園市中壢區中北路200號" },
  ];

  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* 公司資訊 */}
          <div className="footer-column">
            <div className="footer-logo">
              <div className="logo-icon"></div>
             <h3> <span className="logo-text">醫資心聯新</span></h3>
            </div>
            <p className="footer-description">
            我們運用 AI 技術打造智慧醫療體驗，提供健康助手、互動式醫療遊戲、個人化健康管理與即時諮詢服務，
            健康管家模擬及醫療知識遊戲，同時搭配最新醫療資訊與專業建議。
            </p>
          </div>

          {/* 服務項目 */}
          <div className="footer-column">
            <h3 className="footer-title">服務項目</h3>
            <ul className="footer-links">
              {services.map((item, i) => (
                <li key={i}>
                  {/* ✅ 如果是 / 開頭 → 用 Link */}
                  {item.href.startsWith("/") ? (
                    <Link to={item.href}>{item.text}</Link>
                  ) : (
                    <a href={item.href}>{item.text}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>



          {/* 聯絡方式 */}
          <div className="footer-column">
            <h3 className="footer-title">聯絡方式</h3>
            <div className="contact-info">
              {contacts.map((c, i) => (
                <div key={i} className="contact-item">
                  <span className="contact-icon">{c.icon}</span>
                  <span>{c.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 醫資心連新。</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;