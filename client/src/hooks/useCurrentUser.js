import { useCallback, useEffect, useState } from "react";

const parseStoredUser = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export function useCurrentUser() {
  const [user, setUser] = useState(() => parseStoredUser());

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      setUser(parseStoredUser());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const userBasePath = user?.username
    ? `/${encodeURIComponent(user.username)}`
    : "";

  return { user, userBasePath, logout };
}
