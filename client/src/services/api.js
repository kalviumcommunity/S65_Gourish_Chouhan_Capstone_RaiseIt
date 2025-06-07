const API_BASE = "https://raiseit.onrender.com/api";

export async function getConcerns() {
  const res = await fetch(`${API_BASE}/concerns`);
  if (!res.ok) throw new Error("Failed to fetch concerns");
  return res.json();
}

export async function createConcern(data) {
  const res = await fetch(`${API_BASE}/concerns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create concern");
  return res.json();
}