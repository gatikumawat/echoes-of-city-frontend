import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RegistrationPage from './pages/RegistrationPage';
import SigninPage from './pages/SigninPage';
import SitesPage from './pages/SitesPage';
import SiteDetailsPage from './pages/SiteDetailsPage';
import MapPage from './pages/MapPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<RegistrationPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/sites" element={<SitesPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/site/:id" element={<SiteDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
