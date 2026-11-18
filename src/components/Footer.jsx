import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

function FacebookIcon(props) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

function TwitterIcon(props) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function YoutubeIcon(props) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export default function Footer() {
  const [serviceCode, setServiceCode] = useState(null);
  const { showToast } = useApp();

  const handleServiceCode = () => {
    if (!serviceCode) {
      const code = Math.floor(100000 + Math.random() * 900000);
      setServiceCode(code);
      showToast(`NetStream Service Code generated: ${code}`);
    } else {
      setServiceCode(null);
    }
  };

  const handleLinkClick = (e, name) => {
    e.preventDefault();
    showToast(`Navigating to ${name} portal`);
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Social Links */}
        <div className="footer-social-links">
          <a href="#facebook" className="footer-social-icon" onClick={(e) => handleLinkClick(e, 'Facebook')} aria-label="Facebook">
            <FacebookIcon />
          </a>
          <a href="#instagram" className="footer-social-icon" onClick={(e) => handleLinkClick(e, 'Instagram')} aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a href="#twitter" className="footer-social-icon" onClick={(e) => handleLinkClick(e, 'Twitter')} aria-label="Twitter / X">
            <TwitterIcon />
          </a>
          <a href="#youtube" className="footer-social-icon" onClick={(e) => handleLinkClick(e, 'YouTube')} aria-label="YouTube">
            <YoutubeIcon />
          </a>
        </div>

        {/* Links Grid */}
        <div className="footer-links-grid">
          <a href="#faq" className="footer-link" onClick={(e) => handleLinkClick(e, 'FAQ')}>FAQ</a>
          <a href="#help" className="footer-link" onClick={(e) => handleLinkClick(e, 'Help Center')}>Help Center</a>
          <a href="#account" className="footer-link" onClick={(e) => handleLinkClick(e, 'Account')}>Account</a>
          <a href="#media" className="footer-link" onClick={(e) => handleLinkClick(e, 'Media Centre')}>Media Centre</a>

          <a href="#investor" className="footer-link" onClick={(e) => handleLinkClick(e, 'Investor Relations')}>Investor Relations</a>
          <a href="#jobs" className="footer-link" onClick={(e) => handleLinkClick(e, 'Jobs')}>Jobs</a>
          <a href="#ways-to-watch" className="footer-link" onClick={(e) => handleLinkClick(e, 'Ways to Watch')}>Ways to Watch</a>
          <a href="#terms" className="footer-link" onClick={(e) => handleLinkClick(e, 'Terms of Use')}>Terms of Use</a>

          <a href="#privacy" className="footer-link" onClick={(e) => handleLinkClick(e, 'Privacy')}>Privacy Policy</a>
          <a href="#cookie" className="footer-link" onClick={(e) => handleLinkClick(e, 'Cookie Preferences')}>Cookie Preferences</a>
          <a href="#corporate" className="footer-link" onClick={(e) => handleLinkClick(e, 'Corporate Info')}>Corporate Information</a>
          <a href="#contact" className="footer-link" onClick={(e) => handleLinkClick(e, 'Contact Us')}>Contact Us</a>
        </div>

        {/* Interactive Service Code Button */}
        <div>
          <button className="footer-service-btn" onClick={handleServiceCode}>
            {serviceCode ? `Service Code: ${serviceCode}` : 'Service Code'}
          </button>
        </div>

        {/* Copyright notice */}
        <div className="footer-copyright">
          © {new Date().getFullYear()} NETSTREAM, Inc. Built with React.js & Vite for cinematic entertainment. All trademarks and media belong to their respective owners.
        </div>
      </div>
    </footer>
  );
}
