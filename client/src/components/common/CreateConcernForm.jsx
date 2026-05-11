import { useState } from "react";
import { createConcern, uploadImage } from "../../services/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export default function CreateConcernForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const handleImageChange = (file) => {
    setImage(file || null);
    setPreview(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = "";
      if (image) {
        const uploadRes = await uploadImage(image);
        imageUrl = uploadRes.url;
      }
      await createConcern({ title, description, tags, image: imageUrl });
      setTitle("");
      setDescription("");
      setTags("");
      handleImageChange(null);
      onCreated?.();
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border bg-white p-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="min-h-32" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input id="tags" placeholder="Infrastructure, Safety" value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input id="image" type="file" accept="image/*" onChange={(e) => handleImageChange(e.target.files?.[0])} />
        {preview && <img src={preview} alt="Preview" className="mt-3 max-h-64 rounded-lg border object-cover" />}
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Concern"}</Button>
    </form>
  );
}
