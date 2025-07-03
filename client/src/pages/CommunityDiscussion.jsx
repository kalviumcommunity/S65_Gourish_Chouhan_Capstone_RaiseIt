import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  Heart,
  MessageCircle,
  Reply,
  Share2,
  ThumbsUp,
  Users,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Textarea } from "../components/ui/textarea";

export default function CommunityDiscussionPage() {
  const { id, discussionId } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://raiseit.onrender.com/api/community/${id}/discussions/${discussionId}`)
      .then((res) => res.json())
      .then((data) => {
        setDiscussion(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, discussionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-lg text-gray-500">Discussion not found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/community/${discussion.groupId}`}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Group
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Discussion Header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{discussion.title}</CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2">
                    <span>Started by {discussion.author?.name || "Anonymous"}</span>
                    <span>•</span>
                    <span>{discussion.createdAt}</span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Bookmark className="h-4 w-4" /> Save
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={discussion.author?.avatar || "/placeholder.svg?height=40&width=40"} alt={discussion.author?.name || "User"} />
                    <AvatarFallback>
                      {discussion.author?.name
                        ? discussion.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <div className="font-medium">{discussion.author?.name || "Anonymous"}</div>
                      <div className="text-xs text-muted-foreground">{discussion.author?.role}</div>
                      <div className="text-xs text-muted-foreground">{discussion.author?.joinDate}</div>
                    </div>
                  </div>

                  <div className="text-sm space-y-4 whitespace-pre-line">{discussion.content}</div>

                  <div className="flex items-center gap-4 pt-2">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <ThumbsUp className="h-4 w-4" /> {discussion.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Reply className="h-4 w-4" /> Reply
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Responses ({discussion.comments?.length || 0})</h3>
              <div className="text-sm text-muted-foreground">{discussion.views} views</div>
            </div>

            {/* Mentor Responses */}
            {discussion.comments?.filter((c) => c.author?.isMentor).length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-primary">Mentor Responses</h4>
                {discussion.comments
                  .filter((c) => c.author?.isMentor)
                  .map((comment) => (
                    <Card key={comment.id} className="border-primary/20 bg-primary/5">
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <Avatar className="h-10 w-10 ring-2 ring-primary ring-offset-2">
                              <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                              <AvatarFallback>
                                {comment.author.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  {comment.author.name}
                                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                    Mentor
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">{comment.author.role}</div>
                                <div className="text-xs text-muted-foreground">{comment.createdAt}</div>
                              </div>
                            </div>

                            <div className="text-sm">{comment.content}</div>

                            <div className="flex items-center gap-4 pt-2">
                              <Button variant="ghost" size="sm" className="gap-1">
                                <ThumbsUp className="h-4 w-4" /> {comment.likes}
                              </Button>
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Reply className="h-4 w-4" /> Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}

            <Separator />

            {/* Community Responses */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Community Responses</h4>
              {discussion.comments
                ?.filter((c) => !c.author?.isMentor)
                .map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                            <AvatarFallback>
                              {comment.author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <div>
                              <div className="font-medium">{comment.author.name}</div>
                              <div className="text-xs text-muted-foreground">{comment.createdAt}</div>
                            </div>
                          </div>

                          <div className="text-sm">{comment.content}</div>

                          <div className="flex items-center gap-4 pt-2">
                            <Button variant="ghost" size="sm" className="gap-1">
                              <ThumbsUp className="h-4 w-4" /> {comment.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Reply className="h-4 w-4" /> Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Reply Box */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Join the Discussion</CardTitle>
                <CardDescription>Share your thoughts, experiences, or questions</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea placeholder="Write your response here..." className="min-h-[150px]" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Post Response</Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* About Discussion */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>About This Discussion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span>{discussion.replies} replies</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span>{discussion.likes} likes</span>
                </div>
              </div>
              {/* ...participants and related discussions as before... */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}