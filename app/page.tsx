'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Track, ABRepeatState, Bookmark } from '@/types/player';
import { Header } from '@/components/Header';
import { SeekBar } from '@/components/SeekBar';
import { PlayerControls } from '@/components/PlayerControls';
import { ABRepeatPanel } from '@/components/ABRepeatPanel';
import { PlaylistPanel } from '@/components/PlaylistPanel';
import { BookmarksList } from '@/components/BookmarksList';
import { ShortcutsModal } from '@/components/ShortcutsModal';
import { generateSampleAudio } from '@/utils/sampleAudio';
import { formatTime } from '@/utils/formatTime';
import { Music, CheckCircle2, AlertCircle, Headphones, Volume2 } from 'lucide-react';

export default function EnglishPlayerPage() {
  // Audio element ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Playback state
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // A-B Repeat state
  const [abRepeat, setAbRepeat] = useState<ABRepeatState>({
    enabled: false,
    pointA: null,
    pointB: null,
  });
  const [loopCount, setLoopCount] = useState<number>(0);

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Modals & Toasts
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' } | null>(null);

  const currentTrack = currentTrackIndex >= 0 && currentTrackIndex < playlist.length
    ? playlist[currentTrackIndex]
    : null;

  // Show transient toast
  const showToast = useCallback((text: string, type: 'success' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup object URLs when playlist changes or unmounts
  useEffect(() => {
    return () => {
      playlist.forEach((track) => {
        if (track.url.startsWith('blob:')) {
          URL.revokeObjectURL(track.url);
        }
      });
    };
  }, []);

  // Sync playback rate with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, currentTrackIndex]);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Play or Pause audio
  const handlePlayPause = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.warn('Playback error:', err);
      });
    }
  }, [isPlaying, currentTrack]);

  // Seek delta (e.g. +5s, -5s)
  const handleSeekDelta = useCallback((delta: number) => {
    if (!audioRef.current || duration <= 0) return;
    const newTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + delta));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration]);

  // Seek directly to a timestamp
  const handleSeek = useCallback((newTime: number) => {
    if (!audioRef.current) return;
    const clamped = Math.max(0, Math.min(duration, newTime));
    audioRef.current.currentTime = clamped;
    setCurrentTime(clamped);
  }, [duration]);

  // Switch to specific track
  const handleSelectTrack = useCallback((track: Track) => {
    const idx = playlist.findIndex((t) => t.id === track.id);
    if (idx !== -1) {
      setCurrentTrackIndex(idx);
      setAbRepeat({ enabled: false, pointA: null, pointB: null });
      setLoopCount(0);
      setIsPlaying(true);
    }
  }, [playlist]);

  // Previous Track
  const handlePreviousTrack = useCallback(() => {
    if (playlist.length === 0) return;
    const prevIdx = currentTrackIndex > 0 ? currentTrackIndex - 1 : playlist.length - 1;
    setCurrentTrackIndex(prevIdx);
    setAbRepeat({ enabled: false, pointA: null, pointB: null });
    setLoopCount(0);
  }, [playlist.length, currentTrackIndex]);

  // Next Track
  const handleNextTrack = useCallback(() => {
    if (playlist.length === 0) return;
    const nextIdx = currentTrackIndex < playlist.length - 1 ? currentTrackIndex + 1 : 0;
    setCurrentTrackIndex(nextIdx);
    setAbRepeat({ enabled: false, pointA: null, pointB: null });
    setLoopCount(0);
  }, [playlist.length, currentTrackIndex]);

  // A-B Repeat: Set Point A
  const handleSetPointA = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;
    const curr = audioRef.current.currentTime;

    setAbRepeat((prev) => {
      // If pointB exists and is before or equal to new A, reset B
      let newB = prev.pointB;
      if (newB !== null && newB <= curr) {
        newB = null;
      }
      return {
        ...prev,
        pointA: curr,
        pointB: newB,
        enabled: newB !== null ? prev.enabled : false,
      };
    });
    setLoopCount(0);
    showToast(`Đã đặt Điểm A: ${formatTime(curr, true)}`);
  }, [currentTrack, showToast]);

  // A-B Repeat: Set Point B
  const handleSetPointB = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;
    const curr = audioRef.current.currentTime;

    if (abRepeat.pointA !== null && curr <= abRepeat.pointA) {
      showToast('Điểm B phải nằm sau điểm A!', 'warning');
      return;
    }

    setAbRepeat((prev) => ({
      ...prev,
      pointB: curr,
      enabled: prev.pointA !== null ? true : prev.enabled,
    }));
    setLoopCount(0);
    showToast(`Đã đặt Điểm B: ${formatTime(curr, true)} (Bật lặp A-B)`);
  }, [currentTrack, abRepeat.pointA, showToast]);

  // Adjust Point A
  const handleAdjustPointA = useCallback((delta: number) => {
    setAbRepeat((prev) => {
      if (prev.pointA === null) return prev;
      const newA = Math.max(0, prev.pointA + delta);
      if (prev.pointB !== null && newA >= prev.pointB) {
        return prev;
      }
      return { ...prev, pointA: newA };
    });
  }, []);

  // Adjust Point B
  const handleAdjustPointB = useCallback((delta: number) => {
    setAbRepeat((prev) => {
      if (prev.pointB === null) return prev;
      const newB = Math.min(duration, prev.pointB + delta);
      if (prev.pointA !== null && newB <= prev.pointA) {
        return prev;
      }
      return { ...prev, pointB: newB };
    });
  }, [duration]);

  // Toggle A-B Repeat
  const handleToggleRepeat = useCallback(() => {
    if (abRepeat.pointA === null || abRepeat.pointB === null) {
      showToast('Cần đặt cả mốc A và mốc B trước khi bật lặp!', 'warning');
      return;
    }
    setAbRepeat((prev) => {
      const willEnable = !prev.enabled;
      if (willEnable && audioRef.current && prev.pointA !== null) {
        // When enabling, jump directly to A to start repeating
        audioRef.current.currentTime = prev.pointA;
        audioRef.current.play().catch(() => {});
      }
      return { ...prev, enabled: willEnable };
    });
    setLoopCount(0);
  }, [abRepeat.pointA, abRepeat.pointB, showToast]);

  // Reset A-B Repeat
  const handleResetRepeat = useCallback(() => {
    setAbRepeat({
      enabled: false,
      pointA: null,
      pointB: null,
    });
    setLoopCount(0);
    showToast('Đã xóa mốc A-B');
  }, [showToast]);

  // Jump to Point A
  const handleJumpToA = useCallback(() => {
    if (abRepeat.pointA !== null && audioRef.current) {
      audioRef.current.currentTime = abRepeat.pointA;
      setCurrentTime(abRepeat.pointA);
      if (audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [abRepeat.pointA]);

  // Jump to Point B
  const handleJumpToB = useCallback(() => {
    if (abRepeat.pointB !== null && audioRef.current) {
      audioRef.current.currentTime = abRepeat.pointB;
      setCurrentTime(abRepeat.pointB);
    }
  }, [abRepeat.pointB]);

  // Save Bookmark
  const handleSaveBookmark = useCallback(() => {
    if (!currentTrack || abRepeat.pointA === null || abRepeat.pointB === null) return;
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      trackId: currentTrack.id,
      trackName: currentTrack.name,
      pointA: abRepeat.pointA,
      pointB: abRepeat.pointB,
      note: `Đoạn ${formatTime(abRepeat.pointA)} - ${formatTime(abRepeat.pointB)}`,
      createdAt: Date.now(),
    };
    setBookmarks((prev) => [newBookmark, ...prev]);
    showToast('Đã lưu mốc câu vào danh sách ôn tập!');
  }, [currentTrack, abRepeat.pointA, abRepeat.pointB, showToast]);

  // Select Bookmark
  const handleSelectBookmark = useCallback((b: Bookmark) => {
    // If bookmark is for another track, select it
    const trackIndex = playlist.findIndex((t) => t.id === b.trackId);
    if (trackIndex !== -1 && trackIndex !== currentTrackIndex) {
      setCurrentTrackIndex(trackIndex);
    }
    setAbRepeat({
      enabled: true,
      pointA: b.pointA,
      pointB: b.pointB,
    });
    setLoopCount(0);
    if (audioRef.current) {
      audioRef.current.currentTime = b.pointA;
      audioRef.current.play().catch(() => {});
    }
    showToast(`Đã nạp mốc câu: ${formatTime(b.pointA)} - ${formatTime(b.pointB)}`);
  }, [playlist, currentTrackIndex, showToast]);

  // Delete Bookmark
  const handleDeleteBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  // Clear Bookmarks
  const handleClearBookmarks = useCallback(() => {
    setBookmarks([]);
  }, []);

  // Upload Files (Multiple)
  const handleFilesSelected = useCallback((files: FileList | File[]) => {
    const newTracks: Track[] = [];
    const fileArray = Array.from(files);

    fileArray.forEach((file) => {
      // Accept audio files
      const url = URL.createObjectURL(file);
      const track: Track = {
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        name: file.name.replace(/\.[^/.]+$/, ''), // Clean file name without extension
        url,
        size: file.size,
        duration: 0,
        type: file.type || 'audio/mpeg',
      };

      // Probe duration
      const tempAudio = new Audio();
      tempAudio.src = url;
      tempAudio.addEventListener('loadedmetadata', () => {
        setPlaylist((prevList) =>
          prevList.map((t) => (t.id === track.id ? { ...t, duration: tempAudio.duration } : t))
        );
      });

      newTracks.push(track);
    });

    if (newTracks.length > 0) {
      setPlaylist((prev) => {
        const updated = [...prev, ...newTracks];
        // If nothing was selected, select the first new track
        if (currentTrackIndex === -1) {
          setCurrentTrackIndex(prev.length);
        }
        return updated;
      });
      showToast(`Đã thêm ${newTracks.length} file vào danh sách!`);
    }
  }, [currentTrackIndex, showToast]);

  // Remove single track
  const handleRemoveTrack = useCallback((id: string) => {
    setPlaylist((prev) => {
      const idxToRemove = prev.findIndex((t) => t.id === id);
      if (idxToRemove === -1) return prev;

      const trackToRemove = prev[idxToRemove];
      if (trackToRemove.url.startsWith('blob:')) {
        URL.revokeObjectURL(trackToRemove.url);
      }

      const updated = prev.filter((t) => t.id !== id);

      // Adjust current index
      if (idxToRemove === currentTrackIndex) {
        if (updated.length === 0) {
          setCurrentTrackIndex(-1);
          setIsPlaying(false);
          setAbRepeat({ enabled: false, pointA: null, pointB: null });
        } else if (currentTrackIndex >= updated.length) {
          setCurrentTrackIndex(updated.length - 1);
        }
      } else if (idxToRemove < currentTrackIndex) {
        setCurrentTrackIndex((prevIdx) => prevIdx - 1);
      }

      return updated;
    });
  }, [currentTrackIndex]);

  // Clear Playlist
  const handleClearPlaylist = useCallback(() => {
    playlist.forEach((track) => {
      if (track.url.startsWith('blob:')) {
        URL.revokeObjectURL(track.url);
      }
    });
    setPlaylist([]);
    setCurrentTrackIndex(-1);
    setIsPlaying(false);
    setAbRepeat({ enabled: false, pointA: null, pointB: null });
    setLoopCount(0);
    showToast('Đã làm trống danh sách bài học');
  }, [playlist, showToast]);

  // Load Built-in Educational Sample Lesson
  const handleLoadSample = useCallback(() => {
    const sample = generateSampleAudio();
    const sampleTrack: Track = {
      id: `sample-lesson-${Date.now()}`,
      name: 'Lesson 1: Everyday Dialogue (A-B Repeat Sample)',
      url: sample.url,
      size: sample.blob.size,
      duration: sample.duration,
      type: 'audio/wav',
      isSample: true,
    };

    setPlaylist((prev) => [sampleTrack, ...prev]);
    setCurrentTrackIndex(0);
    // Pre-populate point A and B for testing convenience (e.g. phrase 1: 0s - 4s)
    setAbRepeat({
      enabled: true,
      pointA: 0.2,
      pointB: 4.0,
    });
    setLoopCount(0);
    setIsPlaying(true);
    showToast('Đã nạp bài mẫu! Tự động đặt đoạn lặp 0.2s - 4.0s để thử.');
  }, [showToast]);

  // Audio TimeUpdate handler: Core A-B Repeat engine
  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const curr = audio.currentTime;
    setCurrentTime(curr);

    // Precise A-B Loop Logic
    if (abRepeat.enabled && abRepeat.pointA !== null && abRepeat.pointB !== null) {
      if (curr >= abRepeat.pointB) {
        audio.currentTime = abRepeat.pointA;
        setLoopCount((prev) => prev + 1);
        if (audio.paused) {
          audio.play().catch(() => {});
        }
      }
    }
  }, [abRepeat]);

  // Audio Ended handler
  const handleAudioEnded = useCallback(() => {
    if (abRepeat.enabled && abRepeat.pointA !== null) {
      if (audioRef.current) {
        audioRef.current.currentTime = abRepeat.pointA;
        audioRef.current.play().catch(() => {});
        setLoopCount((prev) => prev + 1);
      }
      return;
    }

    // Auto next track
    if (currentTrackIndex < playlist.length - 1) {
      handleNextTrack();
    } else {
      setIsPlaying(false);
    }
  }, [abRepeat, currentTrackIndex, playlist.length, handleNextTrack]);

  // MediaSession API Integration (Background Play & Lock Screen Controls)
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentTrack) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.name,
        artist: 'English Shadowing Player',
        album: 'Luyện Nghe A-B Repeat',
        artwork: [
          {
            src: '/icon.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: '/apple-icon.png',
            sizes: '180x180',
            type: 'image/png',
          },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => {
        audioRef.current?.play().catch(() => {});
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        audioRef.current?.pause();
      });

      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        handleSeekDelta(-(details.seekOffset || 5));
      });

      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        handleSeekDelta(details.seekOffset || 5);
      });

      navigator.mediaSession.setActionHandler('previoustrack', () => {
        handlePreviousTrack();
      });

      navigator.mediaSession.setActionHandler('nexttrack', () => {
        handleNextTrack();
      });

      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined && details.seekTime !== null) {
          handleSeek(details.seekTime);
        }
      });
    } catch (e) {
      console.warn('MediaSession configuration error:', e);
    }

    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('seekbackward', null);
        navigator.mediaSession.setActionHandler('seekforward', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
        navigator.mediaSession.setActionHandler('seekto', null);
      }
    };
  }, [currentTrack, handleSeekDelta, handlePreviousTrack, handleNextTrack, handleSeek]);

  // Update MediaSession state
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

      if ('setPositionState' in navigator.mediaSession && duration > 0) {
        navigator.mediaSession.setPositionState({
          duration: Math.max(duration, 0),
          playbackRate: playbackRate,
          position: Math.min(Math.max(currentTime, 0), duration),
        });
      }
    } catch {
      // Ignore unsupported or out-of-sync state calls
    }
  }, [isPlaying, currentTime, duration, playbackRate]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleSeekDelta(-5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSeekDelta(5);
          break;
        case 'KeyA':
          e.preventDefault();
          handleSetPointA();
          break;
        case 'KeyB':
          e.preventDefault();
          handleSetPointB();
          break;
        case 'KeyL':
          e.preventDefault();
          handleToggleRepeat();
          break;
        case 'KeyR':
          e.preventDefault();
          handleResetRepeat();
          break;
        case 'BracketLeft':
          e.preventDefault();
          handleJumpToA();
          break;
        case 'BracketRight':
          e.preventDefault();
          handleJumpToB();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume((v) => Math.min(1, parseFloat((v + 0.1).toFixed(1))));
          setIsMuted(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume((v) => Math.max(0, parseFloat((v - 0.1).toFixed(1))));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handlePlayPause,
    handleSeekDelta,
    handleSetPointA,
    handleSetPointB,
    handleToggleRepeat,
    handleResetRepeat,
    handleJumpToA,
    handleJumpToB,
  ]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack ? currentTrack.url : undefined}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={(e) => setDuration(e.currentTarget.duration || 0)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration || 0);
          if (audioRef.current) {
            audioRef.current.playbackRate = playbackRate;
            audioRef.current.volume = isMuted ? 0 : volume;
          }
          if (isPlaying) {
            audioRef.current?.play().catch(() => {});
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleAudioEnded}
        preload="auto"
      />

      {/* Main Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Header */}
        <Header
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onLoadSample={handleLoadSample}
        />

        {/* Layout: Main Player (Left) + Playlist & Bookmarks (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Player & A-B Control (7 cols on Desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Active Track Hero Display */}
            <div className="bg-gradient-to-b from-zinc-900 to-zinc-900/90 border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
              {/* Subtle Ambient Glow */}
              <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative flex flex-col gap-5">
                {/* Track Status Badge & Waveform Animation */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      {isPlaying && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      )}
                      <span
                        className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                          isPlaying ? 'bg-emerald-500' : 'bg-zinc-600'
                        }`}
                      />
                    </span>
                    <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                      {currentTrack ? (isPlaying ? 'Đang phát' : 'Tạm dừng') : 'Sẵn sàng'}
                    </span>
                  </div>

                  {/* Animated Waveform Visualization */}
                  <div className="flex items-center gap-1 h-5 px-3 py-1 rounded-full bg-zinc-950/60 border border-zinc-800/80">
                    <Headphones className="w-3.5 h-3.5 text-indigo-400 mr-1" />
                    {[40, 70, 100, 60, 30, 85, 50, 90, 45, 65].map((h, i) => (
                      <span
                        key={i}
                        className={`w-0.5 rounded-full bg-indigo-400 transition-all ${
                          isPlaying ? 'animate-pulse' : 'opacity-30'
                        }`}
                        style={{
                          height: isPlaying ? `${h}%` : '20%',
                          animationDuration: `${0.4 + (i % 5) * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Track Title */}
                <div className="min-h-[50px] flex flex-col justify-center">
                  {currentTrack ? (
                    <div>
                      <h2
                        className="text-lg sm:text-2xl font-bold text-white tracking-tight line-clamp-2"
                        title={currentTrack.name}
                      >
                        {currentTrack.name}
                      </h2>
                      <p className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
                        <span>Định dạng: {currentTrack.type.split('/')[1]?.toUpperCase() || 'AUDIO'}</span>
                        <span>•</span>
                        <span>Thời lượng: {formatTime(duration)}</span>
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-zinc-400">
                        Chưa chọn bài nghe
                      </h2>
                      <p className="text-xs text-zinc-500 mt-1">
                        Hãy chọn một file MP3 từ danh sách hoặc bấm nút <strong>Bài mẫu</strong> để bắt đầu học.
                      </p>
                    </div>
                  )}
                </div>

                {/* Seek Bar with A-B Marker Overlays */}
                <SeekBar
                  currentTime={currentTime}
                  duration={duration}
                  abRepeat={abRepeat}
                  onSeek={handleSeek}
                  onSetPointA={handleSetPointA}
                  onSetPointB={handleSetPointB}
                />

                {/* Player Controls (Play/Pause, ±5s, Speeds, Volume) */}
                <PlayerControls
                  isPlaying={isPlaying}
                  playbackRate={playbackRate}
                  volume={volume}
                  isMuted={isMuted}
                  hasTrack={!!currentTrack}
                  onPlayPause={handlePlayPause}
                  onSeekDelta={handleSeekDelta}
                  onPreviousTrack={handlePreviousTrack}
                  onNextTrack={handleNextTrack}
                  onChangePlaybackRate={setPlaybackRate}
                  onChangeVolume={(v) => {
                    setVolume(v);
                    setIsMuted(false);
                  }}
                  onToggleMute={() => setIsMuted((prev) => !prev)}
                />
              </div>
            </div>

            {/* A-B Repeat Dedicated Control Card */}
            <ABRepeatPanel
              abRepeat={abRepeat}
              currentTime={currentTime}
              duration={duration}
              loopCount={loopCount}
              onSetPointA={handleSetPointA}
              onSetPointB={handleSetPointB}
              onAdjustPointA={handleAdjustPointA}
              onAdjustPointB={handleAdjustPointB}
              onToggleRepeat={handleToggleRepeat}
              onResetRepeat={handleResetRepeat}
              onJumpToA={handleJumpToA}
              onJumpToB={handleJumpToB}
              onSaveBookmark={handleSaveBookmark}
            />
          </div>

          {/* Right Column: Playlist, Bookmarks & Quick Guide (5 cols on Desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Playlist Panel */}
            <PlaylistPanel
              playlist={playlist}
              currentTrackId={currentTrack?.id || null}
              isPlaying={isPlaying}
              onSelectTrack={handleSelectTrack}
              onRemoveTrack={handleRemoveTrack}
              onClearPlaylist={handleClearPlaylist}
              onFilesSelected={handleFilesSelected}
              onLoadSample={handleLoadSample}
            />

            {/* Bookmarks / Saved Sentences List */}
            <BookmarksList
              bookmarks={bookmarks}
              onSelectBookmark={handleSelectBookmark}
              onDeleteBookmark={handleDeleteBookmark}
              onClearBookmarks={handleClearBookmarks}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t border-zinc-900 text-center text-xs text-zinc-500">
          <p>
            English Shadowing Player - By{' '}
            <a
              href="https://www.facebook.com/sonthaii999/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-2 transition-colors"
            >
              ThaiNS683
            </a>
          </p>
        </footer>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none">
          <div
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-2xl text-xs sm:text-sm font-medium border ${
              toastMessage.type === 'warning'
                ? 'bg-amber-950/90 text-amber-200 border-amber-700/60 shadow-amber-950/50'
                : 'bg-zinc-900/95 text-zinc-100 border-zinc-700 shadow-black/60'
            }`}
          >
            {toastMessage.type === 'warning' ? (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Shortcuts & Guide Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
