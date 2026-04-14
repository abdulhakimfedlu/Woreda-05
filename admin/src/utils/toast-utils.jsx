import toast from 'react-hot-toast';
import React from 'react';
import { AlertCircle, HelpCircle } from 'lucide-react';

/**
 * Shows a stylized confirmation toast.
 * @param {string} message - The message to display.
 * @returns {Promise<boolean>} - Resolves to true if confirmed, false otherwise.
 */
export const confirmToast = (message) => {
  return new Promise((resolve) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-in fade-in slide-in-from-top-2 duration-300' : 'animate-out fade-out slide-out-to-top-2 duration-200'
        } max-w-md w-full bg-white shadow-2xl rounded-3xl pointer-events-auto flex flex-col border border-slate-100 overflow-hidden`}
      >
        <div className="flex-1 w-0 p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <div className="w-10 h-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center">
                <HelpCircle size={20} />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Confirmation Required</p>
              <p className="text-sm font-bold text-slate-800 tracking-tight">
                {message}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-t border-slate-50 bg-slate-50/50 p-3 gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              resolve(false);
            }}
            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 hover:text-slate-600 transition-all focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              resolve(true);
            }}
            className="flex-1 px-4 py-2.5 bg-brand text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-dark shadow-lg shadow-brand/20 hover:-translate-y-0.5 transition-all focus:outline-none"
          >
            Confirm
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
    });
  });
};
