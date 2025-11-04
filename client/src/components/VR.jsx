// src/components/VR.jsx
function VR() {
  const features = [
    { icon: "⚡", text: "更快的康復時間" },
    { icon: "🛡️", text: "安全的虛擬環境" },
    { icon: "👥", text: "個人化療程計劃" },
  ];

  const vrPrograms = [
    { name: "運動技能訓練", status: "可預約" },
    { name: "平衡與協調", status: "可預約" },
    { name: "認知復健", status: "可預約" },
  ];

  return (
    <section id="vr" className="section section-gray">
      <div className="container">
        <div className="two-column">
          {/* 左側內容 */}
          <div className="column">
            <h2 className="section-title">VR復健療程</h2>
            <p className="section-description">
              沉浸式虛擬實境環境，旨在加速康復過程，
              讓各年齡層患者的復健變得有趣且有效。
            </p>

            <div className="features-list">
              {features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <div className="feature-icon">{feature.icon}</div>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            <button className="btn btn-teal">預約VR療程</button>
          </div>

          {/* 右側內容 */}
          <div className="column">
            <div className="vr-demo">
              <div className="demo-header">
                <div className="demo-icon">🎧</div>
                <h3>VR療程項目</h3>
              </div>
              <div className="demo-list">
                {vrPrograms.map((program, index) => (
                  <div key={index} className="demo-item">
                    <span>{program.name}</span>
                    <span className="status available">{program.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VR;
