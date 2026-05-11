import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Filter, Plus, Search, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { getGroups, joinGroup, leaveGroup } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function CommunityPage() {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, isAuthenticated } = useAuth();

  const loadGroups = (searchTerm = search) => {
    setLoading(true);
    getGroups(searchTerm ? { search: searchTerm } : {})
      .then(setGroups)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    getGroups()
      .then(setGroups)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    loadGroups(search);
  };

  const toggleMembership = async (group) => {
    if (!isAuthenticated) return alert("Please log in to join groups.");
    const userId = user?.id || user?._id;
    const isMember = group.members?.some((member) => (member._id || member.id) === userId);
    const updated = isMember ? await leaveGroup(group._id) : await joinGroup(group._id);
    setGroups((current) => current.map((item) => (item._id === updated._id ? updated : item)));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Discussion Groups</h1>
          <p className="text-muted-foreground">Create or join focused spaces around community issues.</p>
        </div>
        <Button className="gap-1" asChild>
          <Link to="/community/new"><Plus className="h-4 w-4" /> Create Group</Link>
        </Button>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search groups..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="outline" className="gap-1" type="submit">
          <Filter className="h-4 w-4" /> Search
        </Button>
      </form>

      {loading && <div className="py-10 text-center text-muted-foreground">Loading groups...</div>}
      {error && <div className="py-10 text-center text-red-600">{error}</div>}
      {!loading && !error && !groups.length && (
        <div className="rounded-xl border bg-white p-10 text-center">
          <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No groups yet</h2>
          <p className="mt-2 text-muted-foreground">Start the first group for a topic your community cares about.</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((group) => {
          const userId = user?.id || user?._id;
          const isMember = group.members?.some((member) => (member._id || member.id) === userId);

          return (
            <Card key={group._id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl">
                      <Link to={`/community/${group._id}`} className="hover:underline">{group.name}</Link>
                    </CardTitle>
                    <CardDescription className="mt-2"><Badge variant="outline">{group.category}</Badge></CardDescription>
                  </div>
                  <Button variant={isMember ? "outline" : "default"} size="sm" onClick={() => toggleMembership(group)}>
                    {isMember ? "Leave" : "Join"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">{group.description}</p>
                <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {group.members?.length || 0} members</span>
                  <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> discussions</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/community/${group._id}`}>View Discussions</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
