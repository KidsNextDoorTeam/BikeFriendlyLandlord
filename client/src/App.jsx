import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Navbar } from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MapSearch from './pages/MapSearch';
import Profile from './pages/Profile';
import Search from './pages/Search';
import ReviewPage from './pages/ReviewPage';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import useAuth from './hooks/useAuth';
import UserContext from './hooks/userContext';
import Alerts from './components/Alerts';
import AlertContext from './hooks/alertContext';
import useAlert from './hooks/useAlert';
import Chat from "../src/components/chatbot/chat.jsx"
// Global styling
import './index.css';

export function App() {
  const { isLoading, user, setUser } = useAuth();
  const { alert, setAlert, alertSeverity, setAlertSeverity } = useAlert();

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      <AlertContext.Provider value={{ alert, setAlert, alertSeverity, setAlertSeverity }}>
        <Navbar />
        <Alerts />
        <Chat />
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
      </AlertContext.Provider>
    </UserContext.Provider>
  );
}
