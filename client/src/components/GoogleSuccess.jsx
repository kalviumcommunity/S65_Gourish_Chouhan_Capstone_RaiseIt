import { useEffect } from "react";

export default function GoogleSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");
    if (token && name && email) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ name, email }));
      window.location.href = "/"; // Redirect to home
    }
  }, []);

  return <div>Signing you in...</div>;
}