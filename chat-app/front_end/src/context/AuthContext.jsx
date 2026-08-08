import React, { createContext, useState, useEffect } from 'react';
import socket from '../services/socket';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('chatAppUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('chatAppUser', JSON.stringify(userData));
    // Connect socket and join room for real‑time updates
    socket.connect();
    socket.emit('join', userData.id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chatAppUser');
    // Disconnect socket on logout
    socket.disconnect();
  };

  if (loading) {
    return null; // The loading state can be improved with a Spin component later, but this is fast.
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
