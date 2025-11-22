import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function BloodPressurePage({ token }) {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [records, setRecords] = useState([]);

  // 🩸 取得血壓紀錄
  const fetchData = async () => {
    const res = await fetch("http://localhost:3001/api/bloodpressure", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (json.ok) setRecords(json.records);
  };

  // 🩺 新增或更新血壓
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3001/api/bloodpressure", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ systolic, diastolic }),
    });
    setSystolic("");
    setDiastolic("");
    fetchData(); // 更新圖表
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 📊 準備折線圖資料
  const labels = records.map((r) => r.date);
  const systolicData = records.map((r) => r.systolic);
  const diastolicData = records.map((r) => r.diastolic);

  const chartData = {
    labels,
    datasets: [
      { label: "收縮壓(上壓)", data: systolicData, borderColor: "red", tension: 0.3 },
      { label: "舒張壓(下壓)", data: diastolicData, borderColor: "blue", tension: 0.3 },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: { display: true, text: "每日血壓變化圖" },
      legend: { position: "top" },
    },
  };

  return (
    <div style={{ width: "90%", margin: "30px auto", textAlign: "center" }}>
      <h2>📈 我的血壓紀錄</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="收縮壓"
          value={systolic}
          onChange={(e) => setSystolic(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="舒張壓"
          value={diastolic}
          onChange={(e) => setDiastolic(e.target.value)}
          required
        />
        <button type="submit">送出紀錄</button>
      </form>

      <div style={{ marginTop: "40px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
