// src/pages/MedicalBodyMap.jsx
import React from "react";
import BodyMapWidget from "../components/BodyMapWidget";
import "./MedicalBodyMap.css";

export default function MedicalBodyMap() {
  return (
    <main className="body-map-page">
      <div className="body-map-page-inner">
        <header className="body-map-page-header">
          <h1 className="body-map-page-title">患者教育｜互動式人體疾病地圖</h1>
          <p className="body-map-page-text">
            點選人體周圍的部位或左側分類，查看常見疾病與簡要說明。
          </p>
        </header>

        <div className="body-map-page-card">
          <BodyMapWidget />
        </div>
      </div>
    </main>
  );
}
