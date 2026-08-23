import React from 'react';
import { Navigate } from 'react-router';
import { useAuthStore, type Role } from '../../stores/authStore';

type Props = {
  children: React.ReactNode;
  allowedRoles?: Role[];
};

export const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
