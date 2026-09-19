/**
 * EndingView.tsx
 * Level 7 "Exam Day & Beyond" Finale.
 * Highlights the core message: "You are more than your grades",
 * provides reflection takeaways from content.ts, and direct access to Singapore Helplines.
 */

import React from 'react';
import { LevelConfig, SINGAPORE_HELPLINES } from '../content';
import { Trophy, CheckCircle, Heart, Phone, ArrowLeft, RotateCcw, ExternalLink } from 'lucide-react';
import { sound } from '../audio';

interface EndingViewProps {
  level: LevelConfig;
  onRestartJourney: () => void;
  onExitToMap: () => void;
  onOpenHelplines: () => void;
}

export const EndingView: React.FC<EndingViewProps> = ({
  level,
  onRestartJourney,
  onExitToMap,
  onOpenHelplines,
}) => {
  const endingData = level.endingSummary || {
    headline: 'You Completed Chapter 1: Exam Week!',
    takeaways: [
      'Your worth is never defined by a letter on an exam slip.',
      'Sleep and scheduled rest consolidate your memories—they are active study tools.',
      'Reaching out for peer or professional support is a strength, never a weakness.',
      'Singapore helplines like SOS (1767) and YouthLine (1771) are always here for you.',
    ],
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-3 flex flex-col items-center select-none">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between mb-6">
        <button
          id="btn-ending-back-map"
          onClick={onExitToMap}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Map</span>
        </button>

        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
          Chapter 1 Complete
        </span>
      </div>

      {/* Main Victory Certificate Card */}
      <div className="w-full bg-gradient-to-b from-slate-900 to-indigo-950/60 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mb-4 shadow-lg">
          <Trophy className="w-9 h-9" />
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-amber-400 block mb-1">
          Certificate of Resilient Focus
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-['Fredoka',sans-serif] mb-3">
          {endingData.headline}
        </h1>

        <p className="text-sm text-slate-300 max-w-lg mx-auto mb-6 leading-relaxed">
          Rin stepped into the examination hall not with paralyzing dread, but with deep breaths, clear focus, and the knowledge that true friendship and self-worth outlast any exam paper.
        </p>

        {/* Essential Takeaways List */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 mb-6 text-left max-w-xl mx-auto">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Key Lessons for Singapore Students:</span>
          </h2>
          <ul className="space-y-2.5">
            {endingData.takeaways.map((takeaway, idx) => (
              <li key={idx} className="text-xs sm:text-sm text-slate-200 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Helplines Callout Box */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 mb-6 max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div>
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1 mb-0.5">
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              <span>Singapore 24/7 Youth Support:</span>
            </span>
            <p className="text-xs text-slate-300">
              Samaritans of Singapore (SOS): <strong>1767</strong> | YouthLine: <strong>1771</strong>
            </p>
          </div>
          <button
            id="btn-ending-view-helplines"
            onClick={onOpenHelplines}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            All Resources
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            id="btn-ending-replay"
            onClick={() => {
              sound.playButtonClick();
              onRestartJourney();
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black rounded-xl text-sm shadow-xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay Chapter 1</span>
          </button>
          <button
            id="btn-ending-return-map"
            onClick={onExitToMap}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Return to Level Map
          </button>
        </div>
      </div>
    </div>
  );
};
