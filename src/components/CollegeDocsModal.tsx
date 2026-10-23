/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Presentation,
  HelpCircle,
  Server,
  BookMarked,
  X,
  Copy,
  Check,
  Download,
} from 'lucide-react';

interface CollegeDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CollegeDocsModal: React.FC<CollegeDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeDoc, setActiveDoc] = useState<'report' | 'viva' | 'demo' | 'api' | 'deploy'>('report');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="college-docs-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs"
    >
      <div className="w-full max-w-5xl h-[88vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 id="college-docs-title" className="text-base sm:text-lg font-bold">
                Project 16 — College Coursework & Viva Kit
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                B.Tech Semester 3 Data Structures & Algorithms Mini-Project Documentation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close documentation modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950/40 px-4 gap-1 sm:gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveDoc('report')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeDoc === 'report'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>Academic Project Report (5-8 Pages)</span>
          </button>

          <button
            onClick={() => setActiveDoc('viva')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeDoc === 'viva'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Viva Voce Q&amp;A Guide</span>
          </button>

          <button
            onClick={() => setActiveDoc('demo')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeDoc === 'demo'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>5-10 Min Demo Script</span>
          </button>

          <button
            onClick={() => setActiveDoc('api')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeDoc === 'api'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>API Specification</span>
          </button>

          <button
            onClick={() => setActiveDoc('deploy')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeDoc === 'deploy'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Deployment Guide</span>
          </button>
        </div>

        {/* Document Content Viewer */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          {/* ================= REPORT TAB ================= */}
          {activeDoc === 'report' && (
            <article className="prose dark:prose-invert max-w-none space-y-5">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Course Project Report · Course Code: CS201 / IT201 Data Structures
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  Design and Implementation of a Binary Search Tree (BST) Based Contact Management and Visualization Platform
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Assignment No: 16 | Category: Non-Linear Data Structures / Tree Algorithms
                </p>
              </div>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Introduction</h2>
                <p>
                  A Binary Search Tree (BST) is a hierarchical non-linear data structure capable of maintaining dynamic ordered sets. Unlike linear arrays that require <code>O(n)</code> insertion shifting or linked lists that require <code>O(n)</code> sequential scanning, a balanced BST organizes data such that search, insertion, and deletion operate in <code>O(log n)</code> time. This project implements a real-world contact management application where contacts are indexed alphabetically by a custom BST with left and right node pointers.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Problem Statement</h2>
                <p>
                  To design and implement a contact directory from first principles using an explicit Binary Search Tree in Python 3. The system must support real-time contact insertion with duplicate key updating, search with step-by-step traversal path reporting, deletion handling all 4 structural cases, and sorted alphabetical display via recursive in-order traversal.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Objectives</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li>Implement custom <code>ContactNode</code> and <code>BinarySearchTree</code> classes without relying on built-in associative arrays (dictionaries) or library trees.</li>
                  <li>Enforce strict case-insensitive alphabetical key ordering.</li>
                  <li>Implement the 4 deletion cases: leaf, single left child, single right child, and two children with in-order successor substitution.</li>
                  <li>Provide an interactive web-based visualizer rendering real-time SVG representations directly from serialized backend tree states.</li>
                  <li>Maintain per-visitor session isolation so multiple users cannot mutate or view each other&apos;s trees.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Data Structure Architecture</h2>
                <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl font-mono text-xs">
                  <pre>{`class ContactNode:
    name: str               # Original casing (e.g. "Kabir")
    phone: str              # Contact phone number
    email: str              # Contact email address
    key: str                # Normalized lowercase search key ("kabir")
    left: Optional[Node]    # Pointer to left child (keys < key)
    right: Optional[Node]   # Pointer to right child (keys > key)`}</pre>
                </div>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">5. Deletion Cases</h2>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li><strong>Case 1 (Leaf):</strong> If node has no children, the parent pointer is set to <code>None</code>.</li>
                  <li><strong>Case 2 (Right Child Only):</strong> Spliced out; parent points directly to <code>node.right</code>.</li>
                  <li><strong>Case 3 (Left Child Only):</strong> Spliced out; parent points directly to <code>node.left</code>.</li>
                  <li><strong>Case 4 (Two Children):</strong> Find in-order successor (minimum node in right subtree). Successor&apos;s data is copied to the node, and the successor is deleted from the right subtree.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">6. Conclusion &amp; Scope for Extension</h2>
                <p>
                  The project demonstrates the practical application of non-linear data structures in building searchable directory systems. Future extensions include implementing self-balancing AVL tree rotations (LL, RR, LR, RL) to eliminate the worst-case <code>O(n)</code> degeneration of unbalanced BSTs.
                </p>
              </section>

              <section className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                <p><strong>Individual Contribution Placeholders:</strong></p>
                <p>Student Name: [Student Name Here] | Roll Number: [Roll Number Here] | Branch: Computer Science &amp; Engineering | Section: [Section]</p>
              </section>
            </article>
          )}

          {/* ================= VIVA TAB ================= */}
          {activeDoc === 'viva' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Top 10 Viva Voce Questions &amp; Model Answers
                </h3>
                <p className="text-xs text-slate-500">
                  Crisp, confident answers tailored for a second-year engineering student during oral examination.
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-indigo-600 dark:text-indigo-400">
                    Q1. What is the fundamental property of a Binary Search Tree?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Answer:</strong> For every node <code>X</code>, all keys in its left subtree are strictly less than <code>key(X)</code>, and all keys in its right subtree are strictly greater than <code>key(X)</code>. Both subtrees must also be binary search trees.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-indigo-600 dark:text-indigo-400">
                    Q2. Why does in-order traversal of a BST produce sorted order?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Answer:</strong> In-order traversal visits nodes in the sequence: Left Subtree &rarr; Root &rarr; Right Subtree. Since all left descendants are smaller than the root and all right descendants are larger, recursively applying this visit order outputs all keys in strictly ascending alphabetical order.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-indigo-600 dark:text-indigo-400">
                    Q3. Why is the height of an empty tree defined as 0 and a single root as 1?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Answer:</strong> By academic convention, height is the number of node levels along the longest path from the root to a leaf. An empty tree has zero levels (0), a tree with only the root has one level (1), and the recurrence is <code>height = 1 + max(h(left), h(right))</code>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-indigo-600 dark:text-indigo-400">
                    Q4. How do you delete a node with two children?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Answer:</strong> We locate the in-order successor (the node with the smallest key in the right subtree). We copy the successor&apos;s contact fields into the current node, then recursively delete the successor from the right subtree. The successor is guaranteed to have at most one child (a right child), simplifying its deletion.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-indigo-600 dark:text-indigo-400">
                    Q5. Can a BST search operation take O(n) time? When does that occur?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Answer:</strong> Yes. If contacts are inserted in strictly sorted order (e.g., A, B, C, D), every node is placed in the right child pointer. The tree degenerates into a singly linked list with height <code>h = n</code>, degrading search to <code>O(n)</code> worst-case time.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= DEMO SCRIPT TAB ================= */}
          {activeDoc === 'demo' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  5-10 Minute Live Demonstration Script
                </h3>
                <p className="text-xs text-slate-500">
                  Step-by-step presentation walkthrough for lab assessment and viva presentation.
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">
                    Minute 1-2: Problem Statement &amp; Architecture
                  </strong>
                  <p>
                    &quot;Respected examiner, our project is Project 16: BST-Based Contact Manager &amp; Interactive Visualizer. In this project, we implemented an in-memory Binary Search Tree from scratch in Python with custom Node classes and left/right pointers. We have connected it to an interactive web visualizer to illustrate tree operations live.&quot;
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">
                    Minute 3-4: Live Insertion &amp; In-Order Traversal
                  </strong>
                  <p>
                    &quot;Notice our root node is Kabir. When we insert Diya, because &apos;diya&apos; comes before &apos;kabir&apos; alphabetically, the algorithm branches left. When we insert Meera, it branches right. In the In-Order Traversal tab, the system traverses Left &rarr; Root &rarr; Right, producing our contacts in alphabetical sequence: Aarav, Diya, Kabir, Meera, Rohan.&quot;
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">
                    Minute 5-6: Live Search Path Tracing
                  </strong>
                  <p>
                    &quot;Now, let us search for &apos;Aarav&apos;. The visualizer highlights each comparison step: starting at Root &apos;Kabir&apos;, branching left to &apos;Diya&apos;, then left again to find &apos;Aarav&apos; in exactly 3 comparisons. The right subtree was eliminated from search entirely.&quot;
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">
                    Minute 7-8: Deletion Case 4 (Two Children)
                  </strong>
                  <p>
                    &quot;Finally, we demonstrate deletion. If we delete root &apos;Kabir&apos; (which has two children), the algorithm finds the in-order successor in the right subtree (&apos;Meera&apos;), copies its data to the root, and deletes the successor node, preserving the BST invariant.&quot;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= API TAB ================= */}
          {activeDoc === 'api' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  REST API Contract
                </h3>
                <p className="text-xs text-slate-500">
                  Formal JSON endpoints exposed by the Python Flask microservice and proxied by Node.js.
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-lg">
                  <span className="text-emerald-600 font-bold">GET</span> /api/health — Checks microservice health
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-lg">
                  <span className="text-emerald-600 font-bold">GET</span> /api/state — Returns in-order contacts, serialized SVG tree, and stats
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-lg">
                  <span className="text-blue-600 font-bold">POST</span> /api/contacts — Inserts or updates contact (&#123;name, phone, email&#125;)
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-lg">
                  <span className="text-emerald-600 font-bold">GET</span> /api/contacts/search?name=... — Searches contact &amp; returns traversal path
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-lg">
                  <span className="text-rose-600 font-bold">DELETE</span> /api/contacts/:name — Deletes contact by key
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-lg">
                  <span className="text-blue-600 font-bold">POST</span> /api/demo — Re-seeds standard 5 demo contacts
                </div>
                <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-lg">
                  <span className="text-blue-600 font-bold">POST</span> /api/reset — Clears tree to empty state
                </div>
              </div>
            </div>
          )}

          {/* ================= DEPLOY TAB ================= */}
          {activeDoc === 'deploy' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Deployment Architecture &amp; Guide
                </h3>
                <p className="text-xs text-slate-500">
                  How to deploy the React/Node frontend and the Python Flask backend to separate services.
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <p>
                  To host BST LAB publicly on the web (e.g. for college portfolio or college website integration):
                </p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    <strong>Deploy Python Flask Backend:</strong> Deploy <code>python-backend/</code> to a Python PaaS like Render, Railway, or Fly.io with start command: <code>gunicorn -w 2 -b 0.0.0.0:$PORT app:app</code>.
                  </li>
                  <li>
                    <strong>Copy Backend HTTPS URL:</strong> Note down the assigned public URL (e.g. <code>https://bst-lab-python.onrender.com</code>).
                  </li>
                  <li>
                    <strong>Set Environment Variable:</strong> In your frontend hosting platform (or <code>.env</code>), set:
                    <div className="mt-1 p-2 bg-slate-100 dark:bg-slate-950 rounded font-mono text-xs">
                      PYTHON_BST_API_URL=https://bst-lab-python.onrender.com
                    </div>
                  </li>
                  <li>
                    <strong>Deploy Node.js/React Frontend:</strong> Build with <code>npm run build</code> and run <code>npm start</code>. The Node proxy automatically forwards API requests securely.
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            All files are also available as Markdown files in the project root directory.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
