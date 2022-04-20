import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = React.createContext();

function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(async () => {
    try {
      const { status, data } = await axios.get('/auth');
      if (status >= 200 && status < 300) {
        setUser(data.user);
      }
    } catch (error) {
      if (error?.response?.status !== 401) {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = { user, setUser, isLoading, setIsLoading  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an Auth provider');
  return context;
};

export { useAuth, AuthProvider };
