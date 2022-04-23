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
import {AlertProvider} from './hooks/alertContext';
import useAlert from './hooks/useAlert';
import { AuthProvider } from './hooks/authContext';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './components/tomatopalette';

// Global styling
import './index.css';

export function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
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
          <Footer />
        </ThemeProvider>
      </AlertProvider>
    </AuthProvider>
  );
}
