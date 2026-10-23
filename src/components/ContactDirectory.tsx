/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Phone, Mail, Trash2, Crosshair, ArrowDownAZ, User } from 'lucide-react';
import { Contact } from '../services/api';

interface ContactDirectoryProps {
  contacts: Contact[];
  onSearchInTree: (name: string) => void;
  onDeleteRequest: (name: string) => void;
  isMutating: boolean;
}

export const ContactDirectory: React.FC<ContactDirectoryProps> = ({
  contacts,
  onSearchInTree,
  onDeleteRequest,
  isMutating,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = contacts.filter((c) => {
    const q = filterQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      {/* Directory Header & Table Filter */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/30">
        <div>
          <div className="flex items-center gap-2">
            <ArrowDownAZ className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Alphabetical Contact Directory
            </h3>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {contacts.length} total
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Strict alphabetical ordering directly produced by the BST&apos;s In-Order Traversal (L &rarr; Root &rarr; R).
          </p>
        </div>

        {/* Client-side Quick Filter */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter retrieved contacts..."
            aria-label="Filter contacts"
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
        </div>
      </div>

      {/* Directory Table / Responsive Cards */}
      {contacts.length === 0 ? (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
          <User className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-semibold">No contacts found in the directory</p>
          <p className="text-xs text-slate-400 mt-1">
            Add a new contact or load sample data to populate the directory table.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
          <p className="text-sm">No contacts match filter &quot;{filterQuery}&quot;</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 sm:px-6 font-semibold">#</th>
                <th className="py-3 px-4 sm:px-6 font-semibold">Name (Key)</th>
                <th className="py-3 px-4 sm:px-6 font-semibold">Phone Number</th>
                <th className="py-3 px-4 sm:px-6 font-semibold">Email Address</th>
                <th className="py-3 px-4 sm:px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.map((contact, idx) => (
                <tr
                  key={contact.key}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-3 px-4 sm:px-6 text-slate-400 font-mono text-xs">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 sm:px-6 font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span>{contact.name}</span>
                        <span className="block text-[10px] font-mono text-slate-400 font-normal">
                          key: {contact.key}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-slate-600 dark:text-slate-300 font-mono text-xs">
                    {contact.phone ? (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {contact.phone}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">None</span>
                    )}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-slate-600 dark:text-slate-300 text-xs">
                    {contact.email ? (
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {contact.email}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">None</span>
                    )}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSearchInTree(contact.name)}
                        title={`Highlight path to ${contact.name} in tree`}
                        aria-label={`Highlight path to ${contact.name}`}
                        className="p-1.5 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Trace</span>
                      </button>
                      <button
                        onClick={() => onDeleteRequest(contact.name)}
                        disabled={isMutating}
                        title={`Delete ${contact.name}`}
                        aria-label={`Delete ${contact.name}`}
                        className="p-1.5 text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
