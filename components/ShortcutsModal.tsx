'use client';

import React from 'react';
import { X, Keyboard, Headphones, Sparkles, CheckCircle2 } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-indigo-400">
            <Keyboard className="w-5 h-5" />
            <h3 className="text-base font-semibold text-zinc-100">
              Hướng dẫn & Phím tắt bàn phím
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Keyboard shortcuts table */}
        <div className="space-y-4 mb-6">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Phím tắt tiện lợi (Desktop / Laptop)
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/60 border border-zinc-800">
              <span className="text-zinc-300">Phát / Tạm dừng</span>
              <kbd className="px-2 py-0.5 rounded bg-zinc-950 font-mono text-zinc-200 border border-zinc-700">
                Space
              </kbd>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/60 border border-zinc-800">
              <span className="text-zinc-300">Tua lùi 5 giây</span>
              <kbd className="px-2 py-0.5 rounded bg-zinc-950 font-mono text-zinc-200 border border-zinc-700">
                ← Trái
              </kbd>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/60 border border-zinc-800">
              <span className="text-zinc-300">Tua tới 5 giây</span>
              <kbd className="px-2 py-0.5 rounded bg-zinc-950 font-mono text-zinc-200 border border-zinc-700">
                → Phải
              </kbd>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/60 border border-zinc-800">
              <span className="text-zinc-300">Đặt mốc A</span>
              <kbd className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono font-bold border border-emerald-700">
                A
              </kbd>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/60 border border-zinc-800">
              <span className="text-zinc-300">Đặt mốc B</span>
              <kbd className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-mono font-bold border border-amber-700">
                B
              </kbd>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/60 border border-zinc-800">
              <span className="text-zinc-300">Bật / Tắt Lặp A-B</span>
              <kbd className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono font-bold border border-indigo-700">
                L
              </kbd>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/60 border border-zinc-800">
              <span className="text-zinc-300">Xóa mốc A-B</span>
              <kbd className="px-2 py-0.5 rounded bg-zinc-950 font-mono text-zinc-200 border border-zinc-700">
                R
              </kbd>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-800/60 border border-zinc-800">
              <span className="text-zinc-300">Tăng / Giảm Volume</span>
              <kbd className="px-2 py-0.5 rounded bg-zinc-950 font-mono text-zinc-200 border border-zinc-700">
                ↑ / ↓
              </kbd>
            </div>
          </div>
        </div>

        {/* Learning tips */}
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/50 space-y-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Phương pháp luyện nghe Shadowing với A-B Repeat:</span>
          </div>
          <ul className="text-xs text-zinc-300 space-y-1.5 pl-4 list-disc">
            <li>
              <strong>Bước 1:</strong> Bắt đầu nghe câu nói, bấm <span className="text-emerald-400 font-bold">Đặt mốc A</span> ở đầu câu và <span className="text-amber-400 font-bold">Đặt mốc B</span> ở cuối câu.
            </li>
            <li>
              <strong>Bước 2:</strong> Dùng nút <span className="text-zinc-200 font-mono">±0.5s</span> để tinh chỉnh vị trí nếu bị lẹm âm.
            </li>
            <li>
              <strong>Bước 3:</strong> Bật chế độ <strong>Lặp A-B</strong>, giảm tốc độ về <span className="text-indigo-300 font-mono">0.75x</span> để nghe rõ ngữ điệu và phát âm từng từ, sau đó tăng lên <span className="text-indigo-300 font-mono">1.0x</span> để nói đuổi (shadowing) cùng tốc độ người bản xứ.
            </li>
          </ul>
        </div>

        {/* Background audio notice */}
        <div className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-800 flex items-start gap-2.5 text-xs text-zinc-400">
          <Headphones className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <p>
            <strong className="text-zinc-200">Hỗ trợ chạy nền màn hình khóa:</strong> Nhờ tích hợp <em>Media Session API</em>, bạn có thể khóa màn hình điện thoại (iPhone / Android) hoặc chuyển ứng dụng khác, bài nghe vẫn tiếp tục phát và hiển thị widget điều khiển trên màn hình khóa.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm transition"
        >
          Đã hiểu, quay lại học
        </button>
      </div>
    </div>
  );
};

