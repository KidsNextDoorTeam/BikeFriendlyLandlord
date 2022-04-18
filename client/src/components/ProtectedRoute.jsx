import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import UserContext from '../hooks/userContext';

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useContext(UserContext);

  const location = useLocation();

  // TODO: Add a Loading component
  if (isLoading) return <div>Loading...</div>;

  if (user) return children;

  // Route the user to the home page for signin and save the path they were
  // trying to reach 
  return <Navigate to='/' replace state={{ path: location.pathname }} />;
}
