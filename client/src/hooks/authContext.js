import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = React.createContext();

function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [description, setDescription] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');


  useEffect(async () => {
    try {
      const { status, data } = await axios.get('/auth');
      if (status >= 200 && status < 300) {
        setUser(data.user);
        setFirstName(data.user.first_name);
        setLastName(data.user.last_name);
        setDescription(data.user.description);
        setProfilePic(data.user.profile_pic);
        setUsername(data.user.username);
        setEmail(data.user.email);
      }
    } catch (error) {
      if (error?.response?.status !== 401) {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = { user, setUser, isLoading, setIsLoading, firstName, setFirstName, lastName, setLastName, description, setDescription, profilePic, setProfilePic, username, setUsername, email, setEmail };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an Auth provider');
  return context;
};

export { useAuth, AuthProvider };
