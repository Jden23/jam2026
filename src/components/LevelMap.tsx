/**
 * LevelMap.tsx
 * Anime visual novel style 7-level pathway for Chapter 1.
 * Features:
 * - TITLE image as blurred, darkened background so cards stay readable
 * - Anime visual novel styling: dark glass panels, teal (#2dd4bf) glow accents
 * - "Back to Chapters" navigation
 * - Alternating cards with completion checks and locked indicators
 */

import React, { useState } from 'react';
import { LEVELS_DATA, LevelConfig, IMAGES } from '../content';
import { GameProgress } from '../types';
import { Swords, BookOpen, MessageCircle, Trophy, Check, Lock, Play, Sparkles, ArrowLeft, Heart } from 'lucide-react';
import { sound } from '../audio';

interface LevelMapProps {
  progress: GameProgress;
  onSelectLevel: (level: LevelConfig) => void;
  onBackToChapters: () => void;
}

export const LevelMap: React.FC<LevelMapProps> = ({
  progress,
  onSelectLevel,
  onBackToChapters,
}) => {
  const [bgFailed, setBgFailed] = useState<boolean>(false);

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
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Story':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'AI Chat':
        return 'bg-[#2dd4bf]/20 text-[#2dd4bf] border-[#2dd4bf]/40';
      case 'Ending':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col items-center py-6 sm:py-8 px-3 sm:px-6 select-none">
      {/* 1. TITLE Image as Blurred, Darkened Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {!bgFailed ? (
          <img
            src={IMAGES.TITLE}
            alt="Map Background"
            onError={() => setBgFailed(true)}
            className="w-full h-full object-cover object-center scale-110 filter blur-md brightness-[0.22]"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-slate-950" />
        )}
        <div className="absolute inset-0 bg-slate-950/70" />
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        {/* Top Navigation Row (padded on right for floating action buttons) */}
        <div className="w-full flex items-center justify-between mb-4 pr-24 sm:pr-28">
          <button
            id="btn-back-to-chapters"
            onClick={() => {
              sound.playButtonClick();
              onBackToChapters();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-950/80 hover:bg-slate-900 text-slate-200 hover:text-white border border-slate-700/80 hover:border-[#2dd4bf] rounded-xl text-xs sm:text-sm font-bold backdrop-blur-md transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#2dd4bf]" />
            <span>Back to Chapters</span>
          </button>

          <span className="text-xs text-slate-400 font-semibold bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800 backdrop-blur-md">
            {progress.completedLevelIds.length} / 7 Completed
          </span>
        </div>

        {/* Chapter Title Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-slate-950/80 border border-[#2dd4bf]/50 rounded-full text-xs font-bold text-[#2dd4bf] mb-2 backdrop-blur-md shadow-[0_0_15px_rgba(45,212,191,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-[#2dd4bf]" />
            <span>Chapter 1: The Invitation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide font-['Fredoka',sans-serif] drop-shadow-md">
            Story Pathway
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-md mx-auto leading-relaxed">
            Follow Maya and Jay as they navigate peer pressure, debunk vape myths, and learn that real strength is choosing what is right for yourself.
          </p>
        </div>

        {/* 7-Level Node Pathway */}
        <div className="relative w-full max-w-2xl py-4 flex flex-col items-center">
          {/* Connecting central vertical glowing path line */}
          <div className="absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-b from-[#2dd4bf] via-teal-500 to-emerald-500 rounded-full opacity-50 shadow-[0_0_12px_rgba(45,212,191,0.5)] z-0" />

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
                  {/* Level Card Details (Dark glass panels, teal glow accents) */}
                  <div
                    className={`w-full sm:w-72 bg-slate-950/85 backdrop-blur-xl border-2 rounded-2xl p-4 transition-all duration-300 ${
                      isCurrent
                        ? 'border-[#2dd4bf] shadow-[0_0_25px_rgba(45,212,191,0.35)] scale-105'
                        : isCompleted
                        ? 'border-emerald-500/50 opacity-95 shadow-md shadow-emerald-950/30'
                        : 'border-slate-800/80 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span
                        className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border ${getTypeBadgeClass(
                          lvl.type
                        )}`}
                      >
                        {lvl.type}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{lvl.estimatedTime}</span>
                    </div>

                    <h2 className="text-base sm:text-lg font-black text-white font-['Fredoka',sans-serif] tracking-wide">
                      {lvl.title}
                    </h2>
                    <p className="text-xs text-slate-300 mb-3">{lvl.subtitle}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <span className="text-[11px] text-slate-400 truncate max-w-[130px]">
                        {lvl.location}
                      </span>
                      <button
                        id={`btn-level-node-${lvl.id}`}
                        disabled={isLocked}
                        onClick={() => {
                          sound.playButtonClick();
                          onSelectLevel(lvl);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                          isCurrent
                            ? 'bg-[#2dd4bf] hover:bg-[#5eead4] text-slate-950 shadow-md shadow-[#2dd4bf]/40'
                            : isCompleted
                            ? 'bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
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
                      if (!isLocked) {
                        sound.playButtonClick();
                        onSelectLevel(lvl);
                      }
                    }}
                    className={`relative w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all shrink-0 ${
                      isCurrent
                        ? 'bg-[#2dd4bf] text-slate-950 border-white shadow-[0_0_20px_rgba(45,212,191,0.6)] scale-110 animate-bounce cursor-pointer'
                        : isCompleted
                        ? 'bg-emerald-600 text-white border-emerald-300 cursor-pointer hover:scale-105 shadow-md shadow-emerald-900/40'
                        : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
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
                    <span className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-slate-950 border border-slate-700 text-[10px] font-black text-slate-200 flex items-center justify-center">
                      {lvl.id}
                    </span>
                  </div>

                  {/* Spacer for symmetrical layout on large screens */}
                  <div className="hidden sm:block w-72" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Banner (Informative reminder without duplicate button) */}
        <div className="w-full max-w-xl mt-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-md flex items-center gap-3.5 text-left shadow-lg">
          <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white font-['Fredoka',sans-serif]">
              Need someone to talk to or want verified facts?
            </h2>
            <p className="text-xs text-slate-400">
              Tap the heart button in the top-right corner anytime for confidential helplines and myth busters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
