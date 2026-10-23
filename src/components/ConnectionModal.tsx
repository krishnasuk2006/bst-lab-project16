/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Server, CheckCircle, AlertTriangle, X, Terminal, ExternalLink } from 'lucide-react';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  pythonUrl: string | null;
  onRefreshHealth: () => void;
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  isOpen,
  onClose,
  isConnected,
  pythonUrl,
  onRefreshHealth,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="conn-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2.5 rounded-xl ${
                isConnected
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 id="conn-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                Python BST Backend Status
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Integration status between Node.js proxy and Python Flask microservice
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Callout */}
        <div
          className={`p-4 rounded-xl border text-xs leading-relaxed mb-4 ${
            isConnected
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2 font-bold mb-1">
            {isConnected ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Active Connection to Live Python Service</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Operating in Offline Preview Mode</span>
              </>
            )}
          </div>
          <p>
            {isConnected
              ? `The frontend is successfully communicating with the Python Flask BST backend running at ${pythonUrl}. All mutations (insertions, searches, deletions) are calculated live by the Python custom Node class.`
              : `The Python BST backend is not connected. BST LAB is displaying an educational Preview tree with fictional contacts (Aarav, Diya, Kabir, Meera, Rohan) for exploration.`}
          </p>
        </div>

        {/* Technical Details */}
        <div className="space-y-3 text-xs mb-5">
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Configured URL:</span>
              <span className="text-slate-900 dark:text-white font-semibold">
                {pythonUrl || 'None (unset)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Session Isolation:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Active (Isolated per tab)
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-indigo-500" />
              How to Start Python Backend Locally:
            </span>
            <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto space-y-1">
              <p className="text-slate-400"># Navigate to python-backend/</p>
              <p>cd python-backend</p>
              <p className="text-slate-400"># Start Flask REST server</p>
              <p>python app.py</p>
            </div>
          </div>
        </div>

        {/* Disclaimer Note */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mb-5">
          Educational demo — use fictional contacts only. In-memory data is temporary and resets when services restart.
        </p>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onRefreshHealth}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Re-check Health
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
