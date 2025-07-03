import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Edit,
  Flag,
  GraduationCap,
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
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

export default function EditProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data
  const user = {
    id: id,
    username: "johndoe",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=200&width=200",
    coverImage: "/placeholder.svg?height=400&width=1200",
    bio: "Passionate community advocate with a focus on urban development and environmental sustainability. I believe in the power of collective action to create meaningful change.",
    address: "123 Main Street, Anytown, CA 94123",
    phone: "(555) 123-4567",
    education: [
      { id: "1", degree: "Master of Urban Planning", institution: "State University", year: "2018-2020" },
      { id: "2", degree: "Bachelor of Environmental Science", institution: "City College", year: "2014-2018" },
    ],
    workExperience: [
      { id: "1", position: "Urban Planner", company: "City Development Office", year: "2020-Present" },
      { id: "2", position: "Environmental Consultant", company: "Green Solutions Inc.", year: "2018-2020" },
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate(`/profile/${user.id}`);
    }, 1500);
  };

  return (
    <div>
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/profile/${user.id}`}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Profile
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Edit Profile</CardTitle>
              <CardDescription>
                Update your personal information and profile settings
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="personal" className="w-full">
                <CardContent className="pt-6">
                  <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="work">Work Experience</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Profile Picture</Label>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-2xl">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Input id="avatar" type="file" className="mb-2" />
                            <div className="text-xs text-muted-foreground">
                              Recommended: Square image, at least 400x400px
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Cover Image</Label>
                        <div className="h-32 w-full rounded-md border border-dashed flex items-center justify-center relative overflow-hidden">
                          <img
                            src={user.coverImage || "/placeholder.svg"}
                            alt="Cover"
                            className="w-full h-full object-cover absolute inset-0"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Button variant="outline" className="bg-white gap-1">
                              <Upload className="h-4 w-4" /> Change Cover
                            </Button>
                          </div>
                        </div>
                        <Input id="cover" type="file" className="mt-2" />
                        <div className="text-xs text-muted-foreground">
                          Recommended: 1200x400px image
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" defaultValue={user.name} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input id="username" defaultValue={user.username} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" defaultValue={user.bio} className="min-h-[100px]" />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input id="address" defaultValue={user.address} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" defaultValue={user.phone} />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="education" className="space-y-6">
                    <div className="space-y-6">
                      {user.education.map((edu, index) => (
                        <div key={edu.id} className="space-y-4">
                          {index > 0 && <Separator />}
                          <div className="pt-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor={`degree-${edu.id}`}>Degree/Certificate</Label>
                                <Input id={`degree-${edu.id}`} defaultValue={edu.degree} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
                                <Input id={`institution-${edu.id}`} defaultValue={edu.institution} />
                              </div>
                            </div>
                            <div className="mt-4 space-y-2">
                              <Label htmlFor={`year-${edu.id}`}>Year</Label>
                              <Input id={`year-${edu.id}`} defaultValue={edu.year} />
                            </div>
                            <div className="mt-4 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button type="button" variant="outline" className="w-full">
                        Add Education
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="work" className="space-y-6">
                    <div className="space-y-6">
                      {user.workExperience.map((work, index) => (
                        <div key={work.id} className="space-y-4">
                          {index > 0 && <Separator />}
                          <div className="pt-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor={`position-${work.id}`}>Position</Label>
                                <Input id={`position-${work.id}`} defaultValue={work.position} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`company-${work.id}`}>Company</Label>
                                <Input id={`company-${work.id}`} defaultValue={work.company} />
                              </div>
                            </div>
                            <div className="mt-4 space-y-2">
                              <Label htmlFor={`work-year-${work.id}`}>Year</Label>
                              <Input id={`work-year-${work.id}`} defaultValue={work.year} />
                            </div>
                            <div className="mt-4 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button type="button" variant="outline" className="w-full">
                        Add Work Experience
                      </Button>
                    </div>
                  </TabsContent>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" asChild>
                    <Link to={`/profile/${user.id}`}>Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving Changes..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Tabs>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}