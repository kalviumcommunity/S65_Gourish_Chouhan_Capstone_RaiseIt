import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, SearchX, Rocket } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-md flex-col items-center text-center"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{ 
            y: [0, -8, 0],
            rotate: [0, 3, -3, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Rocket className="h-20 w-20 text-primary/80" aria-hidden="true" />
        </motion.div>

        {/* Text Content */}
        <motion.h1 
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mt-6 text-6xl font-bold tracking-tight text-primary/90 sm:text-7xl"
        >
          404
        </motion.h1>
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-2xl font-semibold text-foreground"
        >
          Page Not Found
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-base text-muted-foreground"
        >
          We apologize for the inconvenience. The page you're looking for seems to be unavailable.
          Let us help you navigate back to familiar territory.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="group hover:bg-primary/5"
            aria-label="Go back to the previous page"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Go Back
          </Button>
          <Button 
            asChild 
            className="group bg-primary hover:bg-primary/90"
            aria-label="Go back to the homepage"
          >
            <a href="/">
              <Home className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Return Home
            </a>
          </Button>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div 
          className="absolute inset-0 -z-10 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ delay: 1 }}
        >
          <div className="absolute -top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/4 h-[200px] w-[200px] rounded-full bg-primary/10 blur-3xl" />
        </motion.div>
      </motion.div>
    </div>
  );
}