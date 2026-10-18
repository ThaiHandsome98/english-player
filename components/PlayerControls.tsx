'use client';

import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Gauge,
} from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  hasTrack: boolean;
  onPlayPause: () => void;
  onSeekDelta: (seconds: number) => void;
  onPreviousTrack: () => void;
  onNextTrack: () => void;
  onChangePlaybackRate: (rate: number) => void;
  onChangeVolume: (volume: number) => void;
  onToggleMute: () => void;
}

const PLAYBACK_RATES = [0.5, 0.75, 0.9, 1.0, 1.25, 1.5, 1.75, 2.0];

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  playbackRate,
  volume,
  isMuted,
  hasTrack,
  onPlayPause,
  onSeekDelta,
  onPreviousTrack,
  onNextTrack,
  onChangePlaybackRate,
  onChangeVolume,
  onToggleMute,
}) => {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Primary Transport Controls */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 select-none">
        {/* Previous Track */}
        <button
          onClick={onPreviousTrack}
          disabled={!hasTrack}
          aria-label="Bài trước đó"
          className="p-2 sm:p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition active:scale-95 touch-manipulation"
          title="Bài trước đó"
        >
          <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Rewind 5s */}
        <button
          onClick={() => onSeekDelta(-5)}
          disabled={!hasTrack}
          aria-label="Lùi lại 5 giây"
          className="relative p-2.5 sm:p-3 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 active:scale-90 transition disabled:opacity-30 disabled:pointer-events-none touch-manipulation group"
          title="Lùi 5 giây (←)"
        >
          <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-rotate-45 transition-transform" />
          <span className="absolute bottom-1 text-[9px] font-bold font-mono">5</span>
        </button>

        {/* Master Play / Pause Button */}
        <button
          onClick={onPlayPause}
          disabled={!hasTrack}
          aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none touch-manipulation"
          title={isPlaying ? 'Tạm dừng (Phím Space)' : 'Phát (Phím Space)'}
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
          ) : (
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
          )}
        </button>

        {/* Forward 5s */}
        <button
          onClick={() => onSeekDelta(5)}
          disabled={!hasTrack}
          aria-label="Tua tới 5 giây"
          className="relative p-2.5 sm:p-3 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 active:scale-90 transition disabled:opacity-30 disabled:pointer-events-none touch-manipulation group"
          title="Tua tới 5 giây (→)"
        >
          <RotateCw className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-45 transition-transform" />
          <span className="absolute bottom-1 text-[9px] font-bold font-mono">5</span>
        </button>

        {/* Next Track */}
        <button
          onClick={onNextTrack}
          disabled={!hasTrack}
          aria-label="Bài kế tiếp"
          className="p-2 sm:p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition active:scale-95 touch-manipulation"
          title="Bài kế tiếp"
        >
          <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Speed Rate & Volume Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800/80">
        {/* Playback speed selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
          <div className="flex items-center gap-1 text-xs text-zinc-400 mr-1 shrink-0">
            <Gauge className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Tốc độ:</span>
          </div>

          <div className="flex items-center gap-1 bg-zinc-950/60 p-1 rounded-xl border border-zinc-800 shrink-0">
            {PLAYBACK_RATES.map((rate) => (
              <button
                key={rate}
                onClick={() => onChangePlaybackRate(rate)}
                disabled={!hasTrack}
                className={`px-2 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  playbackRate === rate
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Volume & Mute */}
        <div className="flex items-center gap-2 self-center sm:self-auto w-full sm:w-auto justify-end">
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            title={isMuted ? 'Bật âm' : 'Tắt tiếng'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
            className="w-20 sm:w-24 h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            aria-label="Âm lượng"
          />

          <span className="text-[11px] font-mono text-zinc-400 w-8 text-right">
            {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
          </span>
        </div>
      </div>
    </div>
  );
};

