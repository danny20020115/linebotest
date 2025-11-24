// src/components/Games.jsx
import { Link } from "react-router-dom";
import BodyMapWidget from "./BodyMapWidget"; // ✅ 改成引入元件版

function Games() {
  const games = [
    {
      icon: "🧠",
      title: "疾病專區",
      description: "透過圖示的方式，讓你更了解身體不同部位的常見疾病。",
      button: "立即試用 →",
      className: "card card-blue",
      link: "/MedicalBodyMap", // 這張照樣跳到獨立頁面
    },
    {
      icon: "🎯",
      title: "健康管家",
      description: "讓使用者練習應對常見問題並獲得即時回饋。透過實作方式強化自我照護與判斷能力。",
      button: "開始紀錄 →",
      className: "card card-teal",
      link: "/health-keeper",
    },
    {
      icon: "🎮",
      title: "健康知識王",
      description: "以寓教於樂的遊戲形式呈現疾病與治療知識，讓使用者在輕鬆互動中加深理解。透過答題累積成就，培養正確的健康觀念與行為。",
      button: "探索遊戲 →",
      className: "card card-green",
      link: "/ai-game", // 不跳頁，內嵌人體圖
    },
  ];

  return (
    <section id="games" className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">AI驅動的醫療遊戲</h2>
          <p className="section-description">
            透過互動式AI驅動的遊戲體驗，提升醫療培訓和患者參與度。
          </p>
        </div>

        <div className="cards-grid">
          {games.map((game, index) => (
            <div key={index} className={game.className}>
              <div className="card-icon">{game.icon}</div>
              <h3 className="card-title">{game.title}</h3>
               <p className="card-description">{game.description}</p>
               {game.link ? (
                <Link to={game.link} className="card-button">
                  {game.button}
                </Link>
              ) : (
                <button className="card-button">{game.button}</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default Games;
