/**
 * HelplinesModal.tsx -> "Facts & Help"
 * Displays verified drug prevention myths, facts, Singapore fact,
 * and verified help contacts with two tabs: Facts and Help Contacts.
 * Source name and link are shown wherever a fact appears.
 */

import React, { useState } from 'react';
import { MYTHS_AND_FACTS, SINGAPORE_FACT, HELP_CONTACTS } from '../content';
import { X, Heart, ExternalLink, Phone, ShieldCheck, BookOpen, AlertCircle } from 'lucide-react';

interface HelplinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'facts' | 'help';
}

export const HelplinesModal: React.FC<HelplinesModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'facts',
}) => {
  const [activeTab, setActiveTab] = useState<'facts' | 'help'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white font-['Fredoka',sans-serif]">
                Facts & Help
              </h2>
              <p className="text-xs text-slate-400">
                Verified drug and vape facts, plus confidential help contacts
              </p>
            </div>
          </div>
          <button
            id="btn-close-facts-help-modal"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 pb-2 bg-slate-950/90 border-b border-slate-800 flex gap-2">
          <button
            id="tab-facts"
            onClick={() => setActiveTab('facts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-colors cursor-pointer ${
              activeTab === 'facts'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Facts</span>
          </button>
          <button
            id="tab-help"
            onClick={() => setActiveTab('help')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-colors cursor-pointer ${
              activeTab === 'help'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Help Contacts</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {activeTab === 'facts' && (
            <div className="space-y-4">
              {/* Singapore Fact Highlight */}
              <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border border-amber-500/40 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-500/30">
                    Singapore Fact
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-100 mb-2">
                  "{SINGAPORE_FACT.fact}"
                </p>
                <div className="flex items-center gap-1 text-xs text-amber-300/90 font-medium">
                  <span>Source:</span>
                  <a
                    href={SINGAPORE_FACT.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 underline hover:text-amber-200"
                  >
                    <span>{SINGAPORE_FACT.source}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Myths and Facts List */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>Myths & Facts:</span>
                </h3>

                {MYTHS_AND_FACTS.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 transition-all hover:border-slate-700"
                  >
                    {/* Myth Tag */}
                    <div className="mb-2">
                      <span className="text-[10px] font-black uppercase text-rose-400 bg-rose-950/70 px-2 py-0.5 rounded-md border border-rose-500/30 mr-2">
                        Myth
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-rose-200">
                        "{item.myth}"
                      </span>
                    </div>

                    {/* Fact Tag */}
                    <div className="mb-2 pl-2 border-l-2 border-emerald-500">
                      <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-500/30 mr-2">
                        Fact
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-emerald-100">
                        "{item.fact}"
                      </span>
                    </div>

                    {/* Source Name & Link */}
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
                      <span>Source:</span>
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sky-400 underline hover:text-sky-300"
                      >
                        <span>{item.source}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="space-y-3.5">
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  Confidential, non-judgmental support services in Singapore for youth and families.
                </span>
              </div>

              {HELP_CONTACTS.map((contact, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white font-['Fredoka',sans-serif]">
                        {contact.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                        {contact.details}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Source:</span>
                      <a
                        href={contact.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-sky-400 underline hover:text-sky-300"
                      >
                        <span>{contact.source}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Phone Action */}
                  <a
                    href={`tel:${contact.phone.replace(/[\s-]/g, '')}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all self-start sm:self-auto shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5 fill-current" />
                    <span>{contact.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Source links verified from HealthHub, CNB, NAMS, NCADA
          </span>
          <button
            id="btn-close-facts-help-footer"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
