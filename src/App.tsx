/**
 * App.tsx
 * Buddy Up - Web Action Game for Singapore Teens (Ages 13-18).
 * Renders cute, rounded characters drawn only with code.
 * Coordinates 7-level Chapter 1: Exam Week map, combat canvas, visual story, AI companion, and helplines.
 */

import React, { useState, useEffect } from 'react';
import { LevelConfig, LEVELS_DATA, APP_INFO } from './content';
import { GameProgress, GameSettings } from './types';
import { LevelMap } from './components/LevelMap';
import { GameBoard } from './components/GameBoard';
import { StoryView } from './components/StoryView';
import { AIChatView } from './components/AIChatView';
import { EndingView } from './components/EndingView';
import { HelplinesModal } from './components/HelplinesModal';
import { sound } from './audio';
import { Sparkles, Heart, Volume2, VolumeX, Shield, Map as MapIcon } from 'lucide-react';

export default function App() {
  // Game progression state
  const [progress, setProgress] = useState<GameProgress>(() => {
    try {
      const saved = localStorage.getItem('buddy_up_progress');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore local storage error
    }
    return {
      completedLevelIds: [],
      unlockedLevelId: 1, // Only level 1 is unlocked at start
      defeatedBoss: false,
      tutorialCompleted: false,
      discoveredCards: ['card-pomodoro'],
    };
  });

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem('buddy_up_progress', JSON.stringify(progress));
    } catch {
      // Ignore local storage error
    }
  }, [progress]);

  // Game settings
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    screenShake: true,
    showTouchControls: false,
  });

  // Currently playing level (null = on Level Map)
  const [activeLevel, setActiveLevel] = useState<LevelConfig | null>(null);

  // Helplines modal
  const [showHelplines, setShowHelplines] = useState<boolean>(false);

  const toggleSound = () => {
    sound.enabled = !settings.soundEnabled;
    setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  // Called when any level is successfully completed
  const handleLevelComplete = (levelId: number) => {
    setProgress((prev) => {
      const newCompleted = Array.from(new Set([...prev.completedLevelIds, levelId]));
      const nextUnlocked = Math.max(prev.unlockedLevelId, levelId + 1);
      return {
        ...prev,
        completedLevelIds: newCompleted,
        unlockedLevelId: Math.min(nextUnlocked, 7),
        tutorialCompleted: levelId === 1 ? true : prev.tutorialCompleted,
      };
    });

    // Return to map so user sees the tick on the path
    setActiveLevel(null);
  };

  const handleRestartJourney = () => {
    setProgress({
      completedLevelIds: [],
      unlockedLevelId: 1,
      defeatedBoss: false,
      tutorialCompleted: false,
      discoveredCards: ['card-pomodoro'],
    });
    setActiveLevel(null);
  };

  return (
    <div className="min-h-screen bg-[#0c0f1d] text-slate-100 flex flex-col font-['Nunito',sans-serif]">
      {/* Top Main Navigation Bar */}
      <header className="w-full bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-40 px-4 py-2.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Logo & Title */}
          <div
            onClick={() => setActiveLevel(null)}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            {/* Cute code-rendered Rin mini icon */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-sky-500 border border-sky-300/40 p-1 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <div className="w-5 h-5 rounded-lg bg-orange-200 relative flex items-center justify-center">
                <div className="w-1 h-1 bg-slate-900 rounded-full mr-1" />
                <div className="w-1 h-1 bg-slate-900 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-['Fredoka',sans-serif] text-lg font-black text-white tracking-tight">
                  {APP_INFO.title}
                </span>
                <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/30">
                  SG Teens
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                {APP_INFO.tagline}
              </span>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Map shortcut button if currently in a level */}
            {activeLevel && (
              <button
                id="btn-header-map"
                onClick={() => setActiveLevel(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Level Map</span>
              </button>
            )}

            {/* Sound Toggle */}
            <button
              id="btn-header-sound"
              onClick={toggleSound}
              aria-label={settings.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-rose-400" />
              )}
            </button>

            {/* Support and Resource Button */}
            <button
              id="btn-open-helplines-header"
              onClick={() => setShowHelplines(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-950/70 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              <span>Support Info</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="flex-1 w-full max-w-5xl mx-auto py-4 px-2 sm:px-4 flex flex-col justify-center">
        {activeLevel === null && (
          <LevelMap
            progress={progress}
            onSelectLevel={(lvl) => setActiveLevel(lvl)}
            onOpenHelplines={() => setShowHelplines(true)}
          />
        )}

        {activeLevel && activeLevel.type === 'Fight' && (
          <GameBoard
            level={activeLevel}
            settings={settings}
            onLevelComplete={handleLevelComplete}
            onExitToMap={() => setActiveLevel(null)}
            onToggleSound={toggleSound}
          />
        )}

        {activeLevel && activeLevel.type === 'Story' && (
          <StoryView
            level={activeLevel}
            onStoryComplete={handleLevelComplete}
            onExitToMap={() => setActiveLevel(null)}
          />
        )}

        {activeLevel && activeLevel.type === 'AI Chat' && (
          <AIChatView
            level={activeLevel}
            onChatComplete={handleLevelComplete}
            onExitToMap={() => setActiveLevel(null)}
          />
        )}

        {activeLevel && activeLevel.type === 'Ending' && (
          <EndingView
            level={activeLevel}
            onRestartJourney={handleRestartJourney}
            onExitToMap={() => setActiveLevel(null)}
          />
        )}
      </main>

      {/* Helplines and Mental Health Facts Modal */}
      <HelplinesModal
        isOpen={showHelplines}
        onClose={() => setShowHelplines(false)}
      />
    </div>
  );
}
