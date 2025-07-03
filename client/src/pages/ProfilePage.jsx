import { useParams, Link } from "react-router-dom";
import {
  Award,
  Briefcase,
  Building,
  Calendar,
  Edit,
  Flag,
  GraduationCap,
  Mail,
  MapPin,
  MessageSquare,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";

export default function ProfilePage() {
  const { id } = useParams();

  // Sample user data (replace with backend data later)
  const user = {
    id: id,
    username: "johndoe",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=200&width=200",
    coverImage: "/placeholder.svg?height=400&width=1200",
    bio: "Passionate community advocate with a focus on urban development and environmental sustainability. I believe in the power of collective action to create meaningful change.",
    address: "123 Main Street, Anytown, CA 94123",
    education: [
      { degree: "Master of Urban Planning", institution: "State University", year: "2018-2020" },
      { degree: "Bachelor of Environmental Science", institution: "City College", year: "2014-2018" },
    ],
    workExperience: [
      { position: "Urban Planner", company: "City Development Office", year: "2020-Present" },
      { position: "Environmental Consultant", company: "Green Solutions Inc.", year: "2018-2020" },
    ],
    trustScore: 87,
    friendsCount: 142,
    concernsRaised: 15,
    concernsResolved: 8,
    joinedDate: "March 2022",
    badges: ["Top Contributor", "Problem Solver", "Community Leader"],
  };

  return (
    <div>
      <div className="relative h-48 md:h-64 lg:h-80 w-full bg-gray-100 overflow-hidden">
        <img src={user.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>

      <main className="flex-1 container py-8">
        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          {/* Left Column - User Info */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="relative -mt-20 md:-mt-24">
              <Card className="pt-16 relative">
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                  <Avatar className="h-32 w-32 border-4 border-white">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-4xl">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardHeader className="text-center pt-0">
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription className="flex items-center justify-center gap-1">
                    <span>@{user.username}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{user.concernsRaised}</div>
                      <div className="text-xs text-muted-foreground">Concerns</div>
                    </div>
                    <Separator orientation="vertical" />
                    <div className="text-center">
                      <div className="text-2xl font-bold">{user.friendsCount}</div>
                      <div className="text-xs text-muted-foreground">Friends</div>
                    </div>
                    <Separator orientation="vertical" />
                    <div className="text-center">
                      <div className="text-2xl font-bold">{user.concernsResolved}</div>
                      <div className="text-xs text-muted-foreground">Resolved</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Trust Score</div>
                      <div className="text-sm font-medium">{user.trustScore}%</div>
                    </div>
                    <Progress value={user.trustScore} className="h-2" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {user.badges.map((badge, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" className="w-full gap-1">
                    <Users className="h-4 w-4" /> Connect
                  </Button>
                  <Button variant="outline" className="w-full gap-1 ml-2">
                    <MessageSquare className="h-4 w-4" /> Message
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* About Card */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>About</CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{user.bio}</p>

                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-muted-foreground">{user.email}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Address</div>
                      <div className="text-muted-foreground">{user.address}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Joined</div>
                      <div className="text-muted-foreground">{user.joinedDate}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.education.map((edu, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{edu.degree}</div>
                      <div className="text-sm text-muted-foreground">{edu.institution}</div>
                      <div className="text-xs text-muted-foreground">{edu.year}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Work Experience Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.workExperience.map((work, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Briefcase className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{work.position}</div>
                      <div className="text-sm text-muted-foreground">{work.company}</div>
                      <div className="text-xs text-muted-foreground">{work.year}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Concerns & Activity */}
          <div className="space-y-6">
            <Tabs defaultValue="concerns" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="concerns">Concerns Raised</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                <TabsTrigger value="friends">Friends</TabsTrigger>
              </TabsList>

              {/* Concerns Tab */}
              <TabsContent value="concerns" className="space-y-4 pt-4">
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Concerns Raised by {user.name}</h3>
                    <div className="text-sm text-muted-foreground">Total: {user.concernsRaised}</div>
                  </div>

                  <div className="space-y-4 mt-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardHeader>
                          <div className="flex justify-between">
                            <CardTitle className="text-lg">
                              {
                                [
                                  "Inadequate Street Lighting in Downtown Area",
                                  "Park Playground Equipment Needs Repair",
                                  "Recurring Flooding on Elm Street After Rain",
                                ][i - 1]
                              }
                            </CardTitle>
                            <Badge
                              className={
                                i === 1
                                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                  : i === 2
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                              }
                            >
                              {i === 1 ? "In Progress" : i === 2 ? "Resolved" : "Pending"}
                            </Badge>
                          </div>
                          <CardDescription>
                            Posted {["2 weeks", "1 month", "3 days"][i - 1]} ago • {[24, 18, 7][i - 1]} comments
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {
                              [
                                "The street lights in the downtown area between 5th and 8th Avenue have been dim or completely out for several weeks now. This creates a safety hazard for pedestrians and drivers at night...",
                                "Several pieces of equipment at Central Park playground are broken or damaged, posing safety risks for children. The swings are missing seats and the slide has cracks...",
                                "After even moderate rainfall, Elm Street between Oak and Pine consistently floods, making it difficult for residents to access their homes and causing potential property damage...",
                              ][i - 1]
                            }
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="outline">{["Safety", "Maintenance", "Infrastructure"][i - 1]}</Badge>
                            <Badge variant="outline">{["Urban", "Parks", "Drainage"][i - 1]}</Badge>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="gap-1">
                              <ThumbsUp className="h-4 w-4" /> {[42, 36, 15][i - 1]}
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <MessageSquare className="h-4 w-4" /> {[24, 18, 7][i - 1]}
                            </Button>
                          </div>
                          <Link to={`/concerns/${i}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-center mt-4">
                    <Button variant="outline">View All Concerns</Button>
                  </div>
                </div>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="pt-4">
                <div>
                  <h3 className="text-lg font-medium">Recent Activity</h3>

                  <div className="space-y-4 mt-4">
                    {[
                      { type: "comment", concern: "Traffic Light Timing Issue", time: "2 days ago" },
                      { type: "support", concern: "Community Garden Proposal", time: "3 days ago" },
                      { type: "raised", concern: "Recurring Flooding on Elm Street", time: "3 days ago" },
                      { type: "resolved", concern: "Park Playground Equipment Repair", time: "1 week ago" },
                      { type: "comment", concern: "Noise Pollution from Construction Site", time: "1 week ago" },
                    ].map((activity, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                  activity.type === "comment"
                                    ? "bg-blue-50"
                                    : activity.type === "support"
                                      ? "bg-purple-50"
                                      : activity.type === "raised"
                                        ? "bg-red-50"
                                        : "bg-green-50"
                                }`}
                              >
                                {activity.type === "comment" ? (
                                  <MessageSquare className="h-4 w-4 text-blue-500" />
                                ) : activity.type === "support" ? (
                                  <ThumbsUp className="h-4 w-4 text-purple-500" />
                                ) : activity.type === "raised" ? (
                                  <Flag className="h-4 w-4 text-red-500" />
                                ) : (
                                  <Award className="h-4 w-4 text-green-500" />
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">
                                {activity.type === "comment" ? (
                                  <>
                                    Commented on{" "}
                                    <Link to="#" className="font-medium hover:underline">
                                      {activity.concern}
                                    </Link>
                                  </>
                                ) : activity.type === "support" ? (
                                  <>
                                    Supported{" "}
                                    <Link to="#" className="font-medium hover:underline">
                                      {activity.concern}
                                    </Link>
                                  </>
                                ) : activity.type === "raised" ? (
                                  <>
                                    Raised a new concern:{" "}
                                    <Link to="#" className="font-medium hover:underline">
                                      {activity.concern}
                                    </Link>
                                  </>
                                ) : (
                                  <>
                                    Concern resolved:{" "}
                                    <Link to="#" className="font-medium hover:underline">
                                      {activity.concern}
                                    </Link>
                                  </>
                                )}
                              </p>
                              {activity.type === "comment" && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  "I've noticed this issue as well. The timing seems particularly bad during rush hour,
                                  causing unnecessary congestion."
                                </p>
                              )}
                              <div className="text-xs text-muted-foreground mt-1">{activity.time}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Friends Tab */}
              <TabsContent value="friends" className="pt-4">
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Friends</h3>
                    <div className="text-sm text-muted-foreground">Total: {user.friendsCount}</div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 mt-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${i}`} alt="Friend" />
                              <AvatarFallback>{["JS", "MP", "AK", "RB", "TN", "LW"][i]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-medium">
                                {
                                  [
                                    "Jane Smith",
                                    "Michael Park",
                                    "Alice Kim",
                                    "Robert Brown",
                                    "Tina Nguyen",
                                    "Lisa Wong",
                                  ][i]
                                }
                              </div>
                              <div className="text-sm text-muted-foreground">
                                @{["janesmith", "mpark", "akim", "rbrown", "tnguyen", "lwong"][i]}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-center mt-4">
                    <Button variant="outline">View All Friends</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Organizations */}
            <Card>
              <CardHeader>
                <CardTitle>Organizations</CardTitle>
                <CardDescription>Groups and organizations {user.name} is a part of</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { name: "Urban Planning Association", role: "Member", members: 342 },
                    { name: "Environmental Action Coalition", role: "Coordinator", members: 156 },
                    { name: "Neighborhood Watch", role: "Organizer", members: 78 },
                  ].map((org, index) => (
                    <div key={index} className="border rounded-md overflow-hidden">
                      <div className="h-24 bg-primary/10 flex items-center justify-center">
                        <Building className="h-10 w-10 text-primary/40" />
                      </div>
                      <div className="p-4">
                        <div className="font-medium">{org.name}</div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{org.role}</span>
                          <span>{org.members} members</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}