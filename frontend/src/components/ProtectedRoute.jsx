import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route wrapper that requires user to be logged in.
 * If unauthenticated, redirects to /login with state containing the attempted path and a notice message.
 * Optionally enforces required role ('ROLE_ADMIN' or 'ROLE_CLIENT').
 */
export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAdmin, isClient } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          message: 'Please sign in to access this page and proceed.',
        }}
      />
    );
  }

  if (requiredRole === 'ROLE_ADMIN' && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === 'ROLE_CLIENT' && !isClient) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * Route wrapper for auth pages (Login / Register).
 * If user is already authenticated, redirects them away to home or their prior requested path.
 */
export const PublicOnlyRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    const destination = location.state?.from?.pathname || '/';
    return <Navigate to={destination} replace />;
  }

  return children;
};

export default ProtectedRoute;
