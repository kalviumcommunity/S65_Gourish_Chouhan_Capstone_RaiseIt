import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { createGroup } from "../services/api";

export default function CreateGroupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", category: "", description: "", rules: "" });
  const [loading, setLoading] = useState(false);

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const group = await createGroup({
        ...form,
        rules: form.rules.split('\n').map((rule) => rule.trim()).filter(Boolean),
      });
      navigate(`/community/${group._id}`);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold">Create Group</h1>
      <p className="mt-2 text-muted-foreground">Start a focused discussion space for a community topic.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-xl border bg-white p-6">
        <div className="space-y-2">
          <Label htmlFor="name">Group name</Label>
          <Input id="name" value={form.name} onChange={update("name")} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" value={form.category} onChange={update("category")} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={form.description} onChange={update("description")} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rules">Rules, one per line</Label>
          <Textarea id="rules" value={form.rules} onChange={update("rules")} />
        </div>
        <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Group"}</Button>
      </form>
    </div>
  );
}
