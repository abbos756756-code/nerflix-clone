import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  RotateCw, 
  Settings, 
  Check 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function VideoPlayer({ movie }) {
  const { closePlayer, showToast } = useApp();
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(120); // fallback 2 mins
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('1080p (Auto)');

  // Autoplay and keydown listeners
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        closePlayer();
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'f') {
        toggleFullscreen();
      } else if (e.key === 'm') {
        toggleMute();
      } else if (e.key === 'ArrowRight') {
        seekRelative(10);
      } else if (e.key === 'ArrowLeft') {
        seekRelative(-10);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [closePlayer]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSettings(false);
      }
    }, 3500);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 120);
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newRatio = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = newRatio * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const seekRelative = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    if (!newMuted && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    showToast(`Playback speed: ${speed}x`);
    setShowSettings(false);
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className="video-player-overlay" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <video
        ref={videoRef}
        src={movie.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
        className="video-element"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
        autoPlay
        playsInline
      />

      {/* Floating Controls Overlay */}
      <div className={`player-controls-layer ${!showControls ? 'hidden' : ''}`}>
        {/* Top Header */}
        <div className="player-top-bar">
          <div className="player-back-btn" onClick={closePlayer} title="Back to NetStream">
            <ArrowLeft size={28} />
            <span className="player-movie-title">{movie.title}</span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <span className="badge-quality">HD 1080p</span>
          </div>
        </div>

        {/* Big Center Play / Pause Icon Trigger */}
        <div className="player-middle-center">
          <button 
            className="player-center-btn" 
            onClick={() => seekRelative(-10)}
            title="Rewind 10 seconds"
          >
            <RotateCcw size={28} />
          </button>

          <button 
            className="player-center-btn" 
            onClick={togglePlay}
            style={{ width: 80, height: 80 }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={38} /> : <Play fill="#fff" size={38} />}
          </button>

          <button 
            className="player-center-btn" 
            onClick={() => seekRelative(10)}
            title="Forward 10 seconds"
          >
            <RotateCw size={28} />
          </button>
        </div>

        {/* Bottom Control Bar */}
        <div className="player-bottom-controls">
          {/* Scrubber Progress Bar */}
          <div className="player-scrubber-container">
            <div className="player-scrubber" onClick={handleSeek}>
              <div 
                className="player-scrubber-progress" 
                style={{ width: `${progressPercent}%` }}
              >
                <div className="player-scrubber-thumb" />
              </div>
            </div>
            <div className="player-time-display">
              {formatTime(duration - currentTime)}
            </div>
          </div>

          {/* Action Row */}
          <div className="player-action-row">
            <div className="player-actions-left">
              <button 
                className="player-icon-btn" 
                onClick={togglePlay} 
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              >
                {isPlaying ? <Pause size={24} /> : <Play fill="#fff" size={24} />}
              </button>

              <button 
                className="player-icon-btn" 
                onClick={() => seekRelative(-10)}
                title="Rewind 10s"
              >
                <RotateCcw size={22} />
              </button>

              <button 
                className="player-icon-btn" 
                onClick={() => seekRelative(10)}
                title="Forward 10s"
              >
                <RotateCw size={22} />
              </button>

              <div className="volume-slider-wrapper">
                <button 
                  className="player-icon-btn" 
                  onClick={toggleMute}
                  title={isMuted ? 'Unmute (m)' : 'Mute (m)'}
                >
                  {isMuted || volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                  title="Volume"
                />
              </div>

              <div style={{ color: '#aaa', fontSize: '0.85rem', marginLeft: 8 }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="player-actions-right">
              {/* Settings Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  className="player-icon-btn"
                  onClick={() => setShowSettings(!showSettings)}
                  title="Playback Settings"
                >
                  <Settings size={22} />
                </button>

                {showSettings && (
                  <div 
                    style={{
                      position: 'absolute',
                      bottom: 45,
                      right: 0,
                      width: 200,
                      backgroundColor: 'rgba(20,20,20,0.96)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 6,
                      padding: '12px 14px',
                      zIndex: 50,
                      boxShadow: '0 8px 30px rgba(0,0,0,0.9)'
                    }}
                  >
                    <div style={{ fontSize: '0.78rem', color: '#999', marginBottom: 6, fontWeight: 700 }}>
                      SPEED
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                      {[0.75, 1, 1.25, 1.5].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSpeedChange(s)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontSize: '0.75rem',
                            backgroundColor: playbackSpeed === s ? '#e50914' : '#333',
                            color: '#fff',
                            fontWeight: 600
                          }}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#999', marginBottom: 6, fontWeight: 700 }}>
                      QUALITY
                    </div>
                    {['1080p (Auto)', '720p HD', '480p SD'].map((q) => (
                      <div
                        key={q}
                        onClick={() => {
                          setQuality(q);
                          showToast(`Quality set to ${q}`);
                          setShowSettings(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '4px 0',
                          fontSize: '0.82rem',
                          color: quality === q ? '#e50914' : '#eee',
                          cursor: 'pointer'
                        }}
                      >
                        <span>{q}</span>
                        {quality === q && <Check size={14} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button 
                className="player-icon-btn" 
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Exit Fullscreen (f)' : 'Fullscreen (f)'}
              >
                {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
