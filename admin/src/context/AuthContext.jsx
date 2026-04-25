import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(true);

  // Since JWT is stateless on the server, we just decode or assume validity
  // A better approach would be to have a GET /api/auth/me to verify,
  // but for now, we rely on the user object stored during login
  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (token && storedUser) {
      setAdmin(JSON.parse(storedUser));
    } else {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setToken(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
         throw new Error(data.msg || 'Login failed');
      }

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      setToken(data.token);
      setAdmin(data.user);
      
      toast.success(`Welcome, ${data.user.username}`, {
         style: {
            borderRadius: '16px',
            background: '#333',
            color: '#fff',
         },
      });

      return true;
    } catch (err) {
      toast.error(err.message, {
         style: {
            borderRadius: '16px',
            background: '#ff4b4b',
            color: '#fff',
         },
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setToken(null);
    setAdmin(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
