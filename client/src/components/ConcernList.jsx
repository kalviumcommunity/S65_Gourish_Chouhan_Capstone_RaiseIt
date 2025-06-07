import { useEffect, useState } from "react";
import { getConcerns } from "../services/api";

export default function ConcernList() {
  const [concerns, setConcerns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConcerns()
      .then(setConcerns)
      .catch((e) => alert(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!concerns.length) return <div>No concerns found.</div>;

  return (
    <div className="space-y-4">
      {concerns.map((c) => (
        <div key={c._id} className="p-4 border rounded shadow">
          <h2 className="font-bold">{c.title}</h2>
          <p>{c.description}</p>
          {c.user && (
            <div className="text-sm text-gray-500">
              By: {c.user.name} ({c.user.email})
            </div>
          )}
        </div>
      ))}
    </div>
  );
}