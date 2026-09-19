/**
 * ChaptersView.tsx
 * Clean, simple Chapters home screen shown first before the level map.
 * Features:
 * - Big title "Buddy Up" at the top
 * - 3 large chapter cards in a row (stacked on phone):
 *   1. Chapter 1: Standing Your Ground (unlocked, progress count, progress bar, Play button)
 *   2. Chapter 2: The Party (locked, greyed out, lock icon, "Coming soon")
 *   3. Chapter 3: Their Side (locked, greyed out, lock icon, "Coming soon")
 * - Smaller locked card below: "Co-op Mode – team up with a friend – Coming soon"
 * - "Facts & Help" button in the corner
 */

import React from 'react';
import { GameProgress } from '../types';
import { Play, Lock, Heart, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../audio';

interface ChaptersViewProps {
  progress: GameProgress;
  onSelectChapter1: () => void;
  onOpenFactsHelp: () => void;
}

export const ChaptersView: React.FC<ChaptersViewProps> = ({
  progress,
  onSelectChapter1,
  onOpenFactsHelp,
}) => {
  const completedCount = progress.completedLevelIds.length;
  const totalLevels = 7;
  const progressPercent = Math.round((completedCount / totalLevels) * 100);
  const isChapterComplete = completedCount >= totalLevels;

  const handlePlayClick = () => {
    sound.playButtonClick();
    onSelectChapter1();
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 flex flex-col items-center select-none relative">
      {/* Big Title Header */}
      <div className="text-center mb-8 sm:mb-10">
        {/* Code-drawn cute Rin icon */}
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-blue-700 via-sky-600 to-sky-400 border-2 border-sky-300/60 p-1 flex items-center justify-center shadow-xl shadow-sky-500/20">
          <div className="w-9 h-8 rounded-xl bg-orange-200 border border-orange-300 relative flex items-center justify-center shadow-inner">
            <div className="absolute -top-1 inset-x-0 h-3 bg-indigo-950 rounded-t-md" />
            <div className="flex gap-2 relative z-10 mt-1">
              <div className="w-1.5 h-2 bg-slate-900 rounded-full" />
              <div className="w-1.5 h-2 bg-slate-900 rounded-full" />
            </div>
            <div className="absolute bottom-1 left-1 w-1.5 h-0.5 bg-pink-400/80 rounded-full" />
            <div className="absolute bottom-1 right-1 w-1.5 h-0.5 bg-pink-400/80 rounded-full" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-['Fredoka',sans-serif] drop-shadow-md">
          Buddy Up
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-md mx-auto font-medium">
          Stand your ground, support your friends, and make healthy choices together.
        </p>
      </div>

      {/* 3 Large Chapter Cards (in a row on desktop/tablet, stacked on phone) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Chapter 1: Standing Your Ground (UNLOCKED) */}
        <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/70 border-2 border-sky-500/60 hover:border-sky-400 rounded-3xl p-6 flex flex-col justify-between shadow-2xl shadow-sky-500/10 transition-all hover:scale-[1.02] group">
          {/* Card Header */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-sky-400 bg-sky-950/90 px-3 py-1 rounded-full border border-sky-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Chapter 1</span>
              </span>
              {isChapterComplete ? (
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Done</span>
                </span>
              ) : (
                <span className="text-[11px] font-bold text-slate-400">
                  Unlocked
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white font-['Fredoka',sans-serif] mb-2 group-hover:text-sky-300 transition-colors">
              Standing Your Ground
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Navigate peer pressure with Rin and Jay, debunk vape myths, and learn that real strength is choosing what is right for yourself.
            </p>
          </div>

          {/* Progress & Play Section */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            {/* Progress Count & Bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-400">Progress</span>
                <span className="text-sky-300">
                  {completedCount}/{totalLevels} levels
                </span>
              </div>

              {/* Progress bar container */}
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(progressPercent, 4)}%` }}
                />
              </div>
            </div>

            {/* Play Button */}
            <button
              id="btn-play-chapter-1"
              onClick={handlePlayClick}
              className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-sky-500/25 transition-all active:scale-98 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{completedCount === 0 ? 'Play Chapter 1' : 'Continue Chapter 1'}</span>
            </button>
          </div>
        </div>

        {/* Chapter 2: The Party (LOCKED) */}
        <div className="relative bg-slate-950/60 border-2 border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between opacity-60 cursor-not-allowed">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                <span>Chapter 2</span>
              </span>
              <span className="text-[11px] font-bold text-amber-400/80 bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Coming soon
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-300 font-['Fredoka',sans-serif] mb-2">
              The Party
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
              When an after-school party gets out of hand, Rin must make split-second decisions to help friends stay safe.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              <span>Locked</span>
            </span>
            <span className="text-xs font-bold text-slate-500">Coming soon</span>
          </div>
        </div>

        {/* Chapter 3: Their Side (LOCKED) */}
        <div className="relative bg-slate-950/60 border-2 border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between opacity-60 cursor-not-allowed">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                <span>Chapter 3</span>
              </span>
              <span className="text-[11px] font-bold text-amber-400/80 bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Coming soon
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-300 font-['Fredoka',sans-serif] mb-2">
              Their Side
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
              Step into the shoes of students who struggled with addiction and find the path to support and recovery.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              <span>Locked</span>
            </span>
            <span className="text-xs font-bold text-slate-500">Coming soon</span>
          </div>
        </div>
      </div>

      {/* Smaller Locked Card Below: Co-op Mode */}
      <div className="w-full max-w-xl bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left opacity-75 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white font-['Fredoka',sans-serif] flex items-center gap-2 justify-center sm:justify-start">
              <span>Co-op Mode – team up with a friend</span>
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Two-player local co-op to clear pressure motes and support each other.
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-amber-400/90 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30 whitespace-nowrap shrink-0">
          Coming soon
        </span>
      </div>

      {/* Facts & Help Button in the corner */}
      <div className="w-full flex justify-center sm:justify-end pt-2">
        <button
          id="btn-open-facts-help-corner"
          onClick={onOpenFactsHelp}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-500/40 rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-rose-950/50 transition-all hover:scale-105 cursor-pointer"
        >
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          <span>Facts & Help</span>
        </button>
      </div>
    </div>
  );
};
