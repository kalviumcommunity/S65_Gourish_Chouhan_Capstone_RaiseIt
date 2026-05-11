import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Reply, ThumbsUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Textarea } from "../components/ui/textarea";
import { addDiscussionReply, getDiscussion, reportDiscussion } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function CommunityDiscussionPage() {
  const { id, discussionId } = useParams();
  const { isAuthenticated } = useAuth();
  const [discussion, setDiscussion] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDiscussion(id, discussionId)
      .then(setDiscussion)
      .catch((error) => alert(error.message))
      .finally(() => setLoading(false));
  }, [id, discussionId]);

  const submitReply = async () => {
    if (!reply.trim()) return;
    try {
      const updated = await addDiscussionReply(id, discussionId, reply);
      setDiscussion(updated);
      setReply("");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleReport = async () => {
    if (!isAuthenticated) return alert("Please log in to report content.");
    const reason = window.prompt("Why are you reporting this discussion?");
    if (!reason?.trim()) return;
    try {
      await reportDiscussion(id, discussionId, reason);
      alert("Discussion reported for review.");
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div className="py-16 text-center text-muted-foreground">Loading discussion...</div>;
  if (!discussion) return <div className="py-16 text-center text-muted-foreground">Discussion not found.</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to={`/community/${id}`}><ArrowLeft className="mr-1 h-4 w-4" /> Back to Group</Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{discussion.title}</CardTitle>
          <CardDescription>
            Started by {discussion.author?.name || "Anonymous"} • {new Date(discussion.createdAt).toLocaleDateString()} • {discussion.views || 0} views
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="whitespace-pre-line text-sm leading-6">{discussion.content}</p>
          <Button variant="outline" size="sm" className="gap-1" disabled><ThumbsUp className="h-4 w-4" /> Support</Button>
          <Button variant="outline" size="sm" className="ml-2 text-red-600" onClick={handleReport}>Report</Button>
        </CardContent>
      </Card>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Replies ({discussion.replies?.length || 0})</h2>
        <Card>
          <CardContent className="space-y-3 pt-6">
            <Textarea placeholder="Write your reply..." value={reply} onChange={(e) => setReply(e.target.value)} />
            <Button className="gap-1" onClick={submitReply}><Reply className="h-4 w-4" /> Post Reply</Button>
          </CardContent>
        </Card>

        {discussion.replies?.map((item) => (
          <Card key={item._id}>
            <CardContent className="flex gap-4 pt-6">
              <Avatar><AvatarFallback>{item.author?.name?.[0] || "U"}</AvatarFallback></Avatar>
              <div>
                <div className="font-medium">{item.author?.name || "Anonymous"}</div>
                <div className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</div>
                <p className="mt-2 text-sm leading-6">{item.content}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
