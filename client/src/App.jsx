import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MapSearch from './pages/MapSearch';
import Profile from './pages/Profile';
import Search from './pages/Search';
import ReviewPage from './pages/ReviewPage';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import Alerts from './components/Alerts';
import AlertContext from './hooks/alertContext';
import useAlert from './hooks/useAlert';
import Chat from '../src/components/chatbot/chat';
import { AuthProvider } from './hooks/authContext';
// Global styling
import './index.css';

export function App() {
  const { alert, setAlert, alertSeverity, setAlertSeverity } = useAlert();

  return (
    <AuthProvider>
      <AlertContext.Provider value={{ alert, setAlert, alertSeverity, setAlertSeverity }}>
        <Navbar />
        <Alerts />
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
        {/* <Chat /> */}
        <Footer />
      </AlertContext.Provider>
    </AuthProvider>
  );
}
