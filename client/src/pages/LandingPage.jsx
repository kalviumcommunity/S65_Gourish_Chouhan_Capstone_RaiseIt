import { useState, useEffect } from "react";
import hero from "../assets/hero.png";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Flag,
  MessageSquare,
  TrendingUp,
  ThumbsUp,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

const ConcernCardSkeleton = () => (
  <Card className="overflow-hidden">
    <CardHeader>
      <Skeleton className="h-6 w-3/4 rounded-md" />
      <Skeleton className="mt-2 h-4 w-1/2 rounded-md" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full rounded-md" />
      <Skeleton className="mt-2 h-4 w-5/6 rounded-md" />
    </CardContent>
    <CardFooter className="flex justify-between">
      <Skeleton className="h-8 w-24 rounded-md" />
      <Skeleton className="h-10 w-28 rounded-md" />
    </CardFooter>
  </Card>
);

const ConcernCard = ({ concern }) => (
  <motion.div
    variants={itemVariants}
    className="group relative flex h-full flex-col"
  >
    <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 group-hover:shadow-lg">
      <CardHeader>
        <CardTitle className="line-clamp-2">{concern.title}</CardTitle>
        <div className="flex items-center gap-2 pt-1 text-sm text-muted-foreground">
          <Avatar className="h-6 w-6">
            <AvatarFallback>
              {concern.user?.name ? concern.user.name[0].toUpperCase() : "A"}
            </AvatarFallback>
          </Avatar>
          <span>{concern.user?.name || "Anonymous"}</span>
          <span>•</span>
          <span>{new Date(concern.createdAt).toLocaleDateString()}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {concern.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between bg-gray-50/50 p-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ThumbsUp className="h-4 w-4" /> {concern.upvotes?.length || 0}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4" /> {concern.comments?.length || 0}
          </span>
        </div>
        <div className="z-10 font-medium text-primary transition-transform duration-300 group-hover:translate-x-1">
          <span className="flex items-center gap-1.5 text-sm">
            View Concern <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </CardFooter>
    </Card>
    <Link to={`/concerns/${concern._id}`} className="absolute inset-0 z-20">
      <span className="sr-only">View details for {concern.title}</span>
    </Link>
  </motion.div>
);

export default function LandingPage() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingConcerns = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "https://raiseit.onrender.com/api/concerns?sort=trending&limit=4"
        );
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setTrending(data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch concerns:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingConcerns();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div
              className="flex flex-col justify-center space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none">
                  Raise Your Voice,
                  <br />
                  <span className="text-primary">Make a Difference</span>
                </h1>
                <p className="max-w-[600px] text-lg text-muted-foreground">
                  RaiseIt is a platform where you can voice concerns, get
                  community support, and drive meaningful change together.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link to="/auth" className="gap-1.5">
                    Get Started <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/concerns">Browse Concerns</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={hero}
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center shadow-lg sm:w-full lg:order-last"
                style={{ maxHeight: 400, maxWidth: 600 }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full bg-gray-50 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-lg">
              Our streamlined process makes it easy to voice your concerns and
              gather the support you need.
            </p>
          </motion.div>
          <motion.div
            className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {[
              {
                icon: Flag,
                title: "Raise a Concern",
                desc: "Create a detailed post about your issue, add relevant tags, and submit it to the community.",
              },
              {
                icon: MessageSquare,
                title: "Gather Support",
                desc: "Receive feedback, upvotes, and support from community members who share your concerns.",
              },
              {
                icon: TrendingUp,
                title: "Drive Change",
                desc: "Popular concerns gain visibility, increasing the chance of being addressed by relevant authorities.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="flex flex-col items-center gap-4 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Trending Concerns Section */}
      <section className="w-full py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Trending Concerns
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-lg">
              See what issues are currently gaining traction and support in the
              community.
            </p>
          </motion.div>
          <motion.div
            className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {loading ? (
              <>
                <ConcernCardSkeleton />
                <ConcernCardSkeleton />
                <ConcernCardSkeleton />
                <ConcernCardSkeleton />
              </>
            ) : error ? (
              <div className="col-span-2 text-center text-red-500">
                Failed to load trending concerns. Please try again later.
              </div>
            ) : trending.length === 0 ? (
              <div className="col-span-2 text-center text-muted-foreground">
                No trending concerns at the moment. Be the first to raise one!
              </div>
            ) : (
              trending.map((concern) => (
                <ConcernCard key={concern._id} concern={concern} />
              ))
            )}
          </motion.div>
          <div className="flex justify-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/concerns">View All Concerns</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}