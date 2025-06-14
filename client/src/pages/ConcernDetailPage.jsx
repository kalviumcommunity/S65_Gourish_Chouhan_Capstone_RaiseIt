import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ThumbsUp, Share2, MessageCircle, MessageSquare } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";

export default function ConcernDetailPage() {
  const { id } = useParams();
  const [concern, setConcern] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://raiseit.onrender.com/api/concerns/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setConcern(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!concern) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-lg text-gray-500">Concern not found.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container py-8">
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/concerns">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Concerns
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{concern.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg?height=24&width=24" alt="User" />
                      <AvatarFallback>
                        {concern.user?.name
                          ? concern.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    Posted by {concern.user?.name || "Anonymous"} •{" "}
                    {new Date(concern.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  {concern.status || "Pending"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {(concern.tags || []).map((tag, idx) => (
                  <Badge key={idx} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="space-y-4 text-sm">
                <p>{concern.description}</p>
              </div>

              {concern.image && (
                <div className="rounded-md overflow-hidden border mt-4">
                  <img
                    src={concern.image}
                    alt="Concern"
                    className="w-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="gap-1">
                    <ThumbsUp className="h-4 w-4" /> Support (124)
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1" asChild>
                    <Link to={`/concerns/${id}/chat`}>
                      <MessageCircle className="h-4 w-4" /> Chat
                    </Link>
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last updated: {new Date(concern.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> Comments ({concern.comments?.length || 0})
              </h2>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                    <AvatarFallback>YS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea placeholder="Add a comment..." className="mb-2" />
                    <Button>Post Comment</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {(concern.comments || []).map((comment, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                        <AvatarFallback>
                          {comment.user?.name
                            ? comment.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="font-medium">{comment.user?.name || "Anonymous"}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="mt-2 text-sm">{comment.text}</div>
                        <div className="mt-3">
                          <Button variant="ghost" size="sm" className="h-8 gap-1">
                            <ThumbsUp className="h-3 w-3" /> {comment.likes || 0}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-4">
              <Button variant="outline">Load More Comments</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}