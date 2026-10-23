/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, ShieldAlert, Cpu, HardDrive } from 'lucide-react';

export const ComplexityTable: React.FC = () => {
  return (
    <div className="w-full space-y-6">
      {/* Overview Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Asymptotic Complexity Analysis
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Theoretical time and space bounds for an unaugmented Binary Search Tree (BST) without self-balancing rotations.
        </p>
      </div>

      {/* Main Complexity Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Operation Complexity Breakdown
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            n = total contacts, h = tree height
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 sm:px-6 font-semibold">BST Operation</th>
                <th className="py-3 px-4 sm:px-6 font-semibold text-emerald-600 dark:text-emerald-400">
                  Best Case &Omega;
                </th>
                <th className="py-3 px-4 sm:px-6 font-semibold text-blue-600 dark:text-blue-400">
                  Average Case &Theta;
                </th>
                <th className="py-3 px-4 sm:px-6 font-semibold text-rose-600 dark:text-rose-400">
                  Worst Case O
                </th>
                <th className="py-3 px-4 sm:px-6 font-semibold">Auxiliary Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-xs">
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4 sm:px-6 font-sans font-bold text-slate-900 dark:text-white">
                  Search by Name
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-emerald-600 dark:text-emerald-400">
                  &Omega;(1) <span className="text-[10px] font-sans font-normal opacity-75">(Root match)</span>
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-blue-600 dark:text-blue-400">
                  &Theta;(log n)
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-rose-600 dark:text-rose-400">
                  O(n) <span className="text-[10px] font-sans font-normal opacity-75">(Skewed tree)</span>
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-slate-600 dark:text-slate-300">
                  O(h) recursion stack
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4 sm:px-6 font-sans font-bold text-slate-900 dark:text-white">
                  Insert Contact
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-emerald-600 dark:text-emerald-400">
                  &Omega;(1) <span className="text-[10px] font-sans font-normal opacity-75">(Empty tree root)</span>
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-blue-600 dark:text-blue-400">
                  &Theta;(log n)
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-rose-600 dark:text-rose-400">
                  O(n) <span className="text-[10px] font-sans font-normal opacity-75">(Strict sorted input)</span>
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-slate-600 dark:text-slate-300">
                  O(1) iterative / O(h)
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4 sm:px-6 font-sans font-bold text-slate-900 dark:text-white">
                  Delete Contact
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-emerald-600 dark:text-emerald-400">
                  &Omega;(1) <span className="text-[10px] font-sans font-normal opacity-75">(Leaf root)</span>
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-blue-600 dark:text-blue-400">
                  &Theta;(log n)
                </td>
                <td className="py-3.5 px-4 sm:px-6 font-bold text-rose-600 dark:text-rose-400">
                  O(n) <span className="text-[10px] font-sans font-normal opacity-75">(Deepest skewed node)</span>
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-slate-600 dark:text-slate-300">
                  O(h) recursion stack
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4 sm:px-6 font-sans font-bold text-slate-900 dark:text-white">
                  In-Order Traversal
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-slate-700 dark:text-slate-300">
                  &Theta;(n)
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-slate-700 dark:text-slate-300">
                  &Theta;(n)
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-slate-700 dark:text-slate-300">
                  &Theta;(n) <span className="text-[10px] font-sans font-normal opacity-75">(Visits all n nodes)</span>
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-slate-600 dark:text-slate-300">
                  O(h) call stack + O(n) list
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors bg-slate-50/40 dark:bg-slate-950/20">
                <td className="py-3.5 px-4 sm:px-6 font-sans font-bold text-slate-900 dark:text-white">
                  Total Tree Storage
                </td>
                <td colSpan={3} className="py-3.5 px-4 sm:px-6 text-center font-bold text-indigo-600 dark:text-indigo-400">
                  O(n)
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-slate-600 dark:text-slate-300">
                  Each node: payload + 2 pointers
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Academic Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Honest Evaluation: BST &ne; Guaranteed O(log n)</span>
          </div>
          <p className="leading-relaxed">
            In viva examinations, examiners frequently ask whether a Binary Search Tree always provides O(log n) time. The correct answer is <strong>no</strong>. Logarithmic bounds only hold when the tree remains approximately balanced. Without auto-balancing (like AVL or Red-Black trees), consecutive sorted inserts degrade performance to O(n).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold">
            <HardDrive className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Auxiliary Space vs Output Storage</span>
          </div>
          <p className="leading-relaxed">
            While traversing the tree, the recursive call stack consumes <strong>O(h)</strong> auxiliary frames. In addition, when the backend collects and returns the contacts list to the web client, the returned payload consumes <strong>O(n)</strong> memory.
          </p>
        </div>
      </div>
    </div>
  );
};
