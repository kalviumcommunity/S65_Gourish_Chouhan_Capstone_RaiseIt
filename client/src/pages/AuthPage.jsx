import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

// A simple SVG for the Google icon
const GoogleIcon = (props) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Google</title>
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-5.06 1.9-4.41 0-7.99-3.59-7.99-7.99s3.58-7.99 7.99-7.99c2.36 0 4.01.92 4.94 1.84l2.58-2.58C18.99 1.29 16.1.25 12.48.25c-6.63 0-12 5.37-12 12s5.37 12 12 12c6.92 0 11.52-4.88 11.52-11.72 0-.79-.07-1.54-.19-2.28z" />
  </svg>
);

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login"); // 'login' or 'signup'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);

  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const navigate = useNavigate();

  // Initialize Vanta.js background effect on mount
  useEffect(() => {
    if (!vantaEffect && window.VANTA) {
      setVantaEffect(
        window.VANTA.GLOBE({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xd1d1d1,
          color2:0xe3e3e3,
          backgroundColor: 0xffffff,
          size: 0.9,
        })
      );
    }
    // Destroy Vanta effect on unmount to prevent memory leaks
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const handleAuthSuccess = (userData) => {
    if (onAuthSuccess) {
      onAuthSuccess(userData);
    }
    navigate("/"); // Redirect to home page on success
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint =
        mode === "signup"
          ? "https://raiseit.onrender.com/api/auth/register"
          : "https://raiseit.onrender.com/api/auth/login";
      const body =
        mode === "signup" ? { name, email, password } : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Authentication failed.");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      handleAuthSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    setGoogleLoading(true);
    window.location.href = "https://raiseit.onrender.com/api/auth/google";
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError(null);
  };

  return (
    <div
      ref={vantaRef}
      className="flex min-h-screen w-full items-center justify-center p-4"
    >
      {/* IMPROVEMENT: This is now a contained, rounded glass container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
      >
        {/* IMPROVEMENT: The blur is now contained within this container */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[300px]"></div>

        <div className="relative z-10">
          <Card className="border-none bg-transparent shadow-none">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-black">
                {mode === "login" ? "Welcome Back!" : "Create an Account"}
              </CardTitle>
              <CardDescription>
                {mode === "login"
                  ? "Enter your credentials to access your account."
                  : "Enter your information to get started."}
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {/* IMPROVEMENT: Smoothly animates the name field in and out */}
                <AnimatePresence mode="wait">
                  {mode === "signup" && (
                    <motion.div
                      key="name-field"
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                {error && (
                  <p className="text-center text-sm text-red-500">{error}</p>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading
                    ? "Please wait..."
                    : mode === "login"
                    ? "Log In"
                    : "Create Account"}
                </Button>

                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleAuth}
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <GoogleIcon className="mr-2 h-4 w-4" />
                  )}
                  Google
                </Button>

                <div className="mt-2 text-center text-sm">
                  {mode === "login"
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <Button
                    type="button"
                    variant="link"
                    className="pl-1"
                    onClick={toggleMode}
                  >
                    {mode === "login" ? "Sign up" : "Log in"}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}