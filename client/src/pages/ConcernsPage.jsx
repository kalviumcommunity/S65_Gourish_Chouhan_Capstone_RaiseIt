import { useState } from "react";
import { Link } from "react-router-dom";
import { Flag, Filter, MessageSquare, Plus, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function ConcernsPage() {
  // You can replace this with real data from your backend later
  const concerns = Array.from({ length: 9 }).map((_, i) => ({
    id: i + 1,
    title: [
      "Road Safety Concerns at Main Street Junction",
      "Noise Pollution from Construction Site",
      "Water Quality Issues in Riverside Area",
      "Public Transport Frequency Problems",
      "Playground Equipment Maintenance Needed",
      "Street Light Outages in Downtown",
      "Waste Collection Delays in North District",
      "Sidewalk Repairs Needed on Oak Street",
      "Air Quality Concerns Near Industrial Zone",
    ][i % 9],
    author: ["John Doe", "Jane Smith", "Alex Johnson"][i % 3],
    time: ["2 days", "1 week", "3 days"][i % 3],
    description: [
      "The intersection at Main Street and 5th Avenue has become increasingly dangerous for pedestrians. There have been several near-misses in the past month alone...",
      "The construction site on Elm Street has been operating outside of permitted hours, causing significant noise disturbance to nearby residents...",
      "Residents in the Riverside area have noticed discoloration and unusual odor in tap water over the past two weeks. This is concerning for health reasons...",
      "The frequency of buses on Route 42 has decreased significantly in recent months, causing overcrowding and longer wait times for commuters...",
      "Several pieces of equipment at Central Park playground are broken or damaged, posing safety risks for children. The swings are missing seats and the slide has cracks...",
      "Multiple street lights in the downtown area have been out for over a month, creating safety concerns for pedestrians and drivers at night...",
      "Waste collection in the North District has been delayed by up to three days for the past two weeks, leading to overflowing bins and hygiene concerns...",
      "The sidewalks on Oak Street between 3rd and 7th Avenue have multiple cracks and uneven surfaces, creating tripping hazards for pedestrians...",
      "Residents near the industrial zone have reported increased respiratory issues which may be related to emissions from the factories in the area...",
    ][i % 9],
    tag: [
      "Infrastructure",
      "Environment",
      "Safety",
      "Public Services",
      "Health",
      "Transportation",
      "Maintenance",
      "Noise",
      "Pollution",
    ][i % 9],
    status:
      i % 3 === 0
        ? "In Progress"
        : i % 3 === 1
        ? "Resolved"
        : "Pending",
    statusClass:
      i % 3 === 0
        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
        : i % 3 === 1
        ? "bg-green-50 text-green-700 border-green-200"
        : "bg-red-50 text-red-700 border-red-200",
    comments: (i + 1) * 7,
  }));

  const [search, setSearch] = useState("");

  // Filter concerns by search
  const filteredConcerns = concerns.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Community Concerns</h1>
          <p className="text-muted-foreground">
            Browse and discover concerns raised by the community
          </p>
        </div>
        <Link to="/concerns/new">
          <Button className="gap-1">
            <Plus className="h-4 w-4" /> Raise a Concern
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search concerns..."
            className="w-full pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-1">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredConcerns.map((concern) => (
              <Card key={concern.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{concern.title}</CardTitle>
                  <CardDescription>
                    Posted by {concern.author} • {concern.time} ago
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm">{concern.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline">{concern.tag}</Badge>
                    <Badge variant="outline" className={concern.statusClass}>
                      {concern.status}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <MessageSquare className="h-4 w-4" /> {concern.comments} Comments
                    </Button>
                  </div>
                  <Link to={`/concerns/${concern.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Button variant="outline">Load More</Button>
          </div>
        </TabsContent>
        <TabsContent value="trending">
          <div className="py-4 text-center text-muted-foreground">
            Trending concerns will appear here.
          </div>
        </TabsContent>
        <TabsContent value="recent">
          <div className="py-4 text-center text-muted-foreground">
            Most recent concerns will appear here.
          </div>
        </TabsContent>
        <TabsContent value="resolved">
          <div className="py-4 text-center text-muted-foreground">
            Resolved concerns will appear here.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}