/**
 * HelplinesModal.tsx
 * Support & Information Modal.
 * Clean placeholder for verified resources provided by the user.
 * (No unverified facts, statistics, or phone numbers).
 */

import React from 'react';
import { X, Heart, ShieldCheck } from 'lucide-react';

interface HelplinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelplinesModal: React.FC<HelplinesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl max-w-lg w-full flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white font-['Fredoka',sans-serif]">
                Support & Resources
              </h2>
              <p className="text-xs text-slate-400">
                Buddy Up: Standing Your Ground
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

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-center">
            <ShieldCheck className="w-10 h-10 text-sky-400 mx-auto mb-2.5" />
            <h3 className="text-sm font-black text-white mb-1.5 font-['Fredoka',sans-serif]">
              Standing Together
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              If you or a friend are ever feeling pressured or unsure about vapes or substances, remember that true friends will always respect your choices and boundaries.
            </p>
          </div>

          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3.5 text-xs text-slate-400 text-center">
            Verified youth support helplines and resources will be listed here.
          </div>
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
