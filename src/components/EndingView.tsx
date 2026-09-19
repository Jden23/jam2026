/**
 * EndingView.tsx
 * Level 7 "Standing Tall" Finale.
 * Highlights the core message: "Real strength is standing your ground",
 * provides reflection takeaways, and allows replaying Chapter 1.
 * (No unverified facts, statistics, or phone numbers).
 */

import React from 'react';
import { LevelConfig } from '../content';
import { Trophy, CheckCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { sound } from '../audio';

interface EndingViewProps {
  level: LevelConfig;
  onRestartJourney: () => void;
  onExitToMap: () => void;
}

export const EndingView: React.FC<EndingViewProps> = ({
  level,
  onRestartJourney,
  onExitToMap,
}) => {
  const endingData = level.endingSummary || {
    headline: 'You Completed Chapter 1: Standing Your Ground!',
    takeaways: [
      'Real friends respect your boundaries and your choices.',
      'You never have to inhale or try anything just to fit into a group.',
      'Common myths like "it is just water vapour" hide real risks and addictive substances.',
      'Standing your ground takes real courage—and you have that courage inside you.',
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
          Certificate of Standing Your Ground
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-['Fredoka',sans-serif] mb-3">
          {endingData.headline}
        </h1>

        <p className="text-sm text-slate-300 max-w-lg mx-auto mb-6 leading-relaxed">
          Maya and Jay walked out into the open courtyard with clarity and confidence. True friendship means supporting one another in making healthy choices and standing up against peer pressure.
        </p>

        {/* Essential Takeaways List */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 mb-6 text-left max-w-xl mx-auto">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Key Takeaways:</span>
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
