import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useClerkAuth();
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = useCallback(async () => {
    if (!isLoaded || !isSignedIn || !user) {
      setAdmin(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const clerkToken = await getToken();
      setToken(clerkToken);

      const email = user.primaryEmailAddress?.emailAddress;
      if (email) {
        // Fetch admin permissions from our backend
        const res = await fetch(`http://localhost:5000/api/admins/me?email=${encodeURIComponent(email)}`, {
          headers: {
            'Authorization': `Bearer ${clerkToken}`,
            'X-Admin-Email': email
          }
        });

        if (res.ok) {
          const data = await res.json();
          setAdmin(data);
          console.log("Admin permissions loaded:", data.username);
        } else {
          const errorData = await res.json().catch(() => ({}));
          console.error("Failed to fetch admin permissions:", errorData.msg || res.statusText);
          toast.error("Account restricted: Your email is not in the approved admin list.");
        }
      }
    } catch (err) {
      console.error("Error in AuthProvider:", err);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, user, getToken]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // Centralized fetch helper that includes Clerk token and Admin Email
  const authFetch = useCallback(async (url, options = {}) => {
    const clerkToken = await getToken();
    const email = user?.primaryEmailAddress?.emailAddress;

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${clerkToken}`,
      'X-Admin-Email': email || '',
    };

    return fetch(url, { ...options, headers });
  }, [getToken, user]);

  return (
    <AuthContext.Provider value={{ admin, token, loading, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
