'use client';

import React from 'react';
import { Headphones, Sparkles, HelpCircle, BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenShortcuts: () => void;
  onLoadSample: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenShortcuts, onLoadSample }) => {
  return (
    <header className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-zinc-800">
      {/* Brand logo & title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/25">
          <Headphones className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              English Shadowing Player
            </h1>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              v1.0
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Luyện nghe tiếng Anh chuyên sâu • Lặp đoạn A-B • Tốc độ linh hoạt
          </p>
        </div>
      </div>

      {/* Quick Action buttons */}
      <div className="flex items-center gap-2 self-start sm:self-auto">
        <button
          onClick={onLoadSample}
          className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center gap-1.5 transition active:scale-95"
          title="Tải bài nghe mẫu có sẵn để trải nghiệm ngay"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Bài mẫu</span>
        </button>

        <button
          onClick={onOpenShortcuts}
          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-medium flex items-center gap-1.5 transition active:scale-95"
          title="Xem hướng dẫn sử dụng & phím tắt"
        >
          <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
          <span>Hướng dẫn & Phím tắt</span>
        </button>
      </div>
    </header>
  );
};

