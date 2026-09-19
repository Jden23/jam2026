/**
 * App.tsx
 * Buddy Up - Web Action Game for Singapore Teens (Ages 13-18).
 * Renders cute, rounded characters drawn only with code.
 * Coordinates 7-level Chapter 1: Exam Week map, combat canvas, visual story, AI companion, and helplines.
 */

import React, { useState, useEffect } from 'react';
import { LevelConfig, LEVELS_DATA, APP_INFO, IMAGES } from './content';
import { GameProgress, GameSettings } from './types';
import { ChaptersView } from './components/ChaptersView';
import { LevelMap } from './components/LevelMap';
import { GameBoard } from './components/GameBoard';
import { StoryView } from './components/StoryView';
import { AIChatView } from './components/AIChatView';
import { EndingView } from './components/EndingView';
import { HelplinesModal } from './components/HelplinesModal';
import { sound } from './audio';
import { Sparkles, Heart, Volume2, VolumeX, Shield } from 'lucide-react';

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

  // Current view when not in level: 'chapters' (home screen) or 'level_map'
  const [currentView, setCurrentView] = useState<'chapters' | 'level_map'>('chapters');

  // Currently playing level (null = on Chapters or Level Map)
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
    setCurrentView('chapters');
  };

  const handleLogoClick = () => {
    setActiveLevel(null);
    setCurrentView('chapters');
  };

  return (
    <div className="min-h-screen w-full bg-[#0c0f1d] text-slate-100 font-['Nunito',sans-serif] relative overflow-x-hidden">
      {/* Floating Quick Action Buttons (Top-Right of all screens) */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 flex items-center gap-2 pointer-events-auto">
        {/* Sound Toggle */}
        <button
          id="btn-floating-sound"
          onClick={toggleSound}
          aria-label={settings.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          title={settings.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          className="w-10 h-10 rounded-full bg-slate-950/85 hover:bg-slate-900 text-slate-200 hover:text-white border border-slate-700/80 hover:border-[#2dd4bf] backdrop-blur-md shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          {settings.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-[#2dd4bf]" />
          ) : (
            <VolumeX className="w-4 h-4 text-rose-400" />
          )}
        </button>

        {/* Facts & Help Heart Button */}
        <button
          id="btn-floating-facts-help"
          onClick={() => {
            sound.playButtonClick();
            setShowHelplines(true);
          }}
          aria-label="Facts & Help"
          title="Facts & Help"
          className="w-10 h-10 rounded-full bg-slate-950/85 hover:bg-slate-900 text-rose-400 hover:text-rose-300 border border-rose-500/50 hover:border-rose-400 backdrop-blur-md shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
        </button>
      </div>

      {/* Main Content Stage (Full-screen edge-to-edge mobile game experience) */}
      <main className="w-full min-h-screen relative flex flex-col">
        {/* Chapters Home Screen */}
        {activeLevel === null && currentView === 'chapters' && (
          <ChaptersView
            progress={progress}
            onSelectChapter1={() => setCurrentView('level_map')}
          />
        )}

        {/* Level Map for Chapter 1 */}
        {activeLevel === null && currentView === 'level_map' && (
          <LevelMap
            progress={progress}
            onSelectLevel={(lvl) => setActiveLevel(lvl)}
            onBackToChapters={() => setCurrentView('chapters')}
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
