import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isAuthenticated = localStorage.getItem('ecorank_user') !== null;
  return isAuthenticated ? <>{element}</> : <Navigate to="/login" />;
}; 