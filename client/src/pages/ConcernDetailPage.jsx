import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, MessageSquare, Save, Share2, ThumbsUp, Trash2, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  addConcernComment,
  deleteConcern,
  getConcern,
  reportConcern,
  toggleConcernUpvote,
  updateConcern,
  uploadImage,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

const statuses = ["Pending", "In Progress", "Resolved"];

const initials = (name = "User") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function ConcernDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [concern, setConcern] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", description: "", tags: "", status: "Pending", image: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    getConcern(id)
      .then((data) => {
        setConcern(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const ownerId = concern?.user?._id || concern?.user?.id;
  const userId = user?.id || user?._id;
  const isOwner = Boolean(ownerId && userId && ownerId === userId);

  const startEditing = () => {
    setEditForm({
      title: concern.title || "",
      description: concern.description || "",
      tags: (concern.tags || []).join(", "),
      status: concern.status || "Pending",
      image: concern.image || "",
    });
    setImageFile(null);
    setImagePreview(concern.image || "");
    setIsEditing(true);
  };

  const handleImageChange = (file) => {
    setImageFile(file || null);
    setImagePreview(file ? URL.createObjectURL(file) : editForm.image);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      let image = editForm.image;
      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        image = uploadRes.url;
      }
      const updated = await updateConcern(id, { ...editForm, image });
      setConcern(updated);
      setIsEditing(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this concern permanently?")) return;
    try {
      await deleteConcern(id);
      navigate("/concerns");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpvote = async () => {
    if (!isAuthenticated) return alert("Please log in to support concerns.");
    try {
      setConcern(await toggleConcernUpvote(id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleComment = async () => {
    if (!isAuthenticated) return alert("Please log in to comment.");
    if (!comment.trim()) return;
    try {
      setConcern(await addConcernComment(id, comment));
      setComment("");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReport = async () => {
    if (!isAuthenticated) return alert("Please log in to report content.");
    const reason = window.prompt("Why are you reporting this concern?");
    if (!reason?.trim()) return;
    try {
      await reportConcern(id, reason);
      alert("Concern reported for review.");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Loading concern...</div>;
  if (error || !concern) return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">{error || "Concern not found."}</div>;

  return (
    <main className="container py-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <Button variant="ghost" size="sm" asChild className="w-fit">
          <Link to="/concerns"><ArrowLeft className="mr-1 h-4 w-4" /> Back to Concerns</Link>
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">{concern.title}</CardTitle>
                <CardDescription className="mt-2 flex items-center gap-2">
                  <Avatar className="h-7 w-7"><AvatarFallback>{initials(concern.user?.name)}</AvatarFallback></Avatar>
                  Posted by {concern.user?.name || "Anonymous"} • {new Date(concern.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{concern.status || "Pending"}</Badge>
                {isOwner && !isEditing && (
                  <>
                    <Button variant="outline" size="sm" onClick={startEditing}><Edit className="mr-1 h-4 w-4" /> Edit</Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={handleDelete}>
                      <Trash2 className="mr-1 h-4 w-4" /> Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-5">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={editForm.title} onChange={(e) => setEditForm((current) => ({ ...current, title: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={editForm.description} onChange={(e) => setEditForm((current) => ({ ...current, description: e.target.value }))} required className="min-h-32" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <Input value={editForm.tags} onChange={(e) => setEditForm((current) => ({ ...current, tags: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <select
                      className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                      value={editForm.status}
                      onChange={(e) => setEditForm((current) => ({ ...current, status: e.target.value }))}
                    >
                      {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Image</Label>
                  <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e.target.files?.[0])} />
                  {imagePreview && <img src={imagePreview} alt="Preview" className="max-h-80 rounded-lg border object-cover" />}
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={saving}><Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save"}</Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}><X className="mr-1 h-4 w-4" /> Cancel</Button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  {(concern.tags || []).map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                </div>
                <p className="whitespace-pre-line text-sm leading-6">{concern.description}</p>
                {concern.image && <img src={concern.image} alt="Concern" className="w-full rounded-lg border object-cover" />}
                <div className="flex flex-col justify-between gap-3 border-t pt-4 md:flex-row md:items-center">
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="gap-1" onClick={handleUpvote}>
                      <ThumbsUp className="h-4 w-4" /> Support ({concern.upvotes?.length || 0})
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
                      <Share2 className="h-4 w-4" /> Share
                    </Button>
                    {!isOwner && (
                      <Button variant="outline" size="sm" className="gap-1 text-red-600" onClick={handleReport}>
                        Report
                      </Button>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Last updated: {new Date(concern.updatedAt).toLocaleDateString()}</div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-bold"><MessageSquare className="h-5 w-5" /> Comments ({concern.comments?.length || 0})</h2>
          <Card>
            <CardContent className="space-y-3 pt-6">
              <Textarea placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
              <Button onClick={handleComment}>Post Comment</Button>
            </CardContent>
          </Card>

          {(concern.comments || []).map((item) => (
            <Card key={item._id || item.createdAt}>
              <CardContent className="flex gap-4 pt-6">
                <Avatar><AvatarFallback>{initials(item.user?.name)}</AvatarFallback></Avatar>
                <div className="flex-1">
                  <div className="flex justify-between gap-3">
                    <div className="font-medium">{item.user?.name || "Anonymous"}</div>
                    <div className="text-sm text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</div>
                  </div>
                  <p className="mt-2 text-sm leading-6">{item.text}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
