import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

function getStoredUser() {
  try {
    const stored = JSON.parse(localStorage.getItem("user"));
    return stored ? { ...stored, id: stored.id || stored._id } : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const login = (authData) => {
    const nextUser = { ...authData.user, id: authData.user.id || authData.user._id };
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", JSON.stringify(nextUser));
    setToken(authData.token);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const updateUser = (nextUser) => {
    const normalized = { ...nextUser, id: nextUser.id || nextUser._id };
    localStorage.setItem("user", JSON.stringify(normalized));
    setUser(normalized);
  };

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(token && user), login, logout, updateUser }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
