'use client';

import React from 'react';
import { Bookmark } from '@/types/player';
import { formatTime } from '@/utils/formatTime';
import { Bookmark as BookmarkIcon, Play, Trash2, ArrowRight } from 'lucide-react';

interface BookmarksListProps {
  bookmarks: Bookmark[];
  onSelectBookmark: (bookmark: Bookmark) => void;
  onDeleteBookmark: (id: string) => void;
  onClearBookmarks: () => void;
}

export const BookmarksList: React.FC<BookmarksListProps> = ({
  bookmarks,
  onSelectBookmark,
  onDeleteBookmark,
  onClearBookmarks,
}) => {
  if (bookmarks.length === 0) return null;

  return (
    <div className="bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-zinc-800 p-4 shadow-xl">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <BookmarkIcon className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs sm:text-sm font-semibold text-zinc-200">
            Câu quan trọng đã lưu ({bookmarks.length})
          </h4>
        </div>
        <button
          onClick={onClearBookmarks}
          className="text-[11px] text-zinc-500 hover:text-red-400 transition"
        >
          Xóa hết
        </button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
        {bookmarks.map((b) => (
          <div
            key={b.id}
            onClick={() => onSelectBookmark(b)}
            className="flex items-center justify-between p-2 rounded-xl bg-zinc-800/40 hover:bg-zinc-800/80 border border-zinc-800 cursor-pointer transition group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-black transition">
                <Play className="w-3.5 h-3.5 fill-current" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-300">
                  <span className="text-emerald-400">{formatTime(b.pointA, true)}</span>
                  <ArrowRight className="w-3 h-3 text-zinc-600" />
                  <span className="text-amber-400">{formatTime(b.pointB, true)}</span>
                </div>
                {b.note && (
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">{b.note}</p>
                )}
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteBookmark(b.id);
              }}
              className="p-1 rounded-md text-zinc-500 hover:text-red-400 hover:bg-zinc-700/50 transition opacity-60 group-hover:opacity-100"
              title="Xóa mốc đã lưu"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

