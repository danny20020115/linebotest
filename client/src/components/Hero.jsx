// src/components/Hero.jsx
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">
      
      {/* ✅ 跑馬燈區塊 */}
      <div className="hero-marquee">
        <div className="marquee-track">
          {/* ✅ 第一輪圖片 */}
          <img src="/images/doctor4.png" alt="banner1" />
          <img src="/images/doctor1.png" alt="banner2" />
          <img src="/images/doctor2.png" alt="banner3" />
          <img src="/images/doctor3.png" alt="banner4" />
          {/* ✅ 無縫輪播：複製一份 */}
          <img src="/images/doctor.png" alt="banner1" />
          
        </div>
      </div>

      {/* ✅ 原本 Hero 文字內容 */}
      <div className="hero-content">
        <h1>
          革命性的 <span>醫療科技</span>
        </h1>
        <p>體驗 AI + VR 的未來醫療平台</p>

        <div className="hero-buttons">
          <Link to="/games" className="btn btn-primary">
            開始使用
          </Link>
          <Link to="/assistant" className="btn btn-secondary">
            了解更多
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
