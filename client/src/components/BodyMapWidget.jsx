// src/components/BodyMapWidget.jsx
import React, { useState } from "react";

const SYSTEMS = {
  neuro: {
    id: "neuro",
    name: "神經系統",
    description: "與腦部與神經傳導相關，包含頭暈、頭痛、癲癇、巴金森氏症等。",
    diseases: ["頭暈 / 頭痛", "神經異常", "癲癇症", "巴金森氏症", "神經痛", "腦中風", "腦部病變"],
  },
  eye: {
    id: "eye",
    name: "眼科",
    description: "負責視力與視覺相關疾病。",
    diseases: ["白內障", "青光眼", "黃斑部病變", "乾眼症"],
  },
  ent: {
    id: "ent",
    name: "耳鼻喉科",
    description: "耳朵、鼻腔與喉嚨相關問題。",
    diseases: ["中耳炎", "鼻竇炎", "慢性咽喉炎", "過敏性鼻炎"],
  },
  chest: {
    id: "chest",
    name: "呼吸胸腔",
    description: "與肺部與胸腔相關疾病。",
    diseases: ["氣喘", "慢性阻塞性肺病（COPD）", "肺炎"],
  },
  heart: {
    id: "heart",
    name: "心血管",
    description: "與心臟與血管相關，如高血壓與冠心病。",
    diseases: ["高血壓", "冠狀動脈心臟病", "心律不整", "心肌梗塞"],
  },
  gi: {
    id: "gi",
    name: "肝膽腸胃",
    description: "與消化系統相關，包括肝臟、膽囊與腸胃道。",
    diseases: ["胃潰瘍", "腸胃炎", "脂肪肝", "B 型肝炎"],
  },
  kidney: {
    id: "kidney",
    name: "泌尿腎臟",
    description: "與腎臟及泌尿道相關疾病。",
    diseases: ["腎結石", "慢性腎臟病", "膀胱炎", "尿道感染"],
  },
  ortho: {
    id: "ortho",
    name: "骨科 / 復健",
    description: "骨骼、關節與肌肉相關。",
    diseases: ["骨折", "退化性關節炎", "肌腱炎", "下背痛"],
  },
  obgyn: {
    id: "obgyn",
    name: "婦產科",
    description: "女性生殖系統與懷孕相關疾病。",
    diseases: ["子宮肌瘤", "多囊性卵巢症候群", "更年期症候群"],
  },
  dental: {
    id: "dental",
    name: "牙科・口腔",
    description: "與牙齒與口腔健康相關，包含牙周病、齒列矯正與植牙等。",
    diseases: ["牙炎", "牙周病", "牙齒矯正", "植牙 / 假牙", "其他口腔疾病"],
  },
};

/**
 * 用「角度」來決定圓球位置，讓 10 顆球繞著綠人形成一個圓
 * 中心：大約在 figure 的 (50%, 52%)
 * 半徑：X 比較小一點、Y 大一點，看起來比較像原圖
 */
const CENTER_X = 50;
const CENTER_Y = 49;
const RADIUS_X = 60;
const RADIUS_Y = 44;

// 以 -90 度在正上方，順時針每顆球間隔 36 度（360 / 10）
const NODE_CONFIG = [
  { id: "neuro",  label: "神經系統", icon: "🧠", angle: -90 }, // 上
  { id: "eye",    label: "眼科",     icon: "👁️", angle: -50 },
  { id: "ent",    label: "耳鼻喉",   icon: "👂", angle: -15 },
  { id: "chest",  label: "呼吸胸腔", icon: "🫁", angle: 18 },
  { id: "obgyn",  label: "婦產科",   icon: "♀️", angle: 52 },
  { id: "ortho",  label: "骨科復健", icon: "🦵", angle: 90 },  // 下
  { id: "kidney", label: "泌尿腎臟", icon: "🧪", angle: 128 },
  { id: "gi",     label: "肝膽腸胃", icon: "🩺", angle: 162 },
  { id: "dental", label: "牙科・口腔", icon: "🦷", angle: 194 },
  { id: "heart",  label: "心血管",   icon: "❤️", angle: 230 },
];

// 把角度轉成實際的 x / y (%)
const BODY_NODES = NODE_CONFIG.map((cfg) => {
  const rad = (cfg.angle * Math.PI) / 180;
  const x = CENTER_X + RADIUS_X * Math.cos(rad);
  const y = CENTER_Y + RADIUS_Y * Math.sin(rad);
  return {
    ...cfg,
    x: `${x}%`,
    y: `${y}%`,
  };
});

export default function BodyMapWidget() {
  const [activeId, setActiveId] = useState("neuro");
  const active = SYSTEMS[activeId];

  return (
    <div className="body-map-layout">
      {/* 左側：疾病專區按鈕 */}
      <div className="body-map-sidebar">
        <div className="body-map-sidebar-title">疾病專區</div>
        {Object.values(SYSTEMS).map((sys) => (
          <button
            key={sys.id}
            onClick={() => setActiveId(sys.id)}
            className={
              "body-map-sidebar-btn" +
              (activeId === sys.id ? " body-map-sidebar-btn-active" : "")
            }
          >
            {sys.name}
          </button>
        ))}
      </div>

      {/* 中間：綠人 + 10 顆圓球 */}
      <div className="body-map-figure-wrapper">
        <div className="body-map-figure">
          <div className="body-human">
            <div className="body-head" />
            <div className="body-upper">
              <div className="body-arm body-arm-left" />
              <div className="body-torso" />
              <div className="body-arm body-arm-right" />
            </div>
            <div className="body-lower">
              <div className="body-leg body-leg-left" />
              <div className="body-leg body-leg-right" />
            </div>
          </div>
        </div>

        {BODY_NODES.map((node) => (
          <button
            key={node.id}
            onClick={() => setActiveId(node.id)}
            style={{
              top: node.y,
              left: node.x,
              transform: "translate(-50%, -50%)",
            }}
            className={
              "body-map-node" +
              (activeId === node.id ? " body-map-node-active" : "")
            }
          >
            <span className="body-map-node-icon">{node.icon}</span>
            <span className="body-map-node-label">{node.label}</span>
          </button>
        ))}
      </div>

      {/* 右側：疾病資訊 */}
      <div className="body-map-info">
        <p className="body-map-info-hint">
          點選人體周圍部位或左側分類，可查看相對應的疾病資訊
        </p>
        <h3 className="body-map-info-title">{active.name}</h3>
        <p className="body-map-info-desc">{active.description}</p>

        <h4 className="body-map-info-subtitle">常見相關疾病：</h4>
        <ul className="body-map-info-list">
          {active.diseases.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
