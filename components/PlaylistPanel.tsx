'use client';

import React, { useRef } from 'react';
import { Track } from '@/types/player';
import { formatTime, formatFileSize } from '@/utils/formatTime';
import {
  Upload,
  Music,
  Trash2,
  Play,
  Volume2,
  Sparkles,
  ListMusic,
  Plus,
} from 'lucide-react';

interface PlaylistPanelProps {
  playlist: Track[];
  currentTrackId: string | null;
  isPlaying: boolean;
  onSelectTrack: (track: Track) => void;
  onRemoveTrack: (id: string) => void;
  onClearPlaylist: () => void;
  onFilesSelected: (files: FileList | File[]) => void;
  onLoadSample: () => void;
}

export const PlaylistPanel: React.FC<PlaylistPanelProps> = ({
  playlist,
  currentTrackId,
  isPlaying,
  onSelectTrack,
  onRemoveTrack,
  onClearPlaylist,
  onFilesSelected,
  onLoadSample,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      // Reset input value so same files can be re-selected if deleted
      e.target.value = '';
    }
  };

  return (
    <div className="bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-zinc-800 p-4 sm:p-5 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <ListMusic className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-semibold text-zinc-100">
            Danh sách bài học ({playlist.length})
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {playlist.length > 0 && (
            <button
              onClick={onClearPlaylist}
              className="text-xs text-zinc-400 hover:text-red-400 px-2 py-1 rounded bg-zinc-800/60 hover:bg-zinc-800 transition flex items-center gap-1 active:scale-95"
              title="Xóa toàn bộ danh sách"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa hết</span>
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition active:scale-95 shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm file MP3</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.m4a,.wav,.ogg,.aac,.flac"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Drag & Drop Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-zinc-700/80 hover:border-indigo-500/80 rounded-xl p-4 text-center cursor-pointer transition-all bg-zinc-950/40 hover:bg-zinc-800/40 group mb-3"
      >
        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-indigo-950/60 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Upload className="w-5 h-5" />
        </div>
        <p className="text-xs sm:text-sm font-medium text-zinc-200">
          Kéo thả file MP3 hoặc bấm để tải lên
        </p>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          Hỗ trợ chọn nhiều file MP3, M4A, WAV cùng lúc (chạy 100% trên trình duyệt)
        </p>
      </div>

      {/* Playlist Items */}
      {playlist.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-zinc-500">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-3 text-zinc-400">
            <Music className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-zinc-300 mb-1">
            Chưa có bài học nào
          </p>
          <p className="text-xs text-zinc-500 max-w-xs mb-4">
            Tải file bài nghe MP3 của bạn lên hoặc trải nghiệm ngay bài học mẫu tạo sẵn.
          </p>

          <button
            onClick={onLoadSample}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Tải bài học tiếng Anh mẫu (Sample Lesson)</span>
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[380px] pr-1 scrollbar-thin">
          {playlist.map((track, idx) => {
            const isCurrent = track.id === currentTrackId;

            return (
              <div
                key={track.id}
                onClick={() => onSelectTrack(track)}
                className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border ${
                  isCurrent
                    ? 'bg-indigo-950/40 border-indigo-600/60 shadow-md shadow-indigo-950/30'
                    : 'bg-zinc-800/40 hover:bg-zinc-800/80 border-transparent'
                }`}
              >
                {/* Track Number / Play Indicator */}
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono shrink-0">
                    {isCurrent ? (
                      isPlaying ? (
                        <div className="flex items-end gap-0.5 h-3.5">
                          <span className="w-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:0ms] h-full" />
                          <span className="w-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms] h-2/3" />
                          <span className="w-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms] h-4/5" />
                        </div>
                      ) : (
                        <Volume2 className="w-4 h-4 text-indigo-400" />
                      )
                    ) : (
                      <span className="text-zinc-500 group-hover:hidden">
                        {idx + 1}
                      </span>
                    )}
                    {!isCurrent && (
                      <Play className="w-3.5 h-3.5 text-zinc-300 hidden group-hover:block" />
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div className="min-w-0">
                    <p
                      className={`text-xs sm:text-sm font-medium truncate ${
                        isCurrent ? 'text-indigo-300 font-semibold' : 'text-zinc-200'
                      }`}
                      title={track.name}
                    >
                      {track.name}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                      <span>{formatFileSize(track.size)}</span>
                      {track.duration > 0 && (
                        <>
                          <span>•</span>
                          <span>{formatTime(track.duration)}</span>
                        </>
                      )}
                      {track.isSample && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-semibold">
                          Sample
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remove track button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTrack(track.id);
                  }}
                  className="opacity-60 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-700/50 transition shrink-0"
                  title="Xóa bài này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

