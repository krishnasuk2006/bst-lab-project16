/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  Trash2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Info,
  Loader2,
} from 'lucide-react';
import { validateContactForm } from '../utils/treeLayout';
import { Contact, SearchResponse } from '../services/api';

interface OperationPanelProps {
  contacts: Contact[];
  onInsert: (contact: { name: string; phone: string; email: string }) => Promise<void>;
  onSearch: (name: string) => Promise<SearchResponse | null>;
  onDeleteRequest: (name: string) => void;
  isBackendConnected: boolean;
  isMutating: boolean;
  onClearHighlights: () => void;
}

export const OperationPanel: React.FC<OperationPanelProps> = ({
  contacts,
  onInsert,
  onSearch,
  onDeleteRequest,
  isBackendConnected,
  isMutating,
  onClearHighlights,
}) => {
  const [activeTab, setActiveTab] = useState<'insert' | 'search' | 'delete'>('search');

  // Insert form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState('');

  // Handle Insert Submission
  const handleInsertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContactForm(name, phone, email);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    await onInsert({ name, phone, email });
    setName('');
    setPhone('');
    setEmail('');
  };

  // Handle Search Submission
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchQuery.trim();
    if (!clean) return;
    setIsSearching(true);
    try {
      const res = await onSearch(clean);
      setSearchResult(res);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col transition-colors">
      {/* Operation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
        <button
          onClick={() => {
            setActiveTab('search');
            onClearHighlights();
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'search'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('insert');
            onClearHighlights();
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'insert'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Insert</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('delete');
            onClearHighlights();
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'delete'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>

      <div className="p-5 flex-1">
        {/* ================= SEARCH TAB ================= */}
        {activeTab === 'search' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Lookup by Contact Name
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluates left/right branch decisions and highlights the path from root.
              </p>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter name (e.g., Aarav, Meera, Kabir)..."
                  aria-label="Contact name to search"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs disabled:opacity-50 transition-colors flex items-center gap-1.5"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
              </button>
            </form>

            {/* Quick Suggestions Chips */}
            {contacts.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400">Try:</span>
                {contacts.slice(0, 5).map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => {
                      setSearchQuery(c.name);
                      onSearch(c.name).then((res) => setSearchResult(res));
                    }}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}

            {/* Search Result Card & Comparisons Breakdown */}
            {searchResult && (
              <div
                className={`p-3.5 rounded-xl border animate-in fade-in duration-200 ${
                  searchResult.found
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-100'
                    : 'bg-amber-50/70 border-amber-200 text-amber-950 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-100'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {searchResult.found ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold">
                        {searchResult.found ? 'Match Found!' : 'Contact Not Found'}
                      </h4>
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-current">
                        {searchResult.comparisons} comparison{searchResult.comparisons !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-xs mt-1 leading-relaxed">{searchResult.message}</p>

                    {/* Step-by-Step Traversal Steps */}
                    {searchResult.steps && searchResult.steps.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-black/10 dark:border-white/10">
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-75 block mb-1.5">
                          Traversal Path Taken:
                        </span>
                        <div className="space-y-1 font-mono text-[11px]">
                          {searchResult.steps.map((st, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-[9px] font-bold shrink-0">
                                {i + 1}
                              </span>
                              <span className="font-semibold">{st.node}</span>
                              <span className="opacity-60 text-[10px]">:</span>
                              <span className="opacity-90">{st.comparison}</span>
                              <ArrowRight className="w-3 h-3 opacity-50 shrink-0" />
                              <span className="italic opacity-80 text-[10px]">{st.action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= INSERT TAB ================= */}
        {activeTab === 'insert' && (
          <form onSubmit={handleInsertSubmit} className="space-y-3.5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Add / Update Contact
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                BST compares alphabetical keys. Matching keys update in-place without duplicate nodes.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder="e.g., Ananya Verma"
                className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border ${
                  errors.name
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
                } bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2`}
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="student@demo.edu"
                  className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border ${
                    errors.email
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
                  } bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2`}
                />
                {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                Case-insensitive key
              </span>
              <button
                type="submit"
                disabled={isMutating}
                className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {isMutating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Inserting into BST...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Insert Contact</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ================= DELETE TAB ================= */}
        {activeTab === 'delete' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Delete Contact from BST
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Demonstrates pointer rewiring across the 4 fundamental deletion cases.
              </p>
            </div>

            {contacts.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                The tree is currently empty. Nothing to delete.
              </p>
            ) : (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Contact to Remove
                </label>
                <div className="flex gap-2">
                  <select
                    value={deleteTarget}
                    onChange={(e) => setDeleteTarget(e.target.value)}
                    aria-label="Select contact to delete"
                    className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">-- Choose a contact --</option>
                    {contacts.map((c) => (
                      <option key={c.key} value={c.name}>
                        {c.name} ({c.phone || 'no phone'})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={!deleteTarget || isMutating}
                    onClick={() => {
                      if (deleteTarget) onDeleteRequest(deleteTarget);
                    }}
                    className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs disabled:opacity-50 transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    BST Deletion Mechanics:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    <li>Leaf node (0 children): Parent simply clears pointer.</li>
                    <li>1 child: Node replaced with its remaining subtree.</li>
                    <li>2 children: Replaced by in-order successor (minimum in right subtree).</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
