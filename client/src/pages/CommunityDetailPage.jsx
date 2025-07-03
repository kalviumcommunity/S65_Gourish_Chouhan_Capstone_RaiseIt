import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  Briefcase,
  Calendar,
  Flag,
  MessageCircle,
  Pin,
  Plus,
  Share2,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";

// Sample group data (replace with backend data later)
const sampleGroup = {
  id: "1",
  name: "Urban Development Initiatives",
  description:
    "A collaborative group focused on sustainable urban development strategies and city planning initiatives. We discuss innovative approaches to urban challenges, share resources, and develop community-based solutions.",
  members: 342,
  topics: 56,
  category: "Urban Planning",
  mentors: [
    {
      id: "1",
      name: "Dr. Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40&text=SC",
      role: "Urban Planner",
      bio: "PhD in Urban Planning with 15+ years of experience in sustainable city development. Consultant for major metropolitan areas across the country.",
    },
    {
      id: "2",
      name: "Architect James Wilson",
      avatar: "/placeholder.svg?height=40&width=40&text=JW",
      role: "Architectural Designer",
      bio: "Award-winning architect specializing in sustainable urban spaces and community-centered design. Faculty member at State University.",
    },
  ],
  admins: [{ name: "Maria Rodriguez", avatar: "/placeholder.svg?height=40&width=40&text=MR" }],
  created: "June 2023",
  rules: [
    "Be respectful and constructive in all discussions",
    "Stay on topic and relevant to urban development",
    "No self-promotion or advertising without permission",
    "Cite sources when sharing information or statistics",
    "Respect the expertise of professional mentors",
  ],
  discussions: [
    {
      id: "1",
      title: "Implementing Green Spaces in Urban Renewal Projects",
      author: { name: "Alex Johnson", avatar: "/placeholder.svg?height=40&width=40&text=AJ" },
      replies: 28,
      views: 156,
      lastActive: "2 hours ago",
      isPinned: true,
      mentorResponse: true,
    },
    {
      id: "2",
      title: "Traffic Calming Measures for Residential Neighborhoods",
      author: { name: "Sophia Garcia", avatar: "/placeholder.svg?height=40&width=40&text=SG" },
      replies: 19,
      views: 87,
      lastActive: "1 day ago",
      isPinned: false,
      mentorResponse: true,
    },
    {
      id: "3",
      title: "Affordable Housing Integration in New Developments",
      author: { name: "Marcus Lee", avatar: "/placeholder.svg?height=40&width=40&text=ML" },
      replies: 34,
      views: 203,
      lastActive: "5 hours ago",
      isPinned: true,
      mentorResponse: true,
    },
    {
      id: "4",
      title: "Public Transportation Accessibility Improvements",
      author: { name: "Olivia Chen", avatar: "/placeholder.svg?height=40&width=40&text=OC" },
      replies: 12,
      views: 76,
      lastActive: "3 days ago",
      isPinned: false,
      mentorResponse: false,
    },
    {
      id: "5",
      title: "Community Engagement Strategies for Urban Planning",
      author: { name: "David Kim", avatar: "/placeholder.svg?height=40&width=40&text=DK" },
      replies: 23,
      views: 118,
      lastActive: "2 days ago",
      isPinned: false,
      mentorResponse: true,
    },
  ],
  events: [
    {
      id: "1",
      title: "Virtual Workshop: Sustainable Urban Design Principles",
      date: "May 15, 2025",
      time: "2:00 PM - 4:00 PM EST",
      host: "Dr. Sarah Chen",
      attendees: 45,
    },
    {
      id: "2",
      title: "Q&A Session: Urban Renewal Best Practices",
      date: "May 22, 2025",
      time: "6:00 PM - 7:30 PM EST",
      host: "Architect James Wilson",
      attendees: 32,
    },
  ],
};

export default function CommunityDetailPage() {
  const { id } = useParams();
  // In real app, fetch group by id
  const group = sampleGroup; // Replace with backend data

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/community">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Community
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Group Header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{group.name}</CardTitle>
                  <CardDescription className="mt-1">
                    <Badge variant="outline">{group.category}</Badge>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                  <Button size="sm">Join Group</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{group.description}</p>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <span className="font-medium">{group.members}</span> members
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <span className="font-medium">{group.topics}</span> topics
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Created <span className="font-medium">{group.created}</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Discussions */}
          <Tabs defaultValue="discussions" className="w-full">
            <TabsList>
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            {/* Discussions Tab */}
            <TabsContent value="discussions" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Discussion Topics</h3>
                <Link to={`/community/${group.id}/discussions/new`}>
                  <Button size="sm" className="gap-1">
                    <Plus className="h-4 w-4" /> New Topic
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {group.discussions.map((discussion) => (
                  <Card key={discussion.id} className={discussion.isPinned ? "border-primary/20 bg-primary/5" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {discussion.isPinned && <Pin className="h-4 w-4 text-primary" />}
                            <Link
                              to={`/community/${group.id}/discussions/${discussion.id}`}
                              className="hover:underline"
                            >
                              {discussion.title}
                            </Link>
                          </CardTitle>
                          <CardDescription className="mt-1 flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                                <AvatarFallback>
                                  {discussion.author.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span>{discussion.author.name}</span>
                            </div>
                            <span>•</span>
                            <span>Last active {discussion.lastActive}</span>
                          </CardDescription>
                        </div>
                        {discussion.mentorResponse && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            Mentor Response
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardFooter className="pt-0">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{discussion.replies} replies</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{discussion.views} views</span>
                        </div>
                      </div>
                      <Link to={`/community/${group.id}/discussions/${discussion.id}`} className="ml-auto">
                        <Button variant="ghost" size="sm">
                          View Discussion
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Upcoming Events</h3>
                <Button size="sm" variant="outline" className="gap-1">
                  <Calendar className="h-4 w-4" /> View Calendar
                </Button>
              </div>

              <div className="space-y-4">
                {group.events.map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription>Hosted by {event.host}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Register
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="pt-4">
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">No resources available yet</h3>
                <p className="text-muted-foreground mb-4">Resources shared by mentors and members will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* About Group */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>About This Group</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Group Rules</h4>
                <ul className="text-sm space-y-2">
                  {group.rules.map((rule, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="font-medium">{index + 1}.</span>
                      <span className="text-muted-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full gap-1">
                <Bookmark className="h-4 w-4" /> Save Group
              </Button>
            </CardFooter>
          </Card>

          {/* Professional Mentors */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Professional Mentors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.mentors.map((mentor) => (
                <div key={mentor.id} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={mentor.avatar} alt={mentor.name} />
                      <AvatarFallback>
                        {mentor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{mentor.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> {mentor.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{mentor.bio}</p>
                  {mentor.id !== group.mentors[group.mentors.length - 1].id && <Separator className="my-3" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Group Admins */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Group Administrators</CardTitle>
            </CardHeader>
            <CardContent>
              {group.admins.map((admin, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={admin.avatar} alt={admin.name} />
                    <AvatarFallback>
                      {admin.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{admin.name}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}