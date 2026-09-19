/**
 * StoryView.tsx
 * Visual-novel anime scene for Level 2 (Behind the Bleachers) and Level 4 (The Walk Home).
 * Features:
 * - Full-screen background (Level 2 = BLEACHERS, Level 4 = PARK) with object-fit: cover and fallback
 * - Large character portraits on sides (Maya on left, Jay / Teacher on right)
 *   Speaking character highlighted with teal glow; non-speaking character dimmed
 * - Dark glass dialogue box at the bottom with teal (#2dd4bf) glowing border and name tag
 * - Rapid typewriter text reveal effect
 * - Click, tap, or Space key to advance (or reveal instant text if typing)
 * - Small "Back to map" (top left) and "Skip" (top right) buttons
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LevelConfig, DialogueLine, IMAGES } from '../content';
import { ArrowLeft, FastForward, ExternalLink, ChevronRight, Sparkles } from 'lucide-react';
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
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);

  // Image load error fallback state
  const [bgLoadFailed, setBgLoadFailed] = useState<boolean>(false);
  const [mayaLoadFailed, setMayaLoadFailed] = useState<boolean>(false);
  const [rightLoadFailed, setRightLoadFailed] = useState<boolean>(false);

  const currentLine = dialogues[currentIndex] || {
    speaker: 'Maya',
    avatar: 'maya',
    text: 'Let us keep moving forward.',
    mood: 'neutral',
  };

  const isLastLine = currentIndex >= dialogues.length - 1;

  // Background image URL based on level
  const bgImage = level.id === 2 ? IMAGES.BLEACHERS : IMAGES.PARK;

  // Right side character image based on speaker/dialogue avatar
  const rightCharacterImage = currentLine.avatar === 'teacher' ? IMAGES.TEACHER : IMAGES.JAY;
  const rightCharacterName = currentLine.avatar === 'teacher' ? 'Teacher' : 'Jay';

  const isMayaSpeaking = currentLine.speaker === 'Maya' || currentLine.avatar === 'maya';
  const isRightSpeaking = !isMayaSpeaking;

  // Rapid typewriter effect for anime VN text
  useEffect(() => {
    const fullText = currentLine.text || '';
    setDisplayedText('');
    setIsTyping(true);

    let charIdx = 0;
    const interval = setInterval(() => {
      charIdx++;
      if (charIdx <= fullText.length) {
        setDisplayedText(fullText.slice(0, charIdx));
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [currentIndex, currentLine.text]);

  const advanceDialogue = useCallback(() => {
    // If currently typing, finish typing immediately on first tap/click/space
    if (isTyping) {
      setDisplayedText(currentLine.text);
      setIsTyping(false);
      return;
    }

    sound.playButtonClick();
    if (isLastLine) {
      sound.playLevelComplete();
      onStoryComplete(level.id);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [isTyping, isLastLine, currentLine.text, onStoryComplete, level.id]);

  const handleSkip = () => {
    sound.playButtonClick();
    sound.playLevelComplete();
    onStoryComplete(level.id);
  };

  // Keyboard spacebar listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        advanceDialogue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [advanceDialogue]);

  return (
    <div
      onClick={advanceDialogue}
      className="relative w-full h-[calc(100vh-65px)] min-h-[550px] max-h-[820px] max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col justify-between select-none cursor-pointer bg-slate-950"
    >
      {/* 1. Full-screen Background Image with Object-Fit: Cover & Fallback */}
      {!bgLoadFailed ? (
        <img
          src={bgImage}
          alt={level.title}
          onError={() => setBgLoadFailed(true)}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-700"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#111827] via-[#1e1b4b] to-[#0f172a] pointer-events-none" />
      )}

      {/* Atmospheric overlays: subtle top vignette, soft ambient lighting, and bottom dark fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70 pointer-events-none" />

      {/* 2. Top Header Navigation (Small "Back to map" on left, "Skip" on right) */}
      <div className="relative z-30 w-full p-4 flex items-center justify-between pointer-events-auto">
        <button
          id="btn-story-back-map"
          onClick={(e) => {
            e.stopPropagation();
            sound.playButtonClick();
            onExitToMap();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/85 hover:bg-slate-900 text-slate-200 hover:text-white border border-slate-700/80 hover:border-[#2dd4bf] rounded-xl text-xs font-bold backdrop-blur-md transition-all shadow-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#2dd4bf]" />
          <span>Back to Map</span>
        </button>

        {/* Center Location Pill */}
        <div className="hidden sm:inline-flex items-center gap-2 bg-slate-950/80 border border-slate-700/80 px-3.5 py-1 rounded-full text-xs font-semibold text-slate-300 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#2dd4bf]" />
          <span>{level.location}</span>
        </div>

        <button
          id="btn-story-skip"
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-950/85 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700/80 hover:border-amber-400 rounded-xl text-xs font-bold backdrop-blur-md transition-all shadow-lg cursor-pointer"
        >
          <span>Skip</span>
          <FastForward className="w-3.5 h-3.5 text-amber-400" />
        </button>
      </div>

      {/* 3. Anime VN Character Stage (Large portraits standing on sides) */}
      <div className="relative z-20 flex-1 flex items-end justify-between px-4 sm:px-12 md:px-20 pointer-events-none pb-2">
        {/* Maya Portrait (Left Side) */}
        <div
          className={`transition-all duration-300 transform flex flex-col items-center origin-bottom ${
            isMayaSpeaking
              ? 'scale-100 opacity-100 drop-shadow-[0_0_25px_rgba(45,212,191,0.5)] z-20 translate-y-0'
              : 'scale-95 opacity-40 grayscale-[25%] z-10 translate-y-2'
          }`}
        >
          <div className="relative w-44 sm:w-60 md:w-72 h-[280px] sm:h-[370px] md:h-[430px] rounded-t-3xl overflow-hidden border-2 border-b-0 border-[#2dd4bf]/70 shadow-2xl bg-slate-900/60 backdrop-blur-sm">
            {!mayaLoadFailed ? (
              <img
                src={IMAGES.MAYA}
                alt="Maya"
                onError={() => setMayaLoadFailed(true)}
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
            ) : (
              /* Graceful anime stylized fallback card if image fails */
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-sky-900 to-slate-950 p-4 text-center">
                <span className="text-4xl mb-2">🌸</span>
                <span className="text-lg font-black text-white font-['Fredoka',sans-serif]">Maya</span>
                <span className="text-xs text-sky-300">Determined & True</span>
              </div>
            )}
            {/* Subtle bottom fade into the dialogue box */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Jay / Teacher Portrait (Right Side) */}
        <div
          className={`transition-all duration-300 transform flex flex-col items-center origin-bottom ${
            isRightSpeaking
              ? 'scale-100 opacity-100 drop-shadow-[0_0_25px_rgba(251,191,36,0.4)] z-20 translate-y-0'
              : 'scale-95 opacity-40 grayscale-[25%] z-10 translate-y-2'
          }`}
        >
          <div className="relative w-44 sm:w-60 md:w-72 h-[280px] sm:h-[370px] md:h-[430px] rounded-t-3xl overflow-hidden border-2 border-b-0 border-amber-400/70 shadow-2xl bg-slate-900/60 backdrop-blur-sm">
            {!rightLoadFailed ? (
              <img
                src={rightCharacterImage}
                alt={rightCharacterName}
                onError={() => setRightLoadFailed(true)}
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
            ) : (
              /* Graceful anime stylized fallback card if image fails */
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-amber-950 to-slate-950 p-4 text-center">
                <span className="text-4xl mb-2">✨</span>
                <span className="text-lg font-black text-white font-['Fredoka',sans-serif]">
                  {rightCharacterName}
                </span>
                <span className="text-xs text-amber-300">Friend</span>
              </div>
            )}
            {/* Subtle bottom fade into the dialogue box */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 4. Visual Novel Dialogue Box at Bottom */}
      <div className="relative z-30 w-full px-3 sm:px-6 pb-4 sm:pb-6 pointer-events-auto">
        <div className="relative w-full bg-slate-950/90 backdrop-blur-xl border-2 border-[#2dd4bf] shadow-[0_0_35px_rgba(45,212,191,0.3)] rounded-3xl p-5 sm:p-6 transition-all hover:border-[#2dd4bf] group">
          {/* Floating Character Name Tag */}
          <div
            className={`absolute -top-5 left-6 px-6 py-1.5 rounded-2xl border-2 font-black text-sm sm:text-base tracking-wide shadow-lg flex items-center gap-2 backdrop-blur-md ${
              isMayaSpeaking
                ? 'bg-slate-950 text-[#2dd4bf] border-[#2dd4bf] shadow-[0_0_15px_rgba(45,212,191,0.4)]'
                : 'bg-slate-950 text-amber-300 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full animate-ping ${
                isMayaSpeaking ? 'bg-[#2dd4bf]' : 'bg-amber-400'
              }`}
            />
            <span className="font-['Fredoka',sans-serif]">{currentLine.speaker}</span>
          </div>

          {/* Progress & Advance Hint in corner */}
          <div className="flex items-center justify-end gap-2 text-[11px] text-slate-400 mb-2">
            <span className="bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-800">
              {currentIndex + 1} / {dialogues.length}
            </span>
            <span className="hidden sm:inline text-slate-400 font-medium">
              Click, tap, or Space to continue
            </span>
          </div>

          {/* Spoken Text (Rapid Typewriter Display) */}
          <div className="min-h-[58px] sm:min-h-[64px] flex items-center">
            <p className="text-base sm:text-lg md:text-xl text-slate-100 font-medium leading-relaxed drop-shadow-sm">
              "{displayedText}"
              {isTyping && (
                <span className="inline-block w-1.5 h-4 ml-1 bg-[#2dd4bf] animate-pulse align-middle" />
              )}
            </p>
          </div>

          {/* Verified Source Attribution Tag (When line dispels myths) */}
          {currentLine.source && (
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Verified Fact Source:</span>
              <a
                href={currentLine.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-[#2dd4bf] underline hover:text-[#5eead4] font-bold transition-colors bg-[#2dd4bf]/10 px-2.5 py-0.5 rounded-lg border border-[#2dd4bf]/30"
              >
                <span>{currentLine.source}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Bottom interactive pulsing next prompt */}
          <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              {level.title} • {level.subtitle}
            </span>
            <div className="flex items-center gap-1.5 text-[#2dd4bf] font-bold group-hover:translate-x-1 transition-transform ml-auto">
              <span>{isLastLine ? 'Finish Scene' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
