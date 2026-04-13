import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import PopularServices from './components/PopularServices';
import { LanguageProvider } from './context/LanguageContext';

import ServicesPage from './pages/ServicesPage';
import CategoryServicesPage from './pages/CategoryServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import AnnouncementPage from './pages/AnnouncementPage';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';

// Home Component
const Home = () => (
  <>
    <Hero />
    <PopularServices />
  </>
);

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col font-sans selection:bg-brand/20">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/categories/:categoryName" element={<CategoryServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetailPage />} />
            <Route path="/announcements" element={<AnnouncementPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;

