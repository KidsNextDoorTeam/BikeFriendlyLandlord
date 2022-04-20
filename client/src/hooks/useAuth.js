import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useAuth() {
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

  return {
    user,
    setUser,
    isLoading,
  };
}