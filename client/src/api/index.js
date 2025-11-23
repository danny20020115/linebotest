const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

export async function chatAssistant(message) {
  const res = await fetch(`${API_BASE}/api/assistant/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  // 後端一定回 JSON；若不是就丟錯讓 UI 顯示友善訊息
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const text = await res.text();
    throw new Error(`API 非 JSON 回應：${text.slice(0, 120)}`);
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Assistant API failed");
  return data; // { reply }
}
