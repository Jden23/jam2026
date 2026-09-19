/**
 * HelplinesModal.tsx
 * Comprehensive directory of 100% genuine Singapore youth helplines
 * and evidence-based wellness facts loaded strictly from content.ts.
 */

import React, { useState } from 'react';
import { SINGAPORE_HELPLINES, WELLNESS_FACTS, WELLNESS_CARDS } from '../content';
import { X, Phone, Heart, ExternalLink, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

interface HelplinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelplinesModal: React.FC<HelplinesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'helplines' | 'facts' | 'cards'>('helplines');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white font-['Fredoka',sans-serif]">
                Singapore Youth Support & Study Facts
              </h2>
              <p className="text-xs text-slate-400">
                Verified genuine resources for Singapore secondary and JC students.
              </p>
            </div>
          </div>
          <button
            id="btn-close-helplines-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-2 gap-2">
          <button
            id="tab-helplines"
            onClick={() => setActiveTab('helplines')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'helplines'
                ? 'border-rose-400 text-rose-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>Singapore Helplines (24/7)</span>
            </span>
          </button>

          <button
            id="tab-facts"
            onClick={() => setActiveTab('facts')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'facts'
                ? 'border-sky-400 text-sky-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Science-Backed Facts</span>
            </span>
          </button>

          <button
            id="tab-cards"
            onClick={() => setActiveTab('cards')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'cards'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Coping Strategy Cards</span>
            </span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'helplines' && (
            <div className="space-y-3.5">
              <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-3 text-xs text-rose-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  All listed services are 100% confidential and free for Singapore youths. You never have to deal with intense stress alone.
                </span>
              </div>

              {SINGAPORE_HELPLINES.map((h, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                    <h3 className="text-sm font-black text-white">{h.name}</h3>
                    <span className="text-[11px] font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-500/30 self-start sm:self-auto">
                      {h.availableHours}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-2">{h.tagline}</p>

                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {h.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800/80 gap-2 text-xs">
                    <span className="font-bold text-sky-400">
                      Contact: {h.contactDetail}
                    </span>
                    <a
                      href={h.website}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-sky-300 transition-colors"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'facts' && (
            <div className="space-y-3.5">
              {WELLNESS_FACTS.map((fact) => (
                <div
                  key={fact.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded-full border border-sky-500/30">
                      {fact.category}
                    </span>
                    <span className="text-[11px] text-slate-500">{fact.source}</span>
                  </div>

                  <h3 className="text-sm font-black text-white mt-1 mb-1 font-['Fredoka',sans-serif]">
                    {fact.title}
                  </h3>

                  <p className="text-xs font-semibold text-emerald-400 mb-2">
                    {fact.summary}
                  </p>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {fact.fact}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'cards' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {WELLNESS_CARDS.map((card) => (
                <div
                  key={card.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-black text-amber-300 font-['Fredoka',sans-serif]">
                        {card.name}
                      </h3>
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        {card.bonus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 italic mb-2">
                      "{card.quote}"
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                    Unlocked Coping Strategy
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            id="btn-close-helplines-footer"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
