import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { movieService } from '../services/movieService';

const AppContext = createContext(null);

const PROFILES = [
  {
    id: 'p1',
    name: 'Alex Hunter',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    type: 'Primary',
  },
  {
    id: 'p2',
    name: 'Kids Club',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
    type: 'Kids',
  },
  {
    id: 'p3',
    name: 'Elena',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    type: 'Adult',
  }
];

export function AppProvider({ children }) {
  const { favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite } = useFavorites();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentProfile, setCurrentProfile] = useState(PROFILES[0]);
  const [notifications, setNotifications] = useState([]);

  // Load real trending movies and use them as notifications
  useEffect(() => {
    movieService.getTrending().then((items) => {
      const notifs = items.slice(0, 3).map((movie, idx) => ({
        id:          `notif-${movie.id}`,
        title:       idx === 0 ? 'Now Trending Worldwide' : idx === 1 ? 'New Release' : 'Top Rated Pick',
        description: `${movie.title} is ${idx === 0 ? '#1 trending' : idx === 1 ? 'just added' : 'critically acclaimed'} on NetStream.`,
        time:        ['2 hours ago', 'Yesterday', '3 days ago'][idx],
        read:        idx === 2,
        image:       movie.poster,
      }));
      setNotifications(notifs);
    }).catch(() => {
      // fallback if API fails
      setNotifications([{
        id: 'n-fallback',
        title: 'Welcome to NetStream',
        description: 'Explore trending movies and series now.',
        time: 'just now',
        read: false,
        image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100&q=80',
      }]);
    });
  }, []);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((cur) => (cur === message ? null : cur));
    }, 3000);
  }, []);

  const openModal = useCallback((movie) => {
    setSelectedMovie(movie);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  const playMovie = useCallback((movie) => {
    setActiveVideo(movie);
  }, []);

  const closePlayer = useCallback(() => {
    setActiveVideo(null);
  }, []);

  const handleToggleFavorite = useCallback(
    (movie) => {
      const alreadyFav = isFavorite(movie.id);
      toggleFavorite(movie);
      showToast(alreadyFav ? `Removed from My List` : `Added to My List`);
    },
    [isFavorite, toggleFavorite, showToast]
  );

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const switchProfile = useCallback((profile) => {
    setCurrentProfile(profile);
    showToast(`Switched profile to ${profile.name}`);
  }, [showToast]);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite: handleToggleFavorite,
    isFavorite,
    selectedMovie,
    openModal,
    closeModal,
    activeVideo,
    playMovie,
    closePlayer,
    searchQuery,
    setSearchQuery,
    currentProfile,
    profiles: PROFILES,
    switchProfile,
    notifications,
    unreadNotificationsCount,
    markAllNotificationsRead,
    toastMessage,
    showToast
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
