/**
 * ChaptersView.tsx
 * Anime-styled Chapters home screen shown first before the level map.
 * Features:
 * - Full-screen TITLE background image with dark gradient at the bottom
 * - Big bold brush-style title "Buddy Up" & tagline "Small choices. Real friends. Your story."
 * - Tall portrait character cards in a row (swipeable on phone):
 *   1. Maya: "Chapter 1: The Invitation" – MAYA image, glowing teal border, "Start Maya's story →" button, progress bar
 *   2. Jay: "Chapter 2: Jay's Side" – JAY image, darkened, lock icon, "Coming soon"
 *   3. "Chapter 3: Someone You Love" – dark silhouette card, lock icon, "Coming soon"
 * - Smaller locked card below: "Co-op Mode – team up with a friend – Coming soon"
 * - "Facts & Help" button in the corner
 */

import React, { useState } from 'react';
import { GameProgress } from '../types';
import { IMAGES } from '../content';
import { Play, Lock, Heart, Users, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { sound } from '../audio';

interface ChaptersViewProps {
  progress: GameProgress;
  onSelectChapter1: () => void;
}

export const ChaptersView: React.FC<ChaptersViewProps> = ({
  progress,
  onSelectChapter1,
}) => {
  const [bgFailed, setBgFailed] = useState<boolean>(false);
  const [mayaImgFailed, setMayaImgFailed] = useState<boolean>(false);
  const [jayImgFailed, setJayImgFailed] = useState<boolean>(false);

  const completedCount = progress.completedLevelIds.length;
  const totalLevels = 7;
  const progressPercent = Math.round((completedCount / totalLevels) * 100);
  const isChapterComplete = completedCount >= totalLevels;

  const handlePlayClick = () => {
    sound.playButtonClick();
    onSelectChapter1();
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col justify-between py-8 sm:py-12 px-4 sm:px-8 select-none">
      {/* 1. Full-screen TITLE Background Image with Dark Gradient at the Bottom */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {!bgFailed ? (
          <img
            src={IMAGES.TITLE}
            alt="Buddy Up Background"
            onError={() => setBgFailed(true)}
            className="w-full h-full object-cover object-center scale-105 filter brightness-75"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#090d16]" />
        )}
        {/* Layered cinematic gradients for readability and anime atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-slate-950/30 to-slate-950/80" />
      </div>

      {/* Top spacing clearance for floating buttons */}
      <div className="h-6 sm:h-8" />

      {/* 2. Big Bold Brush-Style Title "Buddy Up" & Tagline */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 bg-slate-950/70 border border-[#2dd4bf]/40 px-4 py-1 rounded-full text-xs font-bold text-[#2dd4bf] mb-3 backdrop-blur-md shadow-[0_0_15px_rgba(45,212,191,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-[#2dd4bf]" />
          <span>Anime Story & Action</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-wider font-['Fredoka',sans-serif] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] uppercase">
          Buddy Up
        </h1>
        <p className="text-slate-200 text-sm sm:text-base md:text-lg mt-2 font-semibold tracking-wide drop-shadow-md">
          Small choices. Real friends. Your story.
        </p>
      </div>

      {/* 3. Tall Portrait Character Cards (Swipeable on phone / 3 columns on desktop) */}
      <div className="relative z-10 w-full max-w-6xl mx-auto mb-6">
        <div className="flex md:grid md:grid-cols-3 gap-5 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-none snap-x snap-mandatory">
          {/* Card 1: Maya – Chapter 1: The Invitation (UNLOCKED) */}
          <div className="min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-center relative rounded-3xl overflow-hidden border-2 border-[#2dd4bf] shadow-[0_0_35px_rgba(45,212,191,0.35)] bg-slate-950/85 backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] group">
            {/* Tall Portrait Image of Maya */}
            <div className="relative w-full h-[280px] sm:h-[320px] overflow-hidden bg-slate-900">
              {!mayaImgFailed ? (
                <img
                  src={IMAGES.MAYA}
                  alt="Maya"
                  onError={() => setMayaImgFailed(true)}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-sky-900 to-slate-950">
                  <span className="text-5xl">🌸</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-950 bg-[#2dd4bf] px-3 py-1 rounded-full shadow-[0_0_12px_rgba(45,212,191,0.5)]">
                  Chapter 1
                </span>
                {isChapterComplete ? (
                  <span className="text-[11px] font-bold text-emerald-300 bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1 backdrop-blur-md">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Done</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-white bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-[#2dd4bf]/40 backdrop-blur-md">
                    Unlocked
                  </span>
                )}
              </div>

              {/* Character Name in image corner */}
              <div className="absolute bottom-3 left-4">
                <span className="text-2xl font-black text-white font-['Fredoka',sans-serif] tracking-wide drop-shadow-md block">
                  Maya
                </span>
                <span className="text-xs text-[#2dd4bf] font-bold drop-shadow">
                  Chapter 1: The Invitation
                </span>
              </div>
            </div>

            {/* Card Body & Action */}
            <div className="p-5 flex flex-col justify-between flex-1 gap-4">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                When vape myths and peer pressure start circulating, Maya stands firm for her values and supports her friend Jay.
              </p>

              {/* Progress Count & Bar */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-400">Chapter Progress</span>
                  <span className="text-[#2dd4bf] font-extrabold">
                    {completedCount}/{totalLevels} levels
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-[#2dd4bf] to-emerald-400 rounded-full shadow-[0_0_8px_rgba(45,212,191,0.5)] transition-all duration-500"
                    style={{ width: `${Math.max(progressPercent, 5)}%` }}
                  />
                </div>
              </div>

              {/* "Start Maya's story →" Button */}
              <button
                id="btn-play-chapter-1"
                onClick={handlePlayClick}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#2dd4bf] to-teal-600 hover:from-[#5eead4] hover:to-teal-500 text-slate-950 font-black rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#2dd4bf]/20 transition-all active:scale-98 cursor-pointer"
              >
                <span>
                  {completedCount === 0 ? "Start Maya's story →" : "Continue Maya's story →"}
                </span>
                <Play className="w-4 h-4 fill-slate-950" />
              </button>
            </div>
          </div>

          {/* Card 2: Jay – Chapter 2: Jay's Side (LOCKED) */}
          <div className="min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-center relative rounded-3xl overflow-hidden border-2 border-slate-800 bg-slate-950/70 backdrop-blur-md flex flex-col justify-between opacity-70">
            {/* Tall Portrait Image of Jay (Darkened) */}
            <div className="relative w-full h-[280px] sm:h-[320px] overflow-hidden bg-slate-900">
              {!jayImgFailed ? (
                <img
                  src={IMAGES.JAY}
                  alt="Jay"
                  onError={() => setJayImgFailed(true)}
                  className="w-full h-full object-cover object-top filter brightness-50 contrast-90 grayscale-[30%]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-950">
                  <span className="text-5xl opacity-40">✨</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800">
                  Chapter 2
                </span>
                <span className="text-[11px] font-bold text-amber-400/90 bg-slate-950/90 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1 backdrop-blur-md">
                  <Lock className="w-3 h-3" />
                  <span>Coming soon</span>
                </span>
              </div>

              {/* Character Name in image corner */}
              <div className="absolute bottom-3 left-4">
                <span className="text-2xl font-black text-slate-300 font-['Fredoka',sans-serif] tracking-wide block">
                  Jay
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  Chapter 2: Jay's Side
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex flex-col justify-between flex-1 gap-4">
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Experience the situation through Jay's eyes—the pressure to fit in behind the bleachers and learning how to say no.
              </p>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Locked</span>
                </span>
                <span className="text-xs font-bold text-amber-400/80">Coming soon</span>
              </div>
            </div>
          </div>

          {/* Card 3: Someone You Love – Chapter 3 (DARK SILHOUETTE, LOCKED) */}
          <div className="min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-center relative rounded-3xl overflow-hidden border-2 border-slate-800 bg-slate-950/70 backdrop-blur-md flex flex-col justify-between opacity-70">
            {/* Dark Silhouette Graphic */}
            <div className="relative w-full h-[280px] sm:h-[320px] overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-950 flex flex-col items-center justify-center">
              {/* Anime Silhouette Figure Outline */}
              <div className="w-24 h-24 rounded-full bg-slate-900/90 border-2 border-slate-800 flex items-center justify-center shadow-inner relative">
                <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800/80 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-slate-600" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800">
                  Chapter 3
                </span>
                <span className="text-[11px] font-bold text-amber-400/90 bg-slate-950/90 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1 backdrop-blur-md">
                  <Lock className="w-3 h-3" />
                  <span>Coming soon</span>
                </span>
              </div>

              {/* Chapter Name in image corner */}
              <div className="absolute bottom-3 left-4">
                <span className="text-xl sm:text-2xl font-black text-slate-300 font-['Fredoka',sans-serif] tracking-wide block">
                  Someone You Love
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  Chapter 3: Their Side
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex flex-col justify-between flex-1 gap-4">
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Step into the shoes of someone recovering and see how family, counseling, and genuine support restore hope.
              </p>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Locked</span>
                </span>
                <span className="text-xs font-bold text-amber-400/80">Coming soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Smaller Locked Card: Co-op Mode */}
      <div className="relative z-10 w-full max-w-xl mx-auto bg-slate-950/80 border border-slate-800/90 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 text-[#2dd4bf] flex items-center justify-center shrink-0 shadow-inner">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-white font-['Fredoka',sans-serif] flex items-center gap-2 justify-center sm:justify-start">
              <span>Co-op Mode – team up with a friend</span>
              <Lock className="w-3 h-3 text-slate-400" />
            </h3>
            <p className="text-[11px] text-slate-400">
              Clear peer pressure motes side by side on one device.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-amber-400/90 bg-amber-950/40 px-3 py-1 rounded-full border border-amber-500/30 whitespace-nowrap shrink-0">
          Coming soon
        </span>
      </div>
    </div>
  );
};
