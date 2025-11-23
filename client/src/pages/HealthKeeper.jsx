// client/src/pages/HealthKeeper.jsx
import React, { useState } from "react";
import "./HealthKeeper.css";

// 全部 API 都走 /api/ 開頭，交給 React 開發伺服器的 proxy 轉發
const API_BASE = "http://localhost:3001/api";

// 三種模式的文字設定
const MODE_CONFIG = {
  bp: {
    key: "bp",
    tabLabel: "血壓",
    label1: "收縮壓",
    placeholder1: "例如 120",
    label2: "舒張壓",
    placeholder2: "例如 80",
    label3: "心跳",
    placeholder3: "例如 75",
    hint: "異常值：90 < 收縮壓 >= 180，舒張壓 >= 110",
    listHeaders: ["日期時間", "收縮壓", "舒張壓", "心跳"],
    chartTitle: "收縮壓趨勢圖",
    chartUnit: "mmHg",
  },
  bs: {
    key: "bs",
    tabLabel: "血糖",
    label1: "血糖值 (mg/dL)",
    placeholder1: "例如 95",
    label2: "測量時段",
    placeholder2: "例如 飯前 / 飯後",
    label3: "備註",
    placeholder3: "例如 早餐前測量",
    hint: "一般空腹血糖約 70–99 mg/dL 為正常範圍，實際請依醫師指示判讀。",
    listHeaders: ["日期時間", "血糖值", "時段", "備註"],
    chartTitle: "血糖值趨勢圖",
    chartUnit: "mg/dL",
  },
  bmi: {
    key: "bmi",
    tabLabel: "BMI",
    label1: "身高 (cm)",
    placeholder1: "例如 170",
    label2: "體重 (kg)",
    placeholder2: "例如 65.5",
    label3: "BMI",
    placeholder3: "會依身高體重自動計算",
    hint: "一般成人 BMI 約 18.5–24 為理想範圍，實際請依醫師建議評估。",
    listHeaders: ["日期時間", "身高", "體重", "BMI"],
    chartTitle: "BMI 變化趨勢圖",
    chartUnit: "",
  },
};

/**
 * 解析日期時間：
 *  - 支援「114/11/10 07:30」(民國)
 *  - 也支援「2024-11-10 07:30」(西元)
 */
