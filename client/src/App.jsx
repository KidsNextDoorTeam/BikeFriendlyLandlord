import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Navbar } from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import MapSearch from './pages/MapSearch.jsx';
import Profile from './pages/Profile.jsx';
import Search from './pages/Search.jsx';
import ReviewPage from './pages/ReviewPage.jsx';
import UserProfile from './pages/UserProfile.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import useAuth from './hooks/useAuth';
import UserContext from './hooks/userContext';

// Global styling
import './index.css';

export function App() {
  const { isLoading, user, setUser } = useAuth();

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/map" element={<MapSearch />} />
        <Route path="/landlord/:landlord_id" element={<Profile />} />
        <Route
          path="/review/:landlord_id"
          element={<ProtectedRoute><ReviewPage /></ProtectedRoute>}
        />
        <Route
          path="/profile/:username"
          element={<ProtectedRoute><UserProfile /></ProtectedRoute>}
        />
        <Route path="*" element={<p>404 - nothing here</p>} />
      </Routes>
      <Footer />
    </UserContext.Provider>
  );
}
