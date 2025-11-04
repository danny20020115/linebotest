// src/components/Footer.jsx
import { Link } from "react-router-dom";

function Footer() {
  const services = [
    { text: "AI遊戲", href: "/ai-game" }, // ✅ 改成路由
    { text: "VR復健", href: "#vr" },
    { text: "AI助手", href: "#assistant" },
    { text: "遠程醫療", href: "#" },
  ];

  const company = [
    { text: "關於我們", href: "#" },
    { text: "職業機會", href: "#" },
    { text: "隱私政策", href: "#" },
    { text: "服務條款", href: "#" },
  ];

  const contacts = [
    { icon: "📞", text: "+886 2 1234-5678" },
    { icon: "✉️", text: "hello@medtechplus.com" },
    { icon: "📍", text: "台北市信義區醫療街123號" },
  ];

  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* 公司資訊 */}
          <div className="footer-column">
            <div className="footer-logo">
              <div className="logo-icon">❤️</div>
              <span className="logo-text">MedTech Plus</span>
            </div>
            <p className="footer-description">
              透過AI和VR技術革新醫療保健。
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

          {/* 公司資訊 */}
          <div className="footer-column">
            <h3 className="footer-title">公司資訊</h3>
            <ul className="footer-links">
              {company.map((item, i) => (
                <li key={i}>
                  <a href={item.href}>{item.text}</a>
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
