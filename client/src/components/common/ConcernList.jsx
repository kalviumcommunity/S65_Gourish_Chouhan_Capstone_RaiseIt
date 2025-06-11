import { updateConcern, deleteConcern } from "../services/api";
import { useState } from "react";

export default function ConcernList({ refresh, onRefresh }) {
  const [concerns, setConcerns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    setLoading(true);
    getConcerns()
      .then(setConcerns)
      .catch((e) => alert(e.message))
      .finally(() => setLoading(false));
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this concern?")) return;
    await deleteConcern(id);
    onRefresh();
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setEditTitle(c.title);
    setEditDescription(c.description);
  };

  const handleEdit = async (id) => {
    await updateConcern(id, { title: editTitle, description: editDescription });
    setEditingId(null);
    onRefresh();
  };

  if (loading) return <div>Loading...</div>;
  if (!concerns.length) return <div>No concerns found.</div>;

  return (
    <div className="space-y-4">
      {concerns.map((c) =>
        editingId === c._id ? (
          <div key={c._id} className="p-4 border rounded shadow">
            <input
              className="border p-2 w-full mb-2"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <textarea
              className="border p-2 w-full mb-2"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <button
              className="bg-green-600 text-white px-2 py-1 rounded mr-2"
              onClick={() => handleEdit(c._id)}
            >
              Save
            </button>
            <button
              className="bg-gray-400 text-white px-2 py-1 rounded"
              onClick={() => setEditingId(null)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div key={c._id} className="p-4 border rounded shadow">
            <h2 className="font-bold">{c.title}</h2>
            <p>{c.description}</p>
            {c.image && (
              <img src={c.image} alt="Concern" className="w-full max-w-xs mb-2 rounded" />
            )}
            {c.user && (
              <div className="text-sm text-gray-500">
                By: {c.user.name} ({c.user.email})
              </div>
            )}
            <div className="mt-2 flex gap-2">
              <button
                className="bg-blue-600 text-white px-2 py-1 rounded"
                onClick={() => startEdit(c)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-2 py-1 rounded"
                onClick={() => handleDelete(c._id)}
              >
                Delete
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}