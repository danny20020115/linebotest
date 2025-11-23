import { useEffect, useState } from "react";

export default function VR() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/news")
      .then((res) => res.json())
      .then((data) => {
        setNews(Array.isArray(data.items) ? data.items : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("載入新聞錯誤:", err);
        setLoading(false);
      });
  }, []);

  return (
<section id="news" className="section section-bordered">

      <div className="container">
        <div className="section-header">
          <h2 className="section-title">最新新聞</h2>
          <p className="section-description">
            透過即時新聞了解產業動態，掌握最新的科技與復健趨勢。
          </p>
        </div>

        <div className="cards-grid">
          {loading ? (
            <p>載入中...</p>
          ) : news.length === 0 ? (
            <p>目前沒有新聞資料</p>
          ) : (
            news.map((item, index) => (
              <div key={index} className="card card-blue">
                <div className="card-icon">🗞️</div>
                <h3 className="card-title">{item.title}</h3>

                {/* 顯示科別與醫師 */}
                {(item.department || item.doctor) && (
                  <p className="card-meta">
                    {item.department && <span>{item.department}</span>}
                    {item.department && item.doctor && <span>｜</span>}
                    {item.doctor && <span>{item.doctor}</span>}
                  </p>
                )}

                <p className="card-description">
                  {item.date}｜{item.source}
                </p>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-button"
                >
                  閱讀更多 →
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
