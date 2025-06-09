import { useState } from "react";

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint =
        mode === "signup"
          ? "https://raiseit.onrender.com/api/auth/register"
          : "https://raiseit.onrender.com/api/auth/login";
      const body =
        mode === "signup"
          ? { name, email, password }
          : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Auth failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onAuthSuccess && onAuthSuccess(data.user);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        {mode === "signup" ? "Sign Up" : "Log In"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "signup" && (
          <input
            className="border p-2 w-full"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          className="border p-2 w-full"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="border p-2 w-full"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : mode === "signup"
            ? "Sign Up"
            : "Log In"}
        </button>
      </form>
      <div className="mt-4 text-center">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <button
              className="text-blue-600 underline"
              onClick={() => setMode("login")}
            >
              Log In
            </button>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <button
              className="text-blue-600 underline"
              onClick={() => setMode("signup")}
            >
              Sign Up
            </button>
          </>
        )}
        <button
          className="bg-red-500 text-white px-4 py-2 rounded w-full mt-4"
          onClick={() => {
            window.location.href = "https://raiseit.onrender.com/api/auth/google";
          }}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}