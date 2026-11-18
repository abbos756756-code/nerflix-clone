import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Menu, 
  X, 
  Play, 
  Check, 
  User, 
  HelpCircle, 
  LogOut, 
  Settings 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const { 
    currentProfile, 
    profiles, 
    switchProfile, 
    notifications, 
    unreadNotificationsCount, 
    markAllNotificationsRead,
    searchQuery,
    setSearchQuery,
    showToast
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);

  // Detect scroll to darken navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsNotificationsOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Sync search input if URL changes or cleared
  useEffect(() => {
    if (location.pathname === '/search') {
      setIsSearchOpen(true);
    }
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      setSearchQuery(searchVal.trim());
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchVal(val);
    setSearchQuery(val);
    if (val.trim()) {
      navigate(`/search?q=${encodeURIComponent(val.trim())}`);
    }
  };

  const toggleSearch = () => {
    if (isSearchOpen && !searchVal) {
      setIsSearchOpen(false);
    } else {
      setIsSearchOpen(true);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const clearSearch = () => {
    setSearchVal('');
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left">
        <Link to="/" className="brand-logo" aria-label="StreamFlix Home">
          <Play fill="#e50914" size={26} />
          <span>NETSTREAM</span>
        </Link>

        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/tv-shows" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              TV Shows
            </NavLink>
          </li>
          <li>
            <NavLink to="/movies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Movies
            </NavLink>
          </li>
          <li>
            <NavLink to="/new-popular" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              New & Popular
            </NavLink>
          </li>
          <li>
            <NavLink to="/my-list" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              My List
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        {/* Search Bar */}
        <div className="search-container">
          {isSearchOpen ? (
            <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
              <Search size={16} color="#8c8c8c" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Titles, people, genres..."
                value={searchVal}
                onChange={handleSearchChange}
                className="search-input"
              />
              {searchVal ? (
                <button type="button" onClick={clearSearch} className="search-clear-btn" aria-label="Clear Search">
                  <X size={15} />
                </button>
              ) : (
                <button type="button" onClick={() => setIsSearchOpen(false)} className="search-clear-btn">
                  <X size={15} />
                </button>
              )}
            </form>
          ) : (
            <button 
              className="nav-icon-btn" 
              onClick={toggleSearch} 
              aria-label="Search"
              title="Search"
            >
              <Search size={20} />
            </button>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="nav-icon-btn"
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell size={20} />
            {unreadNotificationsCount > 0 && (
              <span className="notification-badge">{unreadNotificationsCount}</span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="notification-menu">
              <div className="notification-header">
                <span>Notifications</span>
                {unreadNotificationsCount > 0 && (
                  <button onClick={markAllNotificationsRead}>Mark all read</button>
                )}
              </div>
              <div>
                {notifications.map((item) => (
                  <div 
                    key={item.id} 
                    className={`notification-item ${!item.read ? 'unread' : ''}`}
                    onClick={() => {
                      markAllNotificationsRead();
                      navigate('/new-popular');
                    }}
                  >
                    <img src={item.image} alt={item.title} className="notification-img" />
                    <div>
                      <div className="notification-title">{item.title}</div>
                      <div className="notification-desc">{item.description}</div>
                      <div className="notification-time">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="profile-container">
          <div
            className="profile-trigger"
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
          >
            <img 
              src={currentProfile.avatar} 
              alt={currentProfile.name} 
              className="profile-avatar" 
            />
            <ChevronDown size={14} className="profile-arrow" />
          </div>

          {isProfileOpen && (
            <div className="profile-dropdown">
              <div className="profile-list">
                {profiles.map((p) => (
                  <div
                    key={p.id}
                    className={`profile-list-item ${p.id === currentProfile.id ? 'active' : ''}`}
                    onClick={() => {
                      switchProfile(p);
                      setIsProfileOpen(false);
                    }}
                  >
                    <img src={p.avatar} alt={p.name} />
                    <span>{p.name}</span>
                    {p.id === currentProfile.id && <Check size={14} style={{ marginLeft: 'auto' }} />}
                  </div>
                ))}
              </div>

              <div className="profile-menu-links">
                <div 
                  className="profile-menu-link" 
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/my-list');
                  }}
                >
                  <User size={16} />
                  <span>My Account & List</span>
                </div>
                <div 
                  className="profile-menu-link"
                  onClick={() => {
                    setIsProfileOpen(false);
                    showToast('Settings saved to profile');
                  }}
                >
                  <Settings size={16} />
                  <span>Playback Settings</span>
                </div>
                <div 
                  className="profile-menu-link"
                  onClick={() => {
                    setIsProfileOpen(false);
                    showToast('Help Center: 24/7 Live Support available');
                  }}
                >
                  <HelpCircle size={16} />
                  <span>Help Center</span>
                </div>
              </div>

              <div 
                className="profile-signout"
                onClick={() => {
                  setIsProfileOpen(false);
                  showToast('Guest session: signed in as ' + currentProfile.name);
                }}
              >
                Sign out of NetStream
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
          <NavLink to="/tv-shows" onClick={() => setIsMobileMenuOpen(false)}>TV Shows</NavLink>
          <NavLink to="/movies" onClick={() => setIsMobileMenuOpen(false)}>Movies</NavLink>
          <NavLink to="/new-popular" onClick={() => setIsMobileMenuOpen(false)}>New & Popular</NavLink>
          <NavLink to="/my-list" onClick={() => setIsMobileMenuOpen(false)}>My List</NavLink>
        </div>
      )}
    </nav>
  );
}
