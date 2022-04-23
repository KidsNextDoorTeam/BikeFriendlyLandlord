import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAlert } from '../hooks/alertContext';
import { useAuth } from '../hooks/authContext';

export default function ProtectedRoute({ children }) {
  const {user, isLoading} = useAuth();
  const { alert, alertSeverity, setAlert, setAlertSeverity } = useAlert();

  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      // this needs to occur in useEffect to prevent App from 
      // re-rendering while this component is re-rendering
      setAlert('Please login to access this page');
      setAlertSeverity('error');
    }
  });
  // TODO: Add a Loading component
  if (isLoading) return <div>Loading...</div>;

  if (user) return children;

  // Route the user to the home page for signin and save the path they were
  // trying to reach 
  return <Navigate to='/' replace state={{ path: location.pathname }} />;
}
