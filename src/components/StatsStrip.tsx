/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, GitCommit, ArrowUpRight, Clock, HelpCircle } from 'lucide-react';
import { TreeStats } from '../services/api';

interface StatsStripProps {
  stats: TreeStats;
  lastOperation: string;
  isBackendConnected: boolean;
}

export const StatsStrip: React.FC<StatsStripProps> = ({
  stats,
  lastOperation,
  isBackendConnected,
}) => {
  return (
    <section
      aria-label="Tree Statistics Strip"
      className="w-full bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200/80 dark:border-slate-800/80 py-3 px-4 sm:px-6 lg:px-8 transition-colors"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Stat 1: Total Contacts */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Users className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Total Contacts
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                {stats.count}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">nodes (n)</span>
            </div>
          </div>
        </div>

        {/* Stat 2: Tree Height */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="relative group flex-1">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Tree Height
              </span>
              <div
                title="Academic standard: Empty tree = 0, Single root = 1, h = 1 + max(h_left, h_right)"
                className="cursor-help text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                {stats.height}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                level{stats.height !== 1 ? 's' : ''} (h)
              </span>
            </div>
          </div>
        </div>

        {/* Stat 3: Root Node */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <GitCommit className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Root Node
            </span>
            <div className="truncate text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {stats.root ? (
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{stats.root}</span>
              ) : (
                <span className="text-slate-400 italic font-normal text-sm">None (Tree is empty)</span>
              )}
            </div>
          </div>
        </div>

        {/* Stat 4: Last Operation */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
            <Clock className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Last Operation
            </span>
            <div
              className="truncate text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300"
              title={lastOperation}
            >
              {lastOperation || 'System initialized'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