function parseRocDateTime(str) {
  if (!str) return new Date(0);

  const [datePart, timePart = "0:0"] = str.trim().split(" ");
  const [hh = 0, mm = 0] = timePart.split(":").map(Number);

  if (datePart.includes("/")) {
    // 民國：114/11/10
    const [rocYear, m, d] = datePart.split("/").map(Number);
    const year = rocYear + 1911;
    return new Date(year, m - 1, d, hh, mm);
  } else if (datePart.includes("-")) {
    // 西元：2024-11-10
    const [y, m, d] = datePart.split("-").map(Number);
    return new Date(y, m - 1, d, hh, mm);
  }

  return new Date(0);
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

/** 簡單折線圖（用 SVG 畫，含 X / Y 軸與刻度） */
function SimpleLineChart({ data, unit, label, color }) {
  if (!data || data.length === 0) {
    return <div className="hk-chart-empty">目前尚無資料</div>;
  }

  const values = data.map((d) => d.y);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min || 1) * 0.15;
  const yMin = Math.floor(min - padding);
  const yMax = Math.ceil(max + padding);

  const width = 120;
  const height = 80;
  const marginLeft = 18;
  const marginRight = 4;
  const marginTop = 6;
  const marginBottom = 10;

  const chartWidth = width - marginLeft - marginRight;
  const chartHeight = height - marginTop - marginBottom;

  const points = data
    .map((d, idx) => {
      const x =
        marginLeft +
        chartWidth * (data.length === 1 ? 0.5 : idx / (data.length - 1));
      const yNorm = (d.y - yMin) / (yMax - yMin || 1);
      const y = marginTop + chartHeight * (1 - yNorm);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="hk-chart-wrapper">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="hk-chart-svg-xy"
      >
        {/* Y 軸 */}
        <line
          x1={marginLeft}
          y1={marginTop}
          x2={marginLeft}
          y2={marginTop + chartHeight}
          className="hk-chart-axis"
        />

        {/* X 軸 */}
        <line
          x1={marginLeft}
          y1={marginTop + chartHeight}
          x2={marginLeft + chartWidth}
          y2={marginTop + chartHeight}
          className="hk-chart-axis"
        />

        {/* 水平格線 + Y 刻度值 */}
        {[0, 0.5, 1].map((pos, i) => {
          const y = marginTop + chartHeight * pos;
          const value =
            pos === 0
              ? yMax
              : pos === 0.5
              ? Math.round((yMax + yMin) / 2)
              : yMin;
          return (
            <g key={i}>
              <line
                x1={marginLeft}
                y1={y}
                x2={marginLeft + chartWidth}
                y2={y}
                className="hk-chart-grid"
              />
              <text
                x={marginLeft - 2}
                y={y + 3}
                textAnchor="end"
                fontSize="6"
                fill="#00325b"
              >
                {value}
              </text>
            </g>
          );
        })}

        {/* Y 軸標籤：血壓 / 血糖 / BMI */}
        <text
          x={4}
          y={marginTop + chartHeight / 2}
          fontSize="7"
          fill="#00325b"
          textAnchor="middle"
          transform={`rotate(-90 4 ${marginTop + chartHeight / 2})`}
        >
          {label}
        </text>

        {/* 折線 */}
        <polyline
          points={points}
          className="hk-chart-line-strong"
          style={{ stroke: color }}
        />

        {/* 節點 */}
        {data.map((d, idx) => {
          const x =
            marginLeft +
            chartWidth * (data.length === 1 ? 0.5 : idx / (data.length - 1));
          const yNorm = (d.y - yMin) / (yMax - yMin || 1);
          const y = marginTop + chartHeight * (1 - yNorm);
          return (
            <circle
              key={idx}
              cx={x}
              cy={y}
              r="1.6"
              className="hk-chart-dot-big"
              style={{ stroke: color }}
            />
          );
        })}
      </svg>

      {/* X 軸日期標籤（在 SVG 下方跑一行） */}
      <div className="hk-chart-xlabels-2">
        {data.map((d) => (
          <span key={d.x}>{d.x}</span>
        ))}
      </div>
    </div>
  );
}

export default function HealthKeeper() {
  // 目前模式：bp=血壓、bs=血糖、bmi=BMI
  const [mode, setMode] = useState("bp");

  // 畫面模式：create=新增、list=查詢列表、chart=圖表
  const [viewMode, setViewMode] = useState("create");

  // 查詢區間：1m=一個月、3m=三個月、6m=半年、1y=一年（目前先給 chart 用）
  const [range, setRange] = useState("1m");

  // 從後端讀回來的資料
  const [dataByMode, setDataByMode] = useState({
    bp: [],
    bs: [],
    bmi: [],
  });

  const [loading, setLoading] = useState(false);

  // 共用欄位
  const [form, setForm] = useState({
    rocYear: "114",
    month: "11",
    day: "15",
    hour: "14",
    minute: "46",
    value1: "",
    value2: "",
    value3: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const next = { ...prev, [name]: value };

      // BMI 模式自動計算 value3
      if (mode === "bmi" && (name === "value1" || name === "value2")) {
        const heightCm = parseFloat(name === "value1" ? value : next.value1);
        const weightKg = parseFloat(name === "value2" ? value : next.value2);
        if (heightCm > 0 && weightKg > 0) {
          const bmi = weightKg / Math.pow(heightCm / 100, 2);
          next.value3 = bmi.toFixed(1);
        } else {
          next.value3 = "";
        }
      }

      return next;
    });
  };

  // ====== 從後端抓列表資料 GET /api/health/:mode ======
  const fetchList = async (targetMode = mode) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/health/${targetMode}`);
      const url = `${API_BASE}/health/${mode}`;

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        // 後端若回 HTML（Express 預設 error page），這裡會抓到
        throw new Error("後端沒有回 JSON，而是：" + text.slice(0, 80));
      }

      if (!res.ok || data.ok === false) {
        throw new Error(data.error || res.statusText);
      }

      // 目前預期格式：{ ok: true, items: [...] }
      const items = Array.isArray(data.items)
        ? data.items
        : Array.isArray(data.rows)
        ? data.rows
        : [];

      setDataByMode((prev) => ({
        ...prev,
        [targetMode]: items,
      }));
    } catch (err) {
      console.error(err);
      alert("❌ 無法讀取資料：" + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ====== 存檔：POST /api/health/:mode ======
  const handleSave = async () => {
    try {
      const url = `${API_BASE}/health/${mode}`;

      const payload = {
        rocYear: form.rocYear,
        month: form.month,
        day: form.day,
        hour: form.hour,
        minute: form.minute,
        value1: form.value1,
        value2: form.value2,
        value3: form.value3,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("後端沒有回 JSON，而是：" + text.slice(0, 80));
      }

      if (!res.ok || data.ok === false) {
        throw new Error(data.error || res.statusText);
      }

      alert(`✅ 已成功儲存 ${MODE_CONFIG[mode].tabLabel}！`);

      // 清空數值，日期時間留著
      setForm((prev) => ({
        ...prev,
        value1: "",
        value2: "",
        value3: "",
      }));

      // 重新載入列表
      await fetchList(mode);
    } catch (err) {
      console.error(err);
      alert(`❌ 儲存失敗：${err.message}`);
    }
  };

  const handleReset = () => {
    setForm((prev) => ({
      ...prev,
      value1: "",
      value2: "",
      value3: "",
    }));
  };

  const handleExit = () => {
    window.history.back();
  };

  const cfg = MODE_CONFIG[mode];
  const listData = dataByMode[mode] || [];

  // 根據 range 過濾出要畫在圖表上的資料
  let filteredForChart = listData;
  if (listData && listData.length > 0) {
    const withDate = listData.map((item) => ({
      ...item,
      _date: parseRocDateTime(item.dateTime),
    }));

    // 找出最新日期
    const latest = withDate.reduce((a, b) => (a._date > b._date ? a : b))._date;

    let days = 30;
    if (range === "3m") days = 90;
    else if (range === "6m") days = 180;
    else if (range === "1y") days = 365;

    const cutoff = new Date(latest.getTime() - days * 24 * 60 * 60 * 1000);
    filteredForChart = withDate.filter((item) => item._date >= cutoff);
  }

  // 圖表要用的資料（用 v1 當主線；BMI 用 v3）
  const chartData = filteredForChart.map((d) => ({
    x: d.dateTime,
    y: mode === "bmi" ? Number(d.v3) : Number(d.v1),
  }));

  return (
    <div className="healthkeeper-page">
      <div>
        {/* 上方三個模式切換按鈕：血壓 / 血糖 / BMI */}
        <div className="hk-top-tabs">
          {Object.values(MODE_CONFIG).map((m) => (
            <button
              key={m.key}
              type="button"
              className={
                "hk-top-tab" + (m.key === mode ? " hk-top-tab--active" : "")
              }
              onClick={() => {
                setMode(m.key);
                setViewMode("create");
              }}
            >
              {m.tabLabel}
            </button>
          ))}
        </div>

        {/* 藍色主面板 */}
        <div className="healthkeeper-panel">
          <div className="hk-main-title-bar">彭柏洋先生健康資料</div>

          {/* 工具列：分成兩排 */}
          <div className="hk-toolbar-2row">
            {/* 第一排：類型 + 新增 */}
            <div className="hk-row">
              <select
                className="hk-select hk-half"
                value={mode}
                onChange={(e) => {
                  setMode(e.target.value);
                  setViewMode("create");
                }}
              >
                <option value="bp">血壓</option>
                <option value="bs">血糖</option>
                <option value="bmi">BMI</option>
              </select>

              <button
                className="hk-btn hk-btn-small"
                type="button"
                onClick={() => setViewMode("create")}
              >
                新增
              </button>
            </div>

            {/* 第二排：月份 + 查詢 + 圖表 */}
            <div className="hk-row">
              <select
                className="hk-select hk-half"
                value={range}
                onChange={(e) => setRange(e.target.value)}
              >
                <option value="1m">一個月</option>
                <option value="3m">三個月</option>
                <option value="6m">半年</option>
                <option value="1y">一年</option>
              </select>

              <div className="hk-row-right">
                <button
                  className="hk-btn hk-btn-small"
                  type="button"
                  onClick={async () => {
                    await fetchList(mode);
                    setViewMode("list");
                  }}
                >
                  查詢
                </button>
                <button
                  className="hk-btn hk-btn-small"
                  type="button"
                  onClick={async () => {
                    await fetchList(mode);
                    setViewMode("chart");
                  }}
                >
                  圖表
                </button>
              </div>
            </div>
          </div>

          {/* 小標：新增 / 查詢結果 / 趨勢圖 */}
          <div className="hk-subtitle-bar">
            {viewMode === "create"
              ? "新增"
              : viewMode === "list"
              ? "查詢結果"
              : "趨勢圖"}
          </div>

          {/* 內容：依 viewMode 決定是表單 / 列表 / 圖表 */}
          {viewMode === "create" && (
            <>
              {/* 表單區 */}
              <div className="hk-form">
                {/* 記錄日期（民國） */}
                <div className="hk-form-row">
                  <div className="hk-label">
                    記錄日期
                    <br />
                    （民國）
                  </div>
                  <div className="hk-field">
                    <div className="hk-inline-inputs">
                      <input
                        className="hk-input"
                        name="rocYear"
                        value={form.rocYear}
                        onChange={handleChange}
                        placeholder="114"
                      />
                      <input
                        className="hk-input"
                        name="month"
                        value={form.month}
                        onChange={handleChange}
                        placeholder="11"
                      />
                      <input
                        className="hk-input"
                        name="day"
                        value={form.day}
                        onChange={handleChange}
                        placeholder="15"
                      />
                    </div>
                  </div>
                </div>

                {/* 記錄時間 24時制 */}
                <div className="hk-form-row">
                  <div className="hk-label">
                    記錄時間
                    <br />
                    24時制
                  </div>
                  <div className="hk-field">
                    <div className="hk-time-group">
                      <input
                        className="hk-input"
                        name="hour"
                        value={form.hour}
                        onChange={handleChange}
                        placeholder="14"
                      />
                      <span>：</span>
                      <input
                        className="hk-input"
                        name="minute"
                        value={form.minute}
                        onChange={handleChange}
                        placeholder="46"
                      />
                    </div>
                  </div>
                </div>

                {/* 第 1 列欄位 */}
                <div className="hk-form-row">
                  <div className="hk-label">{cfg.label1}</div>
                  <div className="hk-field">
                    <input
                      className="hk-input"
                      name="value1"
                      value={form.value1}
                      onChange={handleChange}
                      placeholder={cfg.placeholder1}
                    />
                  </div>
                </div>

                {/* 第 2 列欄位：血糖模式改成下拉選單（飯前 / 飯後 / …） */}
                <div className="hk-form-row">
                  <div className="hk-label">{cfg.label2}</div>
                  <div className="hk-field">
                    {mode === "bs" ? (
                      <select
                        className="hk-select hk-select-full"
                        name="value2"
                        value={form.value2}
                        onChange={handleChange}
                      >
                        <option value="">請選擇測量時段</option>
                        <option value="飯前">飯前</option>
                        <option value="飯後">飯後</option>
                        <option value="起床後">起床後</option>
                        <option value="睡前">睡前</option>
                        <option value="隨機">隨機</option>
                        <option value="運動前">運動前</option>
                        <option value="運動後">運動後</option>
                        <option value="門診採血">門診採血</option>
                        <option value="其他">其他</option>
                      </select>
                    ) : (
                      <input
                        className="hk-input"
                        name="value2"
                        value={form.value2}
                        onChange={handleChange}
                        placeholder={cfg.placeholder2}
                      />
                    )}
                  </div>
                </div>

                {/* 第 3 列欄位 */}
                <div className="hk-form-row">
                  <div className="hk-label">{cfg.label3}</div>
                  <div className="hk-field">
                    <input
                      className="hk-input"
                      name="value3"
                      value={form.value3}
                      onChange={handleChange}
                      placeholder={cfg.placeholder3}
                      readOnly={mode === "bmi"} // BMI 第三欄唯讀
                    />
                  </div>
                </div>
              </div>

              {/* 提示文字 */}
              <div className="hk-hint">{cfg.hint}</div>
            </>
          )}

          {viewMode === "list" && (
            <>
              {/* 查詢列表區 */}
              <div className="hk-list">
                {loading && <div className="hk-list-note">讀取中…</div>}
                <div className="hk-list-table">
                  <div className="hk-list-row hk-list-row--header">
                    {cfg.listHeaders.map((h) => (
                      <div key={h} className="hk-list-cell">
                        {h}
                      </div>
                    ))}
                  </div>
                  {listData.map((item, idx) => (
                    <div key={idx} className="hk-list-row">
                      <div className="hk-list-cell">{item.dateTime}</div>
                      <div className="hk-list-cell">{item.v1}</div>
                      <div className="hk-list-cell">{item.v2}</div>
                      <div className="hk-list-cell">{item.v3}</div>
                    </div>
                  ))}
                </div>
                <div className="hk-list-note">
                  僅供參考，實際判讀請依醫師指示。
                </div>
              </div>

              <div className="hk-hint">{cfg.hint}</div>
            </>
          )}

          {viewMode === "chart" && (
            <>
              <div className="hk-chart">
                <div className="hk-chart-title">{cfg.chartTitle}</div>

                <SimpleLineChart
                  data={chartData}
                  unit={cfg.chartUnit}
                  label={
                    mode === "bp"
                      ? "血壓 (mmHg)"
                      : mode === "bs"
                      ? "血糖 (mg/dL)"
                      : "BMI"
                  }
                  color={
                    mode === "bp"
                      ? "#d9534f" // 血壓：紅
                      : mode === "bs"
                      ? "#f0ad4e" // 血糖：橘
                      : "#2759b8" // BMI：藍
                  }
                />

                <div className="hk-chart-legend">
                  折線代表最近量測的 {cfg.tabLabel} 變化趨勢，僅供參考，實際判讀請依醫師指示。
                </div>
              </div>

              <div className="hk-hint">{cfg.hint}</div>
            </>
          )}

          {/* 底部按鈕：依 viewMode 顯示不同 */}
          <div className="hk-footer-buttons">
            {viewMode === "create" ? (
              <>
                <button className="hk-btn" type="button" onClick={handleSave}>
                  存檔
                </button>
                <button className="hk-btn" type="button" onClick={handleReset}>
                  重填
                </button>
                <button className="hk-btn" type="button" onClick={handleExit}>
                  離開
                </button>
              </>
            ) : viewMode === "list" ? (
              <>
                <button
                  className="hk-btn"
                  type="button"
                  onClick={() => setViewMode("create")}
                >
                  回到新增
                </button>
                <button className="hk-btn" type="button" onClick={handleExit}>
                  離開
                </button>
              </>
            ) : (
              <>
                <button
                  className="hk-btn"
                  type="button"
                  onClick={() => setViewMode("create")}
                >
                  回到新增
                </button>
                <button
                  className="hk-btn"
                  type="button"
                  onClick={() => setViewMode("list")}
                >
                  查看列表
                </button>
                <button className="hk-btn" type="button" onClick={handleExit}>
                  離開
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
