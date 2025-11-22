// src/components/Games.jsx
import { Link } from "react-router-dom";

function Games() {
  const games = [
    {
      icon: "🧠",
      title: "患者教育",
      description: "引人入勝的遊戲，幫助患者了解他們的病情和治療計劃。",
      button: "立即試用 →",
      className: "card card-blue",
      link: "/MedicalBodyMap",
    },
    {
      icon: "🎯",
      title: "健康管家",
      description: "在無風險的虛擬環境中練習手術程序，並獲得即時反饋。",
      button: "開始訓練 →",
      className: "card card-teal",
      link: "/health-keeper",
    },
    {
      icon: "🎮",
      title: "AI 人體互動遊戲",
      description: "互動式人體定位與診斷教學遊戲，提升醫療教育體驗。",
      button: "探索遊戲 →",
      className: "card card-green",
      link: "/ai-game",  // ← 現在改成正常跳頁
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

              {game.link && (
                <Link to={game.link} className="card-button">
                  {game.button}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Games;
