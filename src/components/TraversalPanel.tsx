/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, ArrowRight, Sparkles, Check, Copy } from 'lucide-react';
import { Contact } from '../services/api';

interface TraversalPanelProps {
  contacts: Contact[];
  onSelectContact: (name: string) => void;
}

export const TraversalPanel: React.FC<TraversalPanelProps> = ({
  contacts,
  onSelectContact,
}) => {
  const [copied, setCopied] = useState(false);

  const copySequence = () => {
    const text = contacts.map((c) => c.name).join(' -> ');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 sm:p-6 transition-colors space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                In-Order BST Traversal Sequence
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Algorithm: Left Subtree &rarr; Root Node &rarr; Right Subtree
              </p>
            </div>
          </div>
        </div>

        {contacts.length > 0 && (
          <button
            onClick={copySequence}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied Sequence</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Sequence</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Traversal Academic Principle Note */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        <p>
          <strong className="text-indigo-600 dark:text-indigo-400">Fundamental BST Property:</strong> In-order traversal visits the left subtree (all keys strictly smaller), then the current node, then the right subtree (all keys strictly larger). Because every subtree satisfies this recursive ordering invariant, the resulting traversal sequence is guaranteed to be strictly sorted alphabetically.
        </p>
      </div>

      {/* Animated / Step Chip Sequence */}
      {contacts.length === 0 ? (
        <div className="p-6 text-center text-slate-400 text-xs italic border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          The tree is currently empty. In-order traversal yields an empty list [].
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 p-4 rounded-xl bg-slate-100/70 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            {contacts.map((contact, idx) => (
              <React.Fragment key={contact.key}>
                <button
                  type="button"
                  onClick={() => onSelectContact(contact.name)}
                  title={`Trace ${contact.name} in visualizer`}
                  className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-indigo-500 hover:scale-105 transition-all text-xs cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-mono font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <div className="text-left">
                    <span className="font-bold text-slate-800 dark:text-slate-100 block">
                      {contact.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      key: &quot;{contact.key}&quot;
                    </span>
                  </div>
                </button>
                {idx < contacts.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 px-1">
            <span>Time Complexity: O(n) visits every node exactly once</span>
            <span>Auxiliary Space: O(h) recursion stack</span>
          </div>
        </div>
      )}
    </div>
  );
};
