import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MovieModal from './components/MovieModal';
import VideoPlayer from './components/VideoPlayer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import NewPopular from './pages/NewPopular';
import MyList from './pages/MyList';
import Search from './pages/Search';
import { AppProvider, useApp } from './context/AppContext';

import './styles/global.css';
import './styles/components.css';

// Helper to scroll to top smoothly when route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Inner application content that consumes AppContext
function AppContent() {
  const { activeVideo, toastMessage } = useApp();

  return (
    <div className="app-container">
      <ScrollToTop />
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv-shows" element={<TVShows />} />
          <Route path="/new-popular" element={<NewPopular />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Global Details Modal */}
      <MovieModal />

      {/* Global Video Player Overlay */}
      {activeVideo && <VideoPlayer movie={activeVideo} />}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="app-toast">
          <div className="app-toast-dot" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
}
