/**
 * AIChatView.tsx
 * Level 4 "Study Buddy AI" interactive chat component.
 * Connected to /api/chat with Gemini 3.8 Flash, with instant fallback
 * to content.ts verified facts and coping strategies.
 */

import React, { useState, useRef, useEffect } from 'react';
import { LevelConfig, AI_CHAT_PROMPTS, AI_CHAT_FALLBACKS } from '../content';
import { ArrowLeft, Send, Sparkles, Bot, User, Check, RefreshCw } from 'lucide-react';
import { sound } from '../audio';

interface Message {
  id: string;
  sender: 'user' | 'buddy';
  text: string;
  time: string;
}

interface AIChatViewProps {
  level: LevelConfig;
  onChatComplete: (levelId: number) => void;
  onExitToMap: () => void;
}

export const AIChatView: React.FC<AIChatViewProps> = ({
  level,
  onChatComplete,
  onExitToMap,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'buddy',
      text: "Hello Rin! I'm your digital Study Buddy. Exam week can feel daunting, but you don't have to carry it all in your head. What's on your mind today?",
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    sound.playButtonClick();
    setInputText('');

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Call full-stack server endpoint
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-4),
        }),
      });

      const data = await res.json();

      let replyText = data?.reply;

      // Fallback matching from content.ts if server has no key or offline
      if (!replyText || data?.fallback) {
        const lower = query.toLowerCase();
        if (lower.includes('breath') || lower.includes('calm') || lower.includes('panic')) {
          replyText = AI_CHAT_FALLBACKS.breathing;
        } else if (lower.includes('helpline') || lower.includes('contact') || lower.includes('support') || lower.includes('talk')) {
          replyText = AI_CHAT_FALLBACKS.helplines;
        } else if (lower.includes('parent') || lower.includes('family') || lower.includes('pressure') || lower.includes('expect')) {
          replyText = AI_CHAT_FALLBACKS.pressure;
        } else if (lower.includes('overwhelm') || lower.includes('mountain') || lower.includes('start') || lower.includes('too much')) {
          replyText = AI_CHAT_FALLBACKS.overwhelmed;
        } else if (lower.includes('night') || lower.includes('sleep') || lower.includes('think') || lower.includes('worry')) {
          replyText = AI_CHAT_FALLBACKS.overthinking;
        } else {
          replyText = AI_CHAT_FALLBACKS.default;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `buddy-${Date.now()}`,
          sender: 'buddy',
          text: replyText,
          time: 'Just now',
        },
      ]);
    } catch {
      // Offline fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `buddy-${Date.now()}`,
          sender: 'buddy',
          text: AI_CHAT_FALLBACKS.default,
          time: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-3 flex flex-col items-center select-none">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          id="btn-chat-exit"
          onClick={onExitToMap}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Map</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            id="btn-complete-chat-level"
            onClick={() => {
              sound.playLevelComplete();
              onChatComplete(level.id);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Mark Complete & Proceed</span>
          </button>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="w-full bg-slate-900 border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
        {/* Chat Title Bar */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white font-['Fredoka',sans-serif]">Study Buddy AI</h2>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Online & Ready to support</span>
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-semibold">{level.location}</span>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 items-end ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-sky-600/30 border border-sky-500/40 text-sky-300 flex items-center justify-center text-xs shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-sky-600 text-white rounded-br-none shadow-md font-medium'
                      : 'bg-slate-800/90 text-slate-100 rounded-bl-none border border-slate-700 font-medium'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center text-xs shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2 items-center text-xs text-slate-400 italic">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
              <span>Buddy AI is reflecting on your thoughts...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Topics:</span>
          </span>
          {AI_CHAT_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              id={`btn-chat-chip-${idx}`}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-full whitespace-nowrap border border-slate-700 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2"
        >
          <input
            id="input-chat-message"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about study techniques, managing stress, or Singapore helplines..."
            className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <button
            id="btn-send-chat"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
