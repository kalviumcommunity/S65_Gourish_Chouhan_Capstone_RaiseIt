import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, Edit, GraduationCap, IndianRupee, Mail, MapPin, MessageSquare, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import { getMe, getUser, getUserConcerns, getUserDonations, getUserGroups } from "../services/api";
import { useAuth } from "../context/AuthContext";

const initials = (name = "User") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function ProfilePage() {
  const { id } = useParams();
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [concerns, setConcerns] = useState([]);
  const [groups, setGroups] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const shouldLoadMe = !id || id === "me" || id === "undefined";
        const profileData = shouldLoadMe ? await getMe() : await getUser(id);
        const profileId = profileData._id || profileData.id;
        const [concernData, groupData, donationData] = await Promise.all([
          getUserConcerns(profileId),
          getUserGroups(profileId),
          getUserDonations(profileId),
        ]);

        if (!cancelled) {
          setProfile(profileData);
          setConcerns(concernData);
          setGroups(groupData);
          setDonations(donationData);
        }
      } catch (error) {
        if (!cancelled) setError(error.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <div className="py-16 text-center text-muted-foreground">Loading profile...</div>;
  if (error) return <div className="py-16 text-center text-red-600">{error}</div>;
  if (!profile) return <div className="py-16 text-center text-muted-foreground">Profile not found.</div>;

  const profileId = profile._id || profile.id;
  const isOwnProfile = (authUser?.id || authUser?._id) === profileId;
  const joinedDate = new Date(profile.createdAt).toLocaleDateString();

  return (
    <div>
      <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500 md:h-72">
        {profile.coverImage && <img src={profile.coverImage} alt="Cover" className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <main className="container py-8">
        <div className="grid gap-8 md:grid-cols-[320px_1fr]">
          <div className="space-y-6">
            <div className="relative -mt-24">
              <Card className="relative pt-16">
                <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                  <Avatar className="h-32 w-32 border-4 border-white bg-white">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="text-4xl">{initials(profile.name)}</AvatarFallback>
                  </Avatar>
                </div>
                <CardHeader className="pt-0 text-center">
                  <CardTitle className="text-2xl">{profile.name}</CardTitle>
                  <CardDescription>{profile.username ? `@${profile.username}` : profile.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center gap-5 text-center">
                    <div>
                      <div className="text-2xl font-bold">{concerns.length}</div>
                      <div className="text-xs text-muted-foreground">Concerns</div>
                    </div>
                    <Separator orientation="vertical" />
                    <div>
                      <div className="text-2xl font-bold">{groups.length}</div>
                      <div className="text-xs text-muted-foreground">Groups</div>
                    </div>
                    <Separator orientation="vertical" />
                    <div>
                      <div className="text-2xl font-bold">{donations.length}</div>
                      <div className="text-xs text-muted-foreground">Donations</div>
                    </div>
                  </div>
                  {isOwnProfile && (
                    <Button className="w-full gap-1" asChild>
                      <Link to={`/profile/${profileId}/edit`}><Edit className="h-4 w-4" /> Edit Profile</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle>About</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p className="text-muted-foreground">{profile.bio || "No bio added yet."}</p>
                <InfoRow icon={Mail} label="Email" value={profile.email} />
                {profile.address && <InfoRow icon={MapPin} label="Address" value={profile.address} />}
                <InfoRow icon={Calendar} label="Joined" value={joinedDate} />
              </CardContent>
            </Card>

            {!!profile.education?.length && (
              <Card>
                <CardHeader><CardTitle>Education</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {profile.education.map((item, index) => (
                    <div key={index} className="flex gap-3 text-sm">
                      <GraduationCap className="mt-1 h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{item.degree}</div>
                        <div className="text-muted-foreground">{item.institution}</div>
                        <div className="text-xs text-muted-foreground">{item.year}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Tabs defaultValue="concerns">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="concerns">Concerns</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
                <TabsTrigger value="donations">Donations</TabsTrigger>
              </TabsList>

              <TabsContent value="concerns" className="mt-4 space-y-4">
                {!concerns.length && <EmptyState text="No concerns raised yet." />}
                {concerns.map((concern) => (
                  <Card key={concern._id}>
                    <CardHeader>
                      <CardTitle className="text-lg"><Link to={`/concerns/${concern._id}`} className="hover:underline">{concern.title}</Link></CardTitle>
                      <CardDescription>{new Date(concern.createdAt).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{concern.description}</p>
                      <div className="mt-3 flex gap-2">
                        {(concern.tags || []).map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="groups" className="mt-4 space-y-4">
                {!groups.length && <EmptyState text="No groups joined yet." />}
                {groups.map((group) => (
                  <Card key={group._id}>
                    <CardHeader>
                      <CardTitle className="text-lg"><Link to={`/community/${group._id}`} className="hover:underline">{group.name}</Link></CardTitle>
                      <CardDescription>{group.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {group.members?.length || 0} members</span>
                      <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> discussions</span>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="donations" className="mt-4 space-y-4">
                {!donations.length && <EmptyState text="No verified donations yet." />}
                {donations.map((donation) => (
                  <Card key={donation._id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <IndianRupee className="h-4 w-4" /> {donation.amount} {donation.currency}
                      </CardTitle>
                      <CardDescription>{donation.causeName}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Verified on {new Date(donation.verifiedAt || donation.createdAt).toLocaleDateString()}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  const RowIcon = Icon;
  return (
    <div className="flex items-start gap-2">
      <RowIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-muted-foreground">{value}</div>
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return <div className="rounded-xl border bg-white p-8 text-center text-muted-foreground">{text}</div>;
}
