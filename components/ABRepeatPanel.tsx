'use client';

import React from 'react';
import { ABRepeatState } from '@/types/player';
import { formatTime } from '@/utils/formatTime';
import {
  Repeat,
  RotateCcw,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  BookmarkPlus,
  Compass,
} from 'lucide-react';

interface ABRepeatPanelProps {
  abRepeat: ABRepeatState;
  currentTime: number;
  duration: number;
  loopCount: number;
  onSetPointA: () => void;
  onSetPointB: () => void;
  onAdjustPointA: (delta: number) => void;
  onAdjustPointB: (delta: number) => void;
  onToggleRepeat: () => void;
  onResetRepeat: () => void;
  onJumpToA: () => void;
  onJumpToB: () => void;
  onSaveBookmark?: () => void;
}

export const ABRepeatPanel: React.FC<ABRepeatPanelProps> = ({
  abRepeat,
  loopCount,
  onSetPointA,
  onSetPointB,
  onAdjustPointA,
  onAdjustPointB,
  onToggleRepeat,
  onResetRepeat,
  onJumpToA,
  onJumpToB,
  onSaveBookmark,
}) => {
  const isReady = abRepeat.pointA !== null && abRepeat.pointB !== null;
  const loopDuration =
    isReady && abRepeat.pointB !== null && abRepeat.pointA !== null
      ? Math.max(0, abRepeat.pointB - abRepeat.pointA)
      : null;

  return (
    <div className="bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-zinc-800 p-4 sm:p-5 shadow-xl transition-all">
      {/* Header & Status Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
              abRepeat.enabled
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 animate-pulse'
                : 'bg-zinc-800 text-zinc-300'
            }`}
          >
            A⇄B
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
              Chế độ lặp đoạn A-B Repeat
              {abRepeat.enabled && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Đang lặp
                </span>
              )}
            </h3>
            <p className="text-xs text-zinc-400">
              Lặp từng câu để luyện Shadowing & Chép chính tả
            </p>
          </div>
        </div>

        {/* Loop counter & Reset */}
        <div className="flex items-center gap-2">
          {abRepeat.enabled && (
            <div className="px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-mono text-amber-300 flex items-center gap-1">
              <Repeat className="w-3.5 h-3.5" />
              <span>Đã lặp: <strong>{loopCount}</strong> lần</span>
            </div>
          )}

          {(abRepeat.pointA !== null || abRepeat.pointB !== null) && (
            <button
              onClick={onResetRepeat}
              title="Xóa mốc A-B (Phím R)"
              className="text-xs text-zinc-400 hover:text-red-400 px-2.5 py-1 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 transition flex items-center gap-1 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa mốc</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Interval Display */}
      <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3 mb-4">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
          <span>Khoảng thời gian lặp:</span>
          {loopDuration !== null && (
            <span className="text-amber-400 font-mono font-medium">
              Độ dài: {loopDuration.toFixed(1)}s
            </span>
          )}
        </div>
        <div className="flex items-center justify-center gap-3 py-1">
          {/* Point A badge */}
          <div className="flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-700/50 px-3 py-1.5 rounded-lg">
            <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow">
              A
            </span>
            <span className="font-mono text-sm sm:text-base font-semibold text-emerald-400">
              {formatTime(abRepeat.pointA, true)}
            </span>
          </div>

          <ArrowRight className="w-4 h-4 text-zinc-500" />

          {/* Point B badge */}
          <div className="flex items-center gap-1.5 bg-amber-950/40 border border-amber-700/50 px-3 py-1.5 rounded-lg">
            <span className="w-5 h-5 rounded-md bg-amber-500 text-black font-bold text-xs flex items-center justify-center shadow">
              B
            </span>
            <span className="font-mono text-sm sm:text-base font-semibold text-amber-400">
              {formatTime(abRepeat.pointB, true)}
            </span>
          </div>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Point A Setting & Micro-adjustment */}
        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Điểm A (Bắt đầu câu)
            </span>
            {abRepeat.pointA !== null && (
              <button
                onClick={onJumpToA}
                className="text-[11px] text-zinc-400 hover:text-emerald-300 underline underline-offset-2 flex items-center gap-0.5"
                title="Tua đến mốc A"
              >
                <Compass className="w-3 h-3" />
                Tua về A
              </button>
            )}
          </div>

          {/* Set A button */}
          <button
            onClick={onSetPointA}
            className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-md shadow-emerald-900/30 touch-manipulation"
          >
            <span>Đặt mốc A</span>
            <span className="text-[11px] opacity-80 font-mono">(Phím A)</span>
          </button>

          {/* Micro-adjust A */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[11px] text-zinc-400">Căn chỉnh A:</span>
            <div className="flex gap-1.5">
              <button
                disabled={abRepeat.pointA === null}
                onClick={() => onAdjustPointA(-0.5)}
                className="px-2 py-1 rounded bg-zinc-700/60 hover:bg-zinc-700 text-xs font-mono text-zinc-300 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition flex items-center gap-0.5"
                title="Giảm 0.5s"
              >
                <Minus className="w-3 h-3" />
                0.5s
              </button>
              <button
                disabled={abRepeat.pointA === null}
                onClick={() => onAdjustPointA(0.5)}
                className="px-2 py-1 rounded bg-zinc-700/60 hover:bg-zinc-700 text-xs font-mono text-zinc-300 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition flex items-center gap-0.5"
                title="Tăng 0.5s"
              >
                <Plus className="w-3 h-3" />
                0.5s
              </button>
            </div>
          </div>
        </div>

        {/* Point B Setting & Micro-adjustment */}
        <div className="bg-zinc-800/50 border border-zinc-800 rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Điểm B (Kết thúc câu)
            </span>
            {abRepeat.pointB !== null && (
              <button
                onClick={onJumpToB}
                className="text-[11px] text-zinc-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-0.5"
                title="Tua đến mốc B"
              >
                <Compass className="w-3 h-3" />
                Tua tới B
              </button>
            )}
          </div>

          {/* Set B button */}
          <button
            onClick={onSetPointB}
            className="w-full py-2.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 active:scale-[0.98] text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-md shadow-amber-900/30 touch-manipulation"
          >
            <span>Đặt mốc B</span>
            <span className="text-[11px] opacity-80 font-mono">(Phím B)</span>
          </button>

          {/* Micro-adjust B */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[11px] text-zinc-400">Căn chỉnh B:</span>
            <div className="flex gap-1.5">
              <button
                disabled={abRepeat.pointB === null}
                onClick={() => onAdjustPointB(-0.5)}
                className="px-2 py-1 rounded bg-zinc-700/60 hover:bg-zinc-700 text-xs font-mono text-zinc-300 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition flex items-center gap-0.5"
                title="Giảm 0.5s"
              >
                <Minus className="w-3 h-3" />
                0.5s
              </button>
              <button
                disabled={abRepeat.pointB === null}
                onClick={() => onAdjustPointB(0.5)}
                className="px-2 py-1 rounded bg-zinc-700/60 hover:bg-zinc-700 text-xs font-mono text-zinc-300 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition flex items-center gap-0.5"
                title="Tăng 0.5s"
              >
                <Plus className="w-3 h-3" />
                0.5s
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* Toggle A-B Repeat Button */}
        <button
          onClick={onToggleRepeat}
          disabled={!isReady}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg touch-manipulation active:scale-[0.98] ${
            !isReady
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/40'
              : abRepeat.enabled
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-amber-500/25 ring-2 ring-amber-400'
              : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500'
          }`}
        >
          <Repeat className={`w-5 h-5 ${abRepeat.enabled ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
          <span>
            {abRepeat.enabled ? 'Đang bật Lặp A-B (Nhấn để Tắt)' : 'Bật lặp đoạn A-B (Phím L)'}
          </span>
        </button>

        {/* Bookmark phrase button */}
        {onSaveBookmark && isReady && (
          <button
            onClick={onSaveBookmark}
            className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-medium text-sm flex items-center justify-center gap-2 transition active:scale-95"
            title="Lưu câu này vào danh sách ôn tập"
          >
            <BookmarkPlus className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Lưu câu</span>
          </button>
        )}
      </div>

      {!isReady && (
        <div className="mt-2.5 text-center text-xs text-zinc-500 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500/80" />
          <span>Mẹo: Nghe đến đầu câu bấm <strong>Đặt mốc A</strong>, hết câu bấm <strong>Đặt mốc B</strong> rồi bật Lặp.</span>
        </div>
      )}
    </div>
  );
};

