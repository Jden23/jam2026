/**
 * LevelMap.tsx
 * Interactive Chapter 1 "Exam Week" 7-level pathway:
 * 7 nodes with icons + text labels (Fight / Story / AI Chat / Ending).
 * Completed levels get a tick (check mark).
 * Only the next level is unlocked.
 */

import React from 'react';
import { LEVELS_DATA, LevelConfig } from '../content';
import { GameProgress } from '../types';
import { Swords, BookOpen, MessageCircle, Trophy, Check, Lock, Play, Sparkles, ArrowLeft } from 'lucide-react';

interface LevelMapProps {
  progress: GameProgress;
  onSelectLevel: (level: LevelConfig) => void;
  onOpenHelplines: () => void;
  onBackToChapters: () => void;
}

export const LevelMap: React.FC<LevelMapProps> = ({
  progress,
  onSelectLevel,
  onOpenHelplines,
  onBackToChapters,
}) => {
  const getIcon = (type: LevelConfig['type']) => {
    switch (type) {
      case 'Fight':
        return <Swords className="w-5 h-5" />;
      case 'Story':
        return <BookOpen className="w-5 h-5" />;
      case 'AI Chat':
        return <MessageCircle className="w-5 h-5" />;
      case 'Ending':
        return <Trophy className="w-5 h-5" />;
    }
  };

  const getTypeBadgeClass = (type: LevelConfig['type']) => {
    switch (type) {
      case 'Fight':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'Story':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'AI Chat':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'Ending':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-3 flex flex-col items-center select-none">
      {/* Top Navigation Row */}
      <div className="w-full flex items-center justify-start mb-4">
        <button
          id="btn-back-to-chapters"
          onClick={onBackToChapters}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/70 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-sky-400" />
          <span>Back to Chapters</span>
        </button>
      </div>

      {/* Chapter Title Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-950/60 border border-sky-500/40 rounded-full text-xs font-bold text-sky-300 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Chapter 1: Standing Your Ground</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Fredoka',sans-serif]">
          Level Map
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
          Follow Rin and Jay as they navigate peer pressure, debunk vape myths, and learn that real strength is choosing what is right for yourself.
        </p>
      </div>

      {/* 7-Level Node Pathway */}
      <div className="relative w-full max-w-2xl py-4 flex flex-col items-center">
        {/* Connecting central vertical path line */}
        <div className="absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-b from-sky-500 via-indigo-500 to-emerald-500 rounded-full opacity-40 z-0" />

        <div className="w-full flex flex-col gap-6 z-10">
          {LEVELS_DATA.map((lvl, index) => {
            const isCompleted = progress.completedLevelIds.includes(lvl.id);
            const isCurrent = progress.unlockedLevelId === lvl.id && !isCompleted;
            const isUnlocked = isCompleted || progress.unlockedLevelId >= lvl.id;
            const isLocked = !isUnlocked;

            // Alternating zigzag card layout on medium/large screens
            const isEven = index % 2 === 0;

            return (
              <div
                key={lvl.id}
                className={`relative flex items-center w-full ${
                  isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'
                } justify-center gap-4 sm:gap-8`}
              >
                {/* Level Card Details */}
                <div
                  className={`w-full sm:w-72 bg-slate-900/90 border rounded-2xl p-4 transition-all duration-200 ${
                    isCurrent
                      ? 'border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.25)] bg-slate-800/90 scale-105'
                      : isCompleted
                      ? 'border-emerald-500/40 opacity-90'
                      : 'border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[11px] font-black uppercase px-2 py-0.5 rounded-full border ${getTypeBadgeClass(
                        lvl.type
                      )}`}
                    >
                      {lvl.type}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{lvl.estimatedTime}</span>
                  </div>

                  <h2 className="text-base sm:text-lg font-black text-white font-['Fredoka',sans-serif]">
                    {lvl.title}
                  </h2>
                  <p className="text-xs text-slate-400 mb-3">{lvl.subtitle}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] text-slate-500 truncate max-w-[140px]">{lvl.location}</span>
                    <button
                      id={`btn-level-node-${lvl.id}`}
                      disabled={isLocked}
                      onClick={() => onSelectLevel(lvl)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                        isCurrent
                          ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md shadow-sky-500/30'
                          : isCompleted
                          ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400'
                          : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Replay</span>
                        </>
                      ) : isCurrent ? (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Locked</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Central Path Node Circle */}
                <div
                  onClick={() => {
                    if (!isLocked) onSelectLevel(lvl);
                  }}
                  className={`relative w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-transform shrink-0 ${
                    isCurrent
                      ? 'bg-sky-500 text-slate-950 border-white shadow-lg shadow-sky-500/50 scale-110 animate-bounce'
                      : isCompleted
                      ? 'bg-emerald-600 text-white border-emerald-400 cursor-pointer hover:scale-105'
                      : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 stroke-[3]" />
                  ) : isLocked ? (
                    <Lock className="w-5 h-5" />
                  ) : (
                    getIcon(lvl.type)
                  )}

                  {/* Level Number Pin */}
                  <span className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-slate-950 border border-slate-700 text-[10px] font-black text-slate-300 flex items-center justify-center">
                    {lvl.id}
                  </span>
                </div>

                {/* Spacer for symmetrical layout */}
                <div className="hidden sm:block w-72" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Banner */}
      <div className="w-full max-w-xl mt-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <h2 className="text-sm font-black text-white">Need someone to talk to or want verified facts?</h2>
          <p className="text-xs text-slate-400">
            Check out verified vape myths, facts, and confidential help contacts.
          </p>
        </div>
        <button
          id="btn-open-facts-help-map"
          onClick={onOpenHelplines}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
        >
          Facts & Help
        </button>
      </div>
    </div>
  );
};
