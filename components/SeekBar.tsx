'use client';

import React, { useRef, useState, useCallback } from 'react';
import { formatTime } from '@/utils/formatTime';
import { ABRepeatState } from '@/types/player';

interface SeekBarProps {
  currentTime: number;
  duration: number;
  abRepeat: ABRepeatState;
  onSeek: (time: number) => void;
  onSetPointA?: () => void;
  onSetPointB?: () => void;
}

export const SeekBar: React.FC<SeekBarProps> = ({
  currentTime,
  duration,
  abRepeat,
  onSeek,
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const safeDuration = duration > 0 ? duration : 0;
  const currentPercent = safeDuration > 0 ? (currentTime / safeDuration) * 100 : 0;

  // Calculate A-B marker positions
  const posA =
    abRepeat.pointA !== null && safeDuration > 0
      ? Math.min(100, Math.max(0, (abRepeat.pointA / safeDuration) * 100))
      : null;

  const posB =
    abRepeat.pointB !== null && safeDuration > 0
      ? Math.min(100, Math.max(0, (abRepeat.pointB / safeDuration) * 100))
      : null;

  const loopStart = posA !== null && posB !== null ? Math.min(posA, posB) : posA !== null ? posA : null;
  const loopWidth =
    posA !== null && posB !== null ? Math.abs(posB - posA) : 0;

  const calculateTimeFromEvent = useCallback(
    (e: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent) => {
      if (!progressBarRef.current || safeDuration === 0) return 0;
      const rect = progressBarRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = clickX / rect.width;
      return percentage * safeDuration;
    },
    [safeDuration]
  );

  const handlePointerDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (safeDuration === 0) return;
    setIsDragging(true);
    const newTime = calculateTimeFromEvent(e);
    onSeek(newTime);

    const onPointerMove = (moveEvent: MouseEvent | TouchEvent) => {
      const time = calculateTimeFromEvent(moveEvent);
      onSeek(time);
    };

    const onPointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
    };

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchmove', onPointerMove);
    window.addEventListener('touchend', onPointerUp);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || safeDuration === 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = clickX / rect.width;
    setHoverPosition(percentage * 100);
    setHoverTime(percentage * safeDuration);
  };

  return (
    <div className="w-full select-none">
      {/* Time display headers */}
      <div className="flex justify-between items-center text-xs sm:text-sm font-mono mb-2 text-zinc-400">
        <span className="font-semibold text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-800/40">
          {formatTime(currentTime)}
        </span>
        <span className="text-zinc-500">
          {formatTime(safeDuration)}
        </span>
      </div>

      {/* Progress Bar Container */}
      <div
        ref={progressBarRef}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        className="relative w-full h-8 flex items-center cursor-pointer group touch-none"
        role="slider"
        aria-label="Thanh tiến trình âm thanh"
        aria-valuenow={currentTime}
        aria-valuemin={0}
        aria-valuemax={safeDuration}
      >
        {/* Background Track */}
        <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden relative shadow-inner">
          {/* Highlighted A-B Loop Range */}
          {loopStart !== null && loopWidth > 0 && (
            <div
              className={`absolute top-0 bottom-0 transition-opacity ${
                abRepeat.enabled
                  ? 'bg-amber-400/35 border-x-2 border-amber-400'
                  : 'bg-zinc-600/30 border-x border-zinc-500'
              }`}
              style={{
                left: `${loopStart}%`,
                width: `${loopWidth}%`,
              }}
            />
          )}

          {/* Current Progress Played */}
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-[width] duration-75"
            style={{ width: `${currentPercent}%` }}
          />
        </div>

        {/* Hover preview tooltip */}
        {isHovering && hoverTime !== null && safeDuration > 0 && (
          <div
            className="absolute -top-7 transform -translate-x-1/2 bg-zinc-900 text-zinc-200 text-[11px] font-mono px-2 py-0.5 rounded border border-zinc-700 pointer-events-none shadow-md z-30"
            style={{ left: `${hoverPosition}%` }}
          >
            {formatTime(hoverTime)}
          </div>
        )}

        {/* Current playback thumb */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-lg border-2 border-indigo-600 transition-transform ${
            isDragging || isHovering ? 'scale-125' : 'scale-100'
          }`}
          style={{ left: `${currentPercent}%` }}
        />

        {/* Point A Marker Pin */}
        {posA !== null && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none"
            style={{ left: `${posA}%` }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white shadow text-[9px] font-bold text-white flex items-center justify-center">
              A
            </div>
            <div className="w-0.5 h-3 bg-emerald-500/80" />
          </div>
        )}

        {/* Point B Marker Pin */}
        {posB !== null && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none"
            style={{ left: `${posB}%` }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-white shadow text-[9px] font-bold text-white flex items-center justify-center">
              B
            </div>
            <div className="w-0.5 h-3 bg-amber-500/80" />
          </div>
        )}
      </div>
    </div>
  );
};

