/**
 * StoryView.tsx
 * Visual story dialogue scene for Level 2 (Behind the Bleachers) and Level 4 (The Walk Home).
 * Features cute, rounded characters drawn only with code (Rin and Jay),
 * expressive dialogue cards, and seamless progression to map or next level.
 */

import React, { useState } from 'react';
import { LevelConfig, DialogueLine } from '../content';
import { ArrowLeft, Play, Sparkles, User } from 'lucide-react';
import { sound } from '../audio';

interface StoryViewProps {
  level: LevelConfig;
  onStoryComplete: (levelId: number) => void;
  onExitToMap: () => void;
}

export const StoryView: React.FC<StoryViewProps> = ({
  level,
  onStoryComplete,
  onExitToMap,
}) => {
  const dialogues: DialogueLine[] = level.dialogue || [];
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const currentLine = dialogues[currentIndex] || {
    speaker: 'Rin',
    avatar: 'rin',
    text: 'Let us keep moving forward.',
    mood: 'neutral',
  };

  const isLastLine = currentIndex >= dialogues.length - 1;

  const handleNext = () => {
    sound.playButtonClick();
    if (isLastLine) {
      sound.playLevelComplete();
      onStoryComplete(level.id);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-3 flex flex-col items-center select-none">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          id="btn-story-exit"
          onClick={onExitToMap}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Map</span>
        </button>

        <div className="text-right">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
            {level.badge}
          </span>
          <h2 className="text-lg font-black text-white font-['Fredoka',sans-serif]">
            {level.title}
          </h2>
        </div>
      </div>

      {/* Main Story Stage / Canvas Atmosphere */}
      <div className="relative w-full aspect-[16/9] max-h-[420px] rounded-3xl bg-gradient-to-b from-[#111827] to-[#1e1b4b] border-2 border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between p-6">
        {/* Background Atmosphere Elements */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-10 left-12 w-32 h-32 rounded-full bg-indigo-500 blur-3xl" />
          <div className="absolute bottom-10 right-12 w-40 h-40 rounded-full bg-amber-500 blur-3xl" />
        </div>

        {/* Location Tag */}
        <div className="relative z-10 inline-flex items-center gap-2 self-start bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-xs font-semibold text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{level.location}</span>
        </div>

        {/* Chibi Character Display (Code-drawn avatars: Rin & Jay) */}
        <div className="relative z-10 flex items-end justify-around w-full px-6 mb-2">
          {/* Rin Avatar */}
          <div
            className={`flex flex-col items-center transition-all duration-300 ${
              currentLine.speaker === 'Rin'
                ? 'scale-110 drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                : 'opacity-50 scale-95'
            }`}
          >
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-b from-blue-900 to-slate-900 border-2 border-sky-400 p-2 flex flex-col items-center justify-center relative shadow-lg">
              {/* Head */}
              <div className="w-12 h-10 rounded-xl bg-orange-200 border border-orange-300 relative flex items-center justify-center">
                {/* Hair fringe */}
                <div className="absolute -top-1.5 inset-x-0 h-4 bg-indigo-950 rounded-t-lg" />
                {/* Eyes */}
                <div className="flex gap-3 relative z-10 mt-1">
                  <div className="w-2 h-2.5 bg-slate-900 rounded-full" />
                  <div className="w-2 h-2.5 bg-slate-900 rounded-full" />
                </div>
                {/* Cheeks */}
                <div className="absolute bottom-1.5 left-1 w-2 h-1 bg-pink-400/60 rounded-full" />
                <div className="absolute bottom-1.5 right-1 w-2 h-1 bg-pink-400/60 rounded-full" />
              </div>
              {/* Blazer & Red Tie */}
              <div className="w-14 h-6 bg-blue-950 rounded-t-md mt-1 relative flex justify-center">
                <div className="w-1.5 h-4 bg-rose-500 rounded-full" />
              </div>
            </div>
            <span className="mt-2 text-xs font-black text-sky-300 bg-slate-900/90 px-2.5 py-0.5 rounded-full border border-sky-500/30">
              Rin
            </span>
          </div>

          {/* Jay Avatar (Friend) */}
          <div
            className={`flex flex-col items-center transition-all duration-300 ${
              currentLine.speaker === 'Jay'
                ? 'scale-110 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                : 'opacity-50 scale-95'
            }`}
          >
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-b from-amber-950 to-slate-900 border-2 border-amber-400 p-2 flex flex-col items-center justify-center relative shadow-lg">
              {/* Head with glasses */}
              <div className="w-12 h-10 rounded-xl bg-amber-100 border border-amber-200 relative flex items-center justify-center">
                {/* Hair */}
                <div className="absolute -top-2 inset-x-0 h-4 bg-amber-900 rounded-t-lg" />
                {/* Glasses */}
                <div className="flex gap-1.5 relative z-10 mt-1">
                  <div className="w-3.5 h-3 border-2 border-slate-800 rounded-md" />
                  <div className="w-3.5 h-3 border-2 border-slate-800 rounded-md" />
                </div>
              </div>
              {/* School sweater vest */}
              <div className="w-14 h-6 bg-emerald-900 rounded-t-md mt-1 relative flex justify-center">
                <div className="w-1.5 h-3 bg-white rounded-full" />
              </div>
            </div>
            <span className="mt-2 text-xs font-black text-amber-300 bg-slate-900/90 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Jay
            </span>
          </div>
        </div>

        {/* Dialogue Box */}
        <div
          onClick={handleNext}
          className="relative z-20 w-full bg-slate-950/95 border-2 border-slate-700 hover:border-slate-500 rounded-2xl p-5 shadow-2xl transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-black text-white flex items-center gap-1.5">
              <User className="w-4 h-4 text-sky-400" />
              <span>{currentLine.speaker}</span>
            </span>
            <span className="text-[11px] text-slate-400">
              {currentIndex + 1} / {dialogues.length} • Tap anywhere to continue
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed min-h-[54px]">
            "{currentLine.text}"
          </p>

          <div className="flex justify-end mt-3">
            <button
              id="btn-dialogue-advance"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md group-hover:scale-105 transition-all cursor-pointer"
            >
              <span>{isLastLine ? 'Finish & Progress' : 'Next'}</span>
              <Play className="w-3 h-3 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
