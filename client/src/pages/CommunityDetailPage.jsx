import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle, Plus, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { createDiscussion, getGroup, getGroupDiscussions, joinGroup, leaveGroup, reportGroup } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function CommunityDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [group, setGroup] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });

  useEffect(() => {
    setLoading(true);
    Promise.all([getGroup(id), getGroupDiscussions(id)])
      .then(([groupData, discussionData]) => {
        setGroup(groupData);
        setDiscussions(discussionData);
      })
      .catch((error) => alert(error.message))
      .finally(() => setLoading(false));
  }, [id]);

  const userId = user?.id || user?._id;
  const isMember = group?.members?.some((member) => (member._id || member.id) === userId);

  const toggleMembership = async () => {
    if (!isAuthenticated) return alert("Please log in to join groups.");
    const updated = isMember ? await leaveGroup(id) : await joinGroup(id);
    setGroup(updated);
  };

  const handleDiscussionSubmit = async (event) => {
    event.preventDefault();
    try {
      const discussion = await createDiscussion(id, form);
      setDiscussions((current) => [discussion, ...current]);
      setForm({ title: "", content: "" });
      setShowForm(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleReportGroup = async () => {
    if (!isAuthenticated) return alert("Please log in to report content.");
    const reason = window.prompt("Why are you reporting this group?");
    if (!reason?.trim()) return;
    try {
      await reportGroup(id, reason);
      alert("Group reported for review.");
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div className="py-16 text-center text-muted-foreground">Loading group...</div>;
  if (!group) return <div className="py-16 text-center text-muted-foreground">Group not found.</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/community"><ArrowLeft className="mr-1 h-4 w-4" /> Back to Community</Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <CardTitle className="text-3xl">{group.name}</CardTitle>
                  <CardDescription className="mt-3"><Badge variant="outline">{group.category}</Badge></CardDescription>
                </div>
                <Button variant={isMember ? "outline" : "default"} onClick={toggleMembership}>
                  {isMember ? "Leave Group" : "Join Group"}
                </Button>
                <Button variant="outline" className="text-red-600" onClick={handleReportGroup}>Report</Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{group.description}</p>
              <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {group.members?.length || 0} members</span>
                <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" /> {discussions.length} discussions</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Discussions</h2>
            <Button size="sm" className="gap-1" onClick={() => setShowForm((value) => !value)}>
              <Plus className="h-4 w-4" /> New Discussion
            </Button>
          </div>

          {showForm && (
            <Card>
              <CardHeader><CardTitle>Start a discussion</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleDiscussionSubmit} className="space-y-4">
                  <Input placeholder="Discussion title" value={form.title} onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))} required />
                  <Textarea placeholder="Explain the topic..." value={form.content} onChange={(e) => setForm((current) => ({ ...current, content: e.target.value }))} required />
                  <Button type="submit">Publish Discussion</Button>
                </form>
              </CardContent>
            </Card>
          )}

          {!discussions.length && <div className="rounded-xl border bg-white p-8 text-center text-muted-foreground">No discussions yet.</div>}

          <div className="space-y-4">
            {discussions.map((discussion) => (
              <Card key={discussion._id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link to={`/community/${id}/discussions/${discussion._id}`} className="hover:underline">
                      {discussion.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    Started by {discussion.author?.name || "Anonymous"} • {new Date(discussion.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent><p className="line-clamp-2 text-sm text-muted-foreground">{discussion.content}</p></CardContent>
                <CardFooter className="text-sm text-muted-foreground">
                  {discussion.replies?.length || 0} replies • {discussion.views || 0} views
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Group Rules</CardTitle></CardHeader>
            <CardContent>
              {group.rules?.length ? (
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {group.rules.map((rule, index) => <li key={index}>{index + 1}. {rule}</li>)}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No rules added yet.</p>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
