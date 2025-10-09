// src/context/UserProvider.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const UserContext = createContext(null);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within <UserProvider>");
  return ctx;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUser = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("Access-Token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${serverUrl}/auth/profile/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        // console.error("[UserProvider] Failed:", data);
        setError("Failed to load user profile");
        setUser(null);
        return;
      }

      // console.log('Getting user data', data);
      setUser(data);
    } catch (err) {
      // console.error("[UserProvider] Network error:", err);
      setError("Network error");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, error, reloadUser: loadUser }}
    >
      {children}
    </UserContext.Provider>
  );
};
