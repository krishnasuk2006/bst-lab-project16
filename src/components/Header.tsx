/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Binary,
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
  Menu,
  X,
  FileText,
  Activity,
  Layers,
  Search,
  BookOpen,
  Info,
} from 'lucide-react';

export type ActiveTab = 'visualizer' | 'directory' | 'traversal' | 'learn' | 'complexity' | 'report';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  isConnected: boolean;
  pythonUrl: string | null;
  onResetClick: () => void;
  onLoadDemoClick: () => void;
  onShowConnectionModal: () => void;
  isMutating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  isConnected,
  pythonUrl,
  onResetClick,
  onLoadDemoClick,
  onShowConnectionModal,
  isMutating,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'visualizer', label: 'Visualizer', icon: <Binary className="w-4 h-4" /> },
    { id: 'directory', label: 'Contact Directory', icon: <Search className="w-4 h-4" /> },
    { id: 'traversal', label: 'In-Order Traversal', icon: <Layers className="w-4 h-4" /> },
    { id: 'learn', label: 'Learn BST', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'complexity', label: 'Complexity', icon: <Activity className="w-4 h-4" /> },
    { id: 'report', label: 'College Report & Viva', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Assignment Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('visualizer')}
              className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
              aria-label="BST LAB Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Binary className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                    BST LAB
                  </span>
                  <span className="px-1.5 py-0.5 text-[11px] font-semibold rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Project 16
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  BST Contact Manager & Interactive Visualizer
                </p>
              </div>
            </button>

            {/* Python Backend Connection Pill */}
            <button
              onClick={onShowConnectionModal}
              title={
                isConnected
                  ? `Connected to Python BST Service at ${pythonUrl}`
                  : 'Python backend offline. Running in Preview Mode. Click for setup instructions.'
              }
              aria-label="View backend connection status"
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                isConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span>{isConnected ? 'Python API Connected' : 'Preview Mode'}</span>
              <Info className="w-3 h-3 ml-0.5 opacity-70" />
            </button>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Controls & Theme Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={onLoadDemoClick}
              disabled={isMutating}
              title="Load standard 5-contact educational demo tree (Kabir, Diya, Meera, Aarav, Rohan)"
              aria-label="Load sample contacts"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Demo</span>
            </button>

            <button
              onClick={onResetClick}
              disabled={isMutating}
              title="Clear all contacts from the tree"
              aria-label="Reset tree"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-indigo-500"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 py-3 space-y-1">
            <div className="px-3 pb-2 flex items-center justify-between">
              <button
                onClick={() => {
                  onShowConnectionModal();
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                  isConnected
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300'
                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span>{isConnected ? 'Python API Live' : 'Preview Mode'}</span>
              </button>

              <button
                onClick={() => {
                  onLoadDemoClick();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400"
              >
                Load Demo Contacts
              </button>
            </div>

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-left ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
