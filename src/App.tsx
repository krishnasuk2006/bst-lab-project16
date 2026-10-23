/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Header,
  ActiveTab,
} from './components/Header';
import { StatsStrip } from './components/StatsStrip';
import { TreeVisualizer } from './components/TreeVisualizer';
import { OperationPanel } from './components/OperationPanel';
import { ContactDirectory } from './components/ContactDirectory';
import { TraversalPanel } from './components/TraversalPanel';
import { LearningMode } from './components/LearningMode';
import { ComplexityTable } from './components/ComplexityTable';
import { CollegeDocsModal } from './components/CollegeDocsModal';
import { ConnectionModal } from './components/ConnectionModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { PositionedNode } from './utils/treeLayout';
import {
  bstApi,
  Contact,
  TreeStats,
  SerializedTreeNode,
  SearchResponse,
} from './services/api';
import { Info, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('visualizer');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('bst_theme') === 'dark' ||
        (!localStorage.getItem('bst_theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  // State
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tree, setTree] = useState<SerializedTreeNode | null>(null);
  const [stats, setStats] = useState<TreeStats>({
    count: 0,
    height: 0,
    root: null,
  });
  const [lastOperation, setLastOperation] = useState<string>('System initialized');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [pythonUrl, setPythonUrl] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState<boolean>(false);

  // Visualization highlights
  const [searchPath, setSearchPath] = useState<string[]>([]);
  const [matchedName, setMatchedName] = useState<string | null>(null);
  const [recentlyChangedName, setRecentlyChangedName] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<PositionedNode | null>(null);

  // Modals & Feedback
  const [connectionModalOpen, setConnectionModalOpen] = useState(false);
  const [collegeDocsModalOpen, setCollegeDocsModalOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'warning' | 'error' | 'info';
    message: string;
  }>({
    show: false,
    type: 'info',
    message: '',
  });

  const showToast = useCallback(
    (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
      setToast({ show: true, type, message });
      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 4000);
    },
    []
  );

  // Theme effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bst_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bst_theme', 'light');
    }
  }, [isDarkMode]);

  // Fetch state and health
  const refreshState = useCallback(async () => {
    try {
      const [healthRes, stateRes] = await Promise.all([
        bstApi.getHealth(),
        bstApi.getState(),
      ]);

      setIsConnected(healthRes.connected);
      setPythonUrl(healthRes.python_url);

      setContacts(stateRes.contacts || []);
      setTree(stateRes.tree || null);
      setStats(
        stateRes.stats || {
          count: stateRes.contacts?.length || 0,
          height: 0,
          root: null,
        }
      );
    } catch (err: any) {
      console.warn('Error syncing BST state from live backend:', err);
      setIsConnected(false);
      setPythonUrl(bstApi.getBaseUrl());
      showToast(err.message || 'Failed to communicate with Python BST backend.', 'error');
    }
  }, [showToast]);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  // Operations
  const handleInsert = async (contact: { name: string; phone: string; email: string }) => {
    setIsMutating(true);
    try {
      const res = await bstApi.addContact(contact);
      setRecentlyChangedName(contact.name);
      setLastOperation(res.message || `Inserted '${contact.name}'`);
      showToast(res.message || `Inserted contact '${contact.name}'`, 'success');
      await refreshState();
    } catch (err: any) {
      const msg = err.data?.message || err.message || 'Failed to insert contact';
      showToast(msg, 'warning');
      if (err.data?.is_preview || err.status === 503) {
        setConnectionModalOpen(true);
      }
    } finally {
      setIsMutating(false);
    }
  };

  const handleSearch = async (name: string): Promise<SearchResponse | null> => {
    try {
      const res = await bstApi.searchContact(name);
      setSearchPath(res.path || []);
      setMatchedName(res.found && res.contact ? res.contact.name : null);
      setLastOperation(
        res.found
          ? `Found '${name}' in ${res.comparisons} comparisons`
          : `'${name}' not found (${res.comparisons} comparisons)`
      );
      return res;
    } catch (err: any) {
      const msg = err.data?.message || err.message || 'Search failed';
      showToast(msg, 'error');
      return null;
    }
  };

  const executeDelete = async (name: string) => {
    setIsMutating(true);
    try {
      const res = await bstApi.deleteContact(name);
      setSearchPath([]);
      setMatchedName(null);
      setRecentlyChangedName(null);
      if (selectedNode?.name.toLowerCase() === name.toLowerCase()) {
        setSelectedNode(null);
      }
      setLastOperation(res.message || `Deleted '${name}'`);
      showToast(res.message || `Deleted contact '${name}'`, 'success');
      await refreshState();
    } catch (err: any) {
      const msg = err.data?.message || err.message || 'Failed to delete contact';
      showToast(msg, 'warning');
      if (err.data?.is_preview || err.status === 503) {
        setConnectionModalOpen(true);
      }
    } finally {
      setIsMutating(false);
      setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleDeleteRequest = (name: string) => {
    setConfirmConfig({
      isOpen: true,
      title: `Delete Contact '${name}'?`,
      message: `This will remove '${name}' from the Binary Search Tree and restructure the pointers according to BST deletion rules. This operation cannot be undone.`,
      confirmLabel: 'Delete Contact',
      isDestructive: true,
      onConfirm: () => executeDelete(name),
    });
  };

  const executeReset = async () => {
    setIsMutating(true);
    try {
      const res = await bstApi.resetTree();
      setSearchPath([]);
      setMatchedName(null);
      setRecentlyChangedName(null);
      setSelectedNode(null);
      setLastOperation('Tree reset to empty state');
      showToast(res.message || 'BST reset to empty state', 'info');
      await refreshState();
    } catch (err: any) {
      const msg = err.data?.message || err.message || 'Could not reset tree';
      showToast(msg, 'warning');
      if (err.data?.is_preview || err.status === 503) {
        setConnectionModalOpen(true);
      }
    } finally {
      setIsMutating(false);
      setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleResetRequest = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Reset BST to Empty State?',
      message:
        'This will clear all contacts from your visitor session and reset tree height and node count to 0. You can reload the sample demo tree at any time.',
      confirmLabel: 'Reset Tree',
      isDestructive: true,
      onConfirm: () => executeReset(),
    });
  };

  const handleLoadDemo = async () => {
    setIsMutating(true);
    try {
      const res = await bstApi.loadDemo();
      setSearchPath([]);
      setMatchedName(null);
      setRecentlyChangedName(null);
      setSelectedNode(null);
      setLastOperation('Loaded 5 sample contacts (Kabir, Diya, Meera, Aarav, Rohan)');
      showToast('Sample educational contacts loaded successfully.', 'success');
      await refreshState();
    } catch (err: any) {
      const msg = err.data?.message || err.message || 'Failed to load demo contacts from Python backend';
      showToast(msg, 'error');
    } finally {
      setIsMutating(false);
    }
  };

  const clearHighlights = () => {
    setSearchPath([]);
    setMatchedName(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toast.show && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
          {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
          {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-500" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-500" />}
          <span className="text-slate-800 dark:text-slate-200">{toast.message}</span>
        </div>
      )}

      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(t) => {
          if (t === 'report') {
            setCollegeDocsModalOpen(true);
          } else {
            setActiveTab(t);
          }
        }}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isConnected={isConnected}
        pythonUrl={pythonUrl}
        onResetClick={handleResetRequest}
        onLoadDemoClick={handleLoadDemo}
        onShowConnectionModal={() => setConnectionModalOpen(true)}
        isMutating={isMutating}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
        {/* Introductory Hero Header (Section 5.B) */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white border border-indigo-900/40 shadow-lg">
          <div className="relative z-10 max-w-3xl space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Data Structures &amp; Algorithms Lab · Project 16
              </span>
              <span
                onClick={() => setConnectionModalOpen(true)}
                className={`cursor-pointer px-2.5 py-0.5 rounded-full text-[11px] font-medium border flex items-center gap-1.5 transition-colors ${
                  isConnected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-400/40 hover:bg-amber-500/30'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span>{isConnected ? 'Python Backend Connected' : 'Preview Mode (Fictional Data)'}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              See the logic behind every comparison.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Explore how a Binary Search Tree stores, searches and organizes contacts through an interactive visual laboratory.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              <button
                onClick={() => setActiveTab('visualizer')}
                className="px-3.5 py-1.5 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-colors"
              >
                Launch Visualizer
              </button>
              <button
                onClick={() => setCollegeDocsModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl font-medium bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-colors"
              >
                Read College Report &amp; Viva Q&amp;A
              </button>
              <span className="text-[11px] text-slate-400 italic hidden sm:inline">
                Educational demo — use fictional contacts only. Demo data is temporary.
              </span>
            </div>
          </div>
        </section>

        {/* Live Statistics Strip (Section 5.C) */}
        <StatsStrip
          stats={stats}
          lastOperation={lastOperation}
          isBackendConnected={isConnected}
        />

        {/* ================= TAB 1: VISUALIZER WORKSPACE ================= */}
        {activeTab === 'visualizer' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Visualizer Canvas (Hero) */}
              <div className="lg:col-span-8 w-full">
                <TreeVisualizer
                  tree={tree}
                  searchPath={searchPath}
                  matchedName={matchedName}
                  recentlyChangedName={recentlyChangedName}
                  onSelectNode={(node) => setSelectedNode(node)}
                  selectedNode={selectedNode}
                  isBackendConnected={isConnected}
                  onLoadDemo={handleLoadDemo}
                />
              </div>

              {/* Operations Control Panel */}
              <div className="lg:col-span-4 w-full">
                <OperationPanel
                  contacts={contacts}
                  onInsert={handleInsert}
                  onSearch={handleSearch}
                  onDeleteRequest={handleDeleteRequest}
                  isBackendConnected={isConnected}
                  isMutating={isMutating}
                  onClearHighlights={clearHighlights}
                />
              </div>
            </div>

            {/* In-Order Traversal sequence banner */}
            <TraversalPanel
              contacts={contacts}
              onSelectContact={(name) => {
                handleSearch(name);
              }}
            />

            {/* Alphabetical Contact Directory Table */}
            <ContactDirectory
              contacts={contacts}
              onSearchInTree={(name) => {
                handleSearch(name);
              }}
              onDeleteRequest={handleDeleteRequest}
              isMutating={isMutating}
            />
          </div>
        )}

        {/* ================= TAB 2: CONTACT DIRECTORY ================= */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            <ContactDirectory
              contacts={contacts}
              onSearchInTree={(name) => {
                setActiveTab('visualizer');
                handleSearch(name);
              }}
              onDeleteRequest={handleDeleteRequest}
              isMutating={isMutating}
            />
          </div>
        )}

        {/* ================= TAB 3: IN-ORDER TRAVERSAL ================= */}
        {activeTab === 'traversal' && (
          <div className="space-y-6">
            <TraversalPanel
              contacts={contacts}
              onSelectContact={(name) => {
                setActiveTab('visualizer');
                handleSearch(name);
              }}
            />
          </div>
        )}

        {/* ================= TAB 4: LEARN BST ================= */}
        {activeTab === 'learn' && <LearningMode />}

        {/* ================= TAB 5: COMPLEXITY ANALYSIS ================= */}
        {activeTab === 'complexity' && <ComplexityTable />}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400 transition-colors mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">BST LAB</span>
            <span>·</span>
            <span>Project 16 Data Structures Lab</span>
            <span>·</span>
            <span>Python Flask &amp; React Architecture</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setCollegeDocsModalOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Academic Report
            </button>
            <button
              onClick={() => setCollegeDocsModalOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Viva Voce Q&amp;A
            </button>
            <button
              onClick={() => setConnectionModalOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Backend Status
            </button>
          </div>
        </div>
      </footer>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmLabel={confirmConfig.confirmLabel}
        isDestructive={confirmConfig.isDestructive}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Connection & Setup Modal */}
      <ConnectionModal
        isOpen={connectionModalOpen}
        onClose={() => setConnectionModalOpen(false)}
        isConnected={isConnected}
        pythonUrl={pythonUrl}
        onRefreshHealth={refreshState}
      />

      {/* College Project Documentation & Viva Kit Modal */}
      <CollegeDocsModal
        isOpen={collegeDocsModalOpen}
        onClose={() => setCollegeDocsModalOpen(false)}
      />
    </div>
  );
}
