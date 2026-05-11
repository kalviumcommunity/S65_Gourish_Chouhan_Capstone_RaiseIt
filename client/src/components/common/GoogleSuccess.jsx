import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function GoogleSuccess() {
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");
    const id = params.get("id");
    if (token && name && email) {
      login({ token, user: { id, name, email } });
      window.location.href = "/"; // Redirect to home
    }
  }, [login]);

  return <div>Signing you in...</div>;
}
