import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Plus, Search, ThumbsUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { getConcerns } from "../services/api";

const statusOptions = {
  all: undefined,
  pending: "Pending",
  progress: "In Progress",
  resolved: "Resolved",
};

export default function ConcernsPage() {
  const [concerns, setConcerns] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadConcerns = (params = {}) => {
    setLoading(true);
    setError("");
    getConcerns({ limit: 100, ...params })
      .then(setConcerns)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const params = {};
    if (query.trim()) params.search = query.trim();
    if (activeTab === "trending") params.sort = "trending";
    if (statusOptions[activeTab]) params.status = statusOptions[activeTab];
    loadConcerns(params);
  }, [activeTab, query]);

  const handleSearch = (event) => {
    event.preventDefault();
    setQuery(search);
  };

  const renderContent = () => {
    if (loading) return <div className="py-8 text-center text-muted-foreground">Loading concerns...</div>;
    if (error) return <div className="py-8 text-center text-red-600">{error}</div>;
    if (!concerns.length) return <div className="py-8 text-center text-muted-foreground">No concerns found.</div>;

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {concerns.map((concern) => (
          <Card key={concern._id} className="overflow-hidden">
            {concern.image && <img src={concern.image} alt="Concern" className="h-40 w-full object-cover" />}
            <CardHeader>
              <CardTitle className="line-clamp-1">{concern.title}</CardTitle>
              <CardDescription>
                Posted by {concern.user?.name || "Anonymous"} on {new Date(concern.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-sm text-muted-foreground">{concern.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(concern.tags || []).map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                <Badge variant="outline">{concern.status || "Pending"}</Badge>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><ThumbsUp className="h-4 w-4" /> {concern.upvotes?.length || 0}</span>
                <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> {concern.comments?.length || 0}</span>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/concerns/${concern._id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Community Concerns</h1>
          <p className="text-muted-foreground">Browse, search, and support concerns raised by the community</p>
        </div>
        <Button className="gap-1" asChild>
          <Link to="/concerns/new"><Plus className="h-4 w-4" /> Raise a Concern</Link>
        </Button>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search concerns..." className="w-full pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="outline" type="submit">Search</Button>
      </form>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="space-y-4 pt-4">{renderContent()}</TabsContent>
      </Tabs>
    </div>
  );
}
