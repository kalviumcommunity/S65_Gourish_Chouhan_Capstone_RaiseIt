import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Flag,
  Search,
  Users,
  Filter,
  Plus,
  BookOpen,
  MessageCircle,
  Briefcase,
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
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

// Sample group categories
const categories = [
  { id: "urban", name: "Urban Planning", count: 12 },
  { id: "environment", name: "Environment", count: 8 },
  { id: "safety", name: "Public Safety", count: 6 },
  { id: "infrastructure", name: "Infrastructure", count: 9 },
  { id: "education", name: "Education", count: 5 },
  { id: "health", name: "Health & Wellness", count: 7 },
];

// Sample featured groups
const featuredGroups = [
  {
    id: "1",
    name: "Urban Development Initiatives",
    description:
      "Discussing sustainable urban development strategies and city planning initiatives.",
    members: 342,
    topics: 56,
    category: "Urban Planning",
    mentors: [
      {
        name: "Dr. Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40&text=SC",
        role: "Urban Planner",
      },
    ],
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Environmental Action Coalition",
    description:
      "Collaborative discussions on environmental conservation and sustainability practices.",
    members: 289,
    topics: 43,
    category: "Environment",
    mentors: [
      {
        name: "Prof. Michael Green",
        avatar: "/placeholder.svg?height=40&width=40&text=MG",
        role: "Environmental Scientist",
      },
    ],
    lastActive: "1 day ago",
  },
  {
    id: "3",
    name: "Community Safety Network",
    description:
      "Addressing neighborhood safety concerns and developing community-based solutions.",
    members: 156,
    topics: 28,
    category: "Public Safety",
    mentors: [
      {
        name: "Capt. Robert Johnson",
        avatar: "/placeholder.svg?height=40&width=40&text=RJ",
        role: "Safety Consultant",
      },
    ],
    lastActive: "3 hours ago",
  },
];

// Sample all groups
const allGroups = [
  ...featuredGroups,
  {
    id: "4",
    name: "Infrastructure Improvement Forum",
    description:
      "Discussing infrastructure needs, maintenance issues, and improvement projects.",
    members: 203,
    topics: 37,
    category: "Infrastructure",
    mentors: [
      {
        name: "Eng. Patricia Wong",
        avatar: "/placeholder.svg?height=40&width=40&text=PW",
        role: "Civil Engineer",
      },
    ],
    lastActive: "5 hours ago",
  },
  {
    id: "5",
    name: "Education Reform Collective",
    description:
      "Exploring innovative approaches to education and school improvement.",
    members: 178,
    topics: 31,
    category: "Education",
    mentors: [
      {
        name: "Dr. James Miller",
        avatar: "/placeholder.svg?height=40&width=40&text=JM",
        role: "Education Specialist",
      },
    ],
    lastActive: "1 day ago",
  },
  {
    id: "6",
    name: "Public Health Initiatives",
    description:
      "Discussing community health concerns and preventative health measures.",
    members: 215,
    topics: 39,
    category: "Health & Wellness",
    mentors: [
      {
        name: "Dr. Lisa Patel",
        avatar: "/placeholder.svg?height=40&width=40&text=LP",
        role: "Public Health Expert",
      },
    ],
    lastActive: "12 hours ago",
  },
];

export default function CommunityPage() {
  const [search, setSearch] = useState("");

  // Filter groups by search
  const filteredGroups = allGroups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Discussion Groups</h1>
          <p className="text-muted-foreground">
            Join groups led by professional mentors to discuss specific topics
          </p>
        </div>
        <Link to="/groups/create">
          <Button className="gap-1">
            <Plus className="h-4 w-4" /> Create Group
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search groups..."
            className="w-full pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-1">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between"
                >
                  <Link
                    to={`/groups?category=${category.id}`}
                    className="text-sm hover:underline"
                  >
                    {category.name}
                  </Link>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                View All Categories
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>My Groups</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-muted-foreground py-4">
                <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                <p>You haven't joined any groups yet</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Explore Groups
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Tabs defaultValue="featured" className="w-full">
            <TabsList>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="all">All Groups</TabsTrigger>
              <TabsTrigger value="joined">Joined</TabsTrigger>
            </TabsList>

            {/* Featured Groups Tab */}
            <TabsContent value="featured" className="space-y-4 pt-4">
              <div className="space-y-4">
                {featuredGroups.map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            </TabsContent>

            {/* All Groups Tab */}
            <TabsContent value="all" className="space-y-4 pt-4">
              <div className="space-y-4">
                {filteredGroups.map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            </TabsContent>

            {/* Joined Groups Tab */}
            <TabsContent value="joined" className="pt-4">
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">
                  You haven't joined any groups yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Join groups to participate in discussions with community members and professional mentors
                </p>
                <Button>Explore Groups</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Group Card Component
function GroupCard({ group }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">
              <Link to={`/groups/${group.id}`} className="hover:underline">
                {group.name}
              </Link>
            </CardTitle>
            <CardDescription className="mt-1">
              <Badge variant="outline">{group.category}</Badge>
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Join Group
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{group.description}</p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{group.members} members</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>{group.topics} topics</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>Active {group.lastActive}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Professional Mentors:</div>
          <div className="flex items-center gap-3">
            {group.mentors.map((mentor, index) => (
              <div key={index} className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mentor.avatar} alt={mentor.name} />
                  <AvatarFallback>
                    {mentor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">{mentor.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> {mentor.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/community/:id`} className="w-full">
          <Button variant="outline" className="w-full">
            View Discussions
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}