import React, { useEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';

export function AuthGuard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [isApproved, setIsApproved] = useState(null); // null = loading, true = approved, false = rejected
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const checkApproval = async () => {
      if (!isLoaded || !isSignedIn || !user) return;
      
      const email = user.primaryEmailAddress?.emailAddress;
      if (!email) {
        toast.error("No email address found for this account.");
        signOut();
        return;
      }

      setChecking(true);
      try {
        const res = await fetch(`http://localhost:5000/api/admins/check/${email}`);
        const data = await res.json();

        if (data.approved) {
          setIsApproved(true);
        } else {
          setIsApproved(false);
          toast.error("The email you entered is not recognized by the administrator of this portal. Please contact the admin and try again later.", {
            duration: 6000,
            position: 'top-center',
            style: {
              borderRadius: '12px',
              background: '#ef4444',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              padding: '16px',
              maxWidth: '400px'
            }
          });
          signOut();
        }
      } catch (err) {
        console.error("Approval check failed:", err);
        toast.error("Security check failed. Please try again.");
        signOut();
      } finally {
        setChecking(false);
      }
    };

    if (isLoaded && isSignedIn) {
      checkApproval();
    }
  }, [isLoaded, isSignedIn, user, signOut]);

  if (!isLoaded || checking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin mb-4" />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Verifying Credentials...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  if (isApproved === false) {
    return <Navigate to="/login" replace />;
  }

  if (isApproved === true) {
    return <Outlet />;
  }

  return null;
}
