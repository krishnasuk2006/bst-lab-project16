/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  GitBranch,
  Search,
  Trash2,
  Layers,
  ArrowUpRight,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  tagline: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const LearningMode: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string>('what-is-bst');

  const topics: Topic[] = [
    {
      id: 'what-is-bst',
      title: 'A. What is a Binary Search Tree (BST)?',
      tagline: 'The ordering invariant that enables logarithmic search.',
      icon: <GitBranch className="w-5 h-5 text-indigo-500" />,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            A <strong>Binary Search Tree</strong> is a hierarchical, node-based binary tree data structure where each node stores a key (in our project, the normalized lowercase contact name) and at most two child pointers (<code className="font-mono">left</code> and <code className="font-mono">right</code>).
          </p>
          <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 font-mono text-xs">
            <strong>The BST Ordering Invariant:</strong>
            <ul className="list-disc list-inside mt-1.5 space-y-1">
              <li>All keys in the <strong>Left Subtree</strong> are strictly smaller: <code className="text-blue-600 dark:text-blue-400">key(left) &lt; key(node)</code></li>
              <li>All keys in the <strong>Right Subtree</strong> are strictly larger: <code className="text-purple-600 dark:text-purple-400">key(right) &gt; key(node)</code></li>
              <li>Both left and right subtrees must themselves be valid Binary Search Trees.</li>
            </ul>
          </div>
          <p>
            Example: If the root is <span className="font-bold text-slate-900 dark:text-white">&quot;M&quot;</span>, then <span className="font-bold text-blue-600">&quot;A&quot;</span> must be placed in the left subtree because <code className="font-mono">&apos;a&apos; &lt; &apos;m&apos;</code>, while <span className="font-bold text-purple-600">&quot;T&quot;</span> and <span className="font-bold text-purple-600">&quot;Z&quot;</span> must be placed in the right subtree.
          </p>
        </div>
      ),
    },
    {
      id: 'insertion',
      title: 'B. The Insertion Algorithm',
      tagline: 'How binary comparisons locate the correct leaf insertion slot.',
      icon: <GitBranch className="w-5 h-5 text-blue-500" />,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            To insert a contact into the BST:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 font-sans">
            <li>Start at the <strong>root node</strong>. If the tree is empty (<code className="font-mono">root == None</code>), create the node and set it as root.</li>
            <li>Compare the new contact&apos;s case-insensitive key with the current node&apos;s key:
              <ul className="list-disc list-inside ml-5 mt-1 space-y-0.5 text-xs">
                <li><strong>Equal:</strong> Update the contact details in-place (case-insensitive duplicate policy).</li>
                <li><strong>Smaller (&lt;):</strong> Branch left. If <code className="font-mono">current.left</code> is empty, attach the new node here. Otherwise, move to <code className="font-mono">current.left</code> and repeat.</li>
                <li><strong>Larger (&gt;):</strong> Branch right. If <code className="font-mono">current.right</code> is empty, attach the new node here. Otherwise, move to <code className="font-mono">current.right</code> and repeat.</li>
              </ul>
            </li>
          </ol>
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 font-mono text-xs text-slate-700 dark:text-slate-300">
            Time Complexity: O(h), where h is the tree height. Average O(log n), worst case O(n) if inserted in sorted order.
          </div>
        </div>
      ),
    },
    {
      id: 'searching',
      title: 'C. Searching for Contacts',
      tagline: 'Eliminating half of the remaining subtrees at every decision.',
      icon: <Search className="w-5 h-5 text-emerald-500" />,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Searching utilizes the BST invariant to discard entire branches of contacts without checking them:
          </p>
          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
            <span className="font-bold text-emerald-900 dark:text-emerald-200">Trace Example: Search for &quot;Diya&quot; in sample tree</span>
            <div className="font-mono text-[11px] space-y-0.5 text-emerald-800 dark:text-emerald-300">
              <div>1. Compare with Root &quot;Kabir&quot;: &apos;diya&apos; &lt; &apos;kabir&apos; &rarr; <strong>Go Left</strong></div>
              <div>2. Compare with &quot;Diya&quot;: &apos;diya&apos; == &apos;diya&apos; &rarr; <strong>Match Found in 2 comparisons!</strong></div>
              <div className="opacity-75">(The entire right subtree containing Meera and Rohan was never touched!)</div>
            </div>
          </div>
          <p>
            If a child pointer is <code className="font-mono">None</code> before finding the key, the search terminates: the contact is not in the directory.
          </p>
        </div>
      ),
    },
    {
      id: 'deletion',
      title: 'D. The 4 Cases of BST Deletion',
      tagline: 'Handling leaf removal, single child bypass, and 2-child successor substitution.',
      icon: <Trash2 className="w-5 h-5 text-rose-500" />,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Deletion is the most intricate BST operation because the tree invariant must remain intact after removing a node:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block text-xs mb-1">
                Case 1: Leaf Node (0 children)
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The node has no children. The parent simply resets its pointer to <code className="font-mono">None</code>.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block text-xs mb-1">
                Case 2 & 3: Single Child (Left or Right)
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The node has exactly one child. Splice out the node by linking the parent directly to the child.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 md:col-span-2">
              <span className="font-bold text-rose-900 dark:text-rose-200 block text-xs mb-1">
                Case 4: Two Children (The In-Order Successor Technique)
              </span>
              <p className="text-xs text-rose-800 dark:text-rose-300">
                When a node has two children, it cannot be simply removed. We find its <strong>in-order successor</strong> (the minimum key in its right subtree), copy the successor&apos;s contact payload into the target node, and then recursively delete the successor from the right subtree (which is guaranteed to have at most one child!).
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'traversal',
      title: 'E. In-Order Traversal & Alphabetical Order',
      tagline: 'Why recursive depth-first traversal guarantees sorted output.',
      icon: <Layers className="w-5 h-5 text-indigo-500" />,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            In-order traversal visits nodes in the strict sequence:
          </p>
          <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 font-mono text-center text-xs font-bold text-indigo-700 dark:text-indigo-300">
            Traverse Left Subtree &rarr; Visit Current Node &rarr; Traverse Right Subtree
          </div>
          <p>
            Since every node in the left subtree has a key smaller than the current node, and every node in the right subtree has a key larger, this recursive ordering directly flattens the two-dimensional tree into a strictly sorted 1D list in <strong>O(n) time</strong>.
          </p>
        </div>
      ),
    },
    {
      id: 'height',
      title: 'F. Tree Height & Operation Costs',
      tagline: 'Understanding the academic height convention and path bounds.',
      icon: <ArrowUpRight className="w-5 h-5 text-purple-500" />,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            In university coursework, tree height measures the number of levels from root to deepest leaf:
          </p>
          <ul className="list-disc list-inside space-y-1 font-mono text-xs">
            <li>Empty tree (<code className="font-mono">root is None</code>): Height = 0</li>
            <li>Single root node: Height = 1</li>
            <li>Recursive definition: <code className="font-mono">height = 1 + max(height(left), height(right))</code></li>
          </ul>
          <p>
            The maximum number of comparisons needed for any search, insertion, or deletion is bounded by the height <code className="font-mono">h</code>. In a balanced tree with <code className="font-mono">n</code> nodes, <code className="font-mono">h &asymp; log2(n)</code>.
          </p>
        </div>
      ),
    },
    {
      id: 'limitations',
      title: 'G. BST Limitations & Skewed Degeneration',
      tagline: 'Why ordinary BSTs require balanced trees (AVL / Red-Black) in production.',
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            A standard Binary Search Tree has a major vulnerability: <strong>insertion order dictates tree shape</strong>.
          </p>
          <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 space-y-1.5">
            <strong>The Degenerate / Skewed Tree Problem:</strong>
            <p>
              If contacts are inserted in already sorted order (e.g. &quot;Aarav&quot;, &quot;Diya&quot;, &quot;Kabir&quot;, &quot;Meera&quot;, &quot;Rohan&quot;), every new node is appended to the right. The tree degenerates into a singly linked list with height <code className="font-mono">h = n</code>!
            </p>
            <p>
              In this worst-case scenario, search degrades from <code className="font-mono">O(log n)</code> to linear time <code className="font-mono">O(n)</code>. This is why self-balancing trees like AVL and Red-Black trees were invented.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            BST Learning Laboratory
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Core concepts, algorithm steps, and viva explanations for B.Tech Semester 3 Data Structures.
        </p>
      </div>

      <div className="space-y-3">
        {topics.map((topic) => {
          const isExpanded = expandedId === topic.id;
          return (
            <div
              key={topic.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? '' : topic.id)}
                aria-expanded={isExpanded}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                    {topic.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {topic.tagline}
                    </p>
                  </div>
                </div>
                <div className="text-slate-400 shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/20 animate-in fade-in duration-200">
                  {topic.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
