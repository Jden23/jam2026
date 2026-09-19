/**
 * AIChatView.tsx
 * Level 6 "Safe Space Chat" interactive chat component.
 * Discussion on peer pressure, refusal skills, and vape/drug myths.
 * (Study mentor persona completely removed).
 */

import React, { useState, useRef, useEffect } from 'react';
import { LevelConfig, AI_CHAT_PROMPTS } from '../content';
import { ArrowLeft, Send, Sparkles, MessageCircle, User, Check, RefreshCw } from 'lucide-react';
import { sound } from '../audio';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
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
      sender: 'assistant',
      text: "Hey Maya! This is an open, judgment-free space to talk through peer pressure, practice how to say no, or discuss myths about vapes and drugs. What's on your mind?",
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
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-4),
        }),
      });

      const data = await res.json();
      const replyText =
        data?.reply ||
        "Standing your ground takes real courage. Remember: real friends will always respect your choices and boundaries.";

      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          time: 'Just now',
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: "When facing peer pressure, keeping your response simple like 'No thanks, not my thing' is often the most effective. Real friends respect your boundaries.",
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
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white font-['Fredoka',sans-serif]">
                Safe Space Chat
              </h2>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Confidential & Non-judgmental</span>
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
                    <MessageCircle className="w-3.5 h-3.5" />
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
              <span>Thinking...</span>
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
            placeholder="Ask about dealing with peer pressure, saying no, or common myths..."
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
