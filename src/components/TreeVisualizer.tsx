/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Tag,
  Info,
  ChevronRight,
  Phone,
  Mail,
  User,
  Sparkles,
} from 'lucide-react';
import {
  calculateTreeLayout,
  SerializedTreeNode,
  PositionedNode,
} from '../utils/treeLayout';

interface TreeVisualizerProps {
  tree: SerializedTreeNode | null;
  searchPath: string[];
  matchedName: string | null;
  recentlyChangedName: string | null;
  onSelectNode: (node: PositionedNode | null) => void;
  selectedNode: PositionedNode | null;
  isBackendConnected: boolean;
  onLoadDemo: () => void;
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({
  tree,
  searchPath,
  matchedName,
  recentlyChangedName,
  onSelectNode,
  selectedNode,
  isBackendConnected,
  onLoadDemo,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showSublabels, setShowSublabels] = useState(true);

  // Layout calculation
  const containerWidth = containerRef.current?.clientWidth || 860;
  const layout = useMemo(() => {
    return calculateTreeLayout(tree, Math.max(containerWidth, 800), 100, 70, 30);
  }, [tree, containerWidth]);

  // Center the root on initial render or tree update
  useEffect(() => {
    if (layout.nodes.length > 0 && containerRef.current) {
      const containerW = containerRef.current.clientWidth;
      const rootNode = layout.nodes[0];
      if (rootNode) {
        setPan({
          x: (containerW - layout.width) / 2,
          y: 20,
        });
      }
    }
  }, [layout.nodeCount, layout.width]);

  // Pan interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag with primary mouse button
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(Math.max(0.4, prev + delta), 2.2));
  };

  const handleFitToScreen = () => {
    if (!containerRef.current || layout.nodes.length === 0) return;
    const cWidth = containerRef.current.clientWidth;
    const cHeight = containerRef.current.clientHeight;
    const scaleX = (cWidth - 40) / layout.width;
    const scaleY = (cHeight - 40) / layout.height;
    const fitZoom = Math.min(scaleX, scaleY, 1.2);
    setZoom(Math.max(0.4, fitZoom));
    setPan({
      x: (cWidth - layout.width * fitZoom) / 2,
      y: 20,
    });
  };

  const handleResetView = () => {
    setZoom(1);
    if (containerRef.current) {
      setPan({
        x: (containerRef.current.clientWidth - layout.width) / 2,
        y: 20,
      });
    }
  };

  const isNodeInSearchPath = (name: string) => {
    return searchPath.some((p) => p.toLowerCase() === name.toLowerCase());
  };

  const getNodeSearchStep = (name: string) => {
    const idx = searchPath.findIndex((p) => p.toLowerCase() === name.toLowerCase());
    return idx >= 0 ? idx + 1 : null;
  };

  const isMatchedNode = (name: string) => {
    return matchedName !== null && matchedName.toLowerCase() === name.toLowerCase();
  };

  const isRecentlyChanged = (name: string) => {
    return recentlyChangedName !== null && recentlyChangedName.toLowerCase() === name.toLowerCase();
  };

  return (
    <div className="relative flex flex-col h-[520px] lg:h-[600px] w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-xs select-none">
      {/* Visualizer Canvas Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Title & Mode */}
        <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs pointer-events-auto">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
            BST Topology
          </span>
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400">
            {layout.nodeCount} node{layout.nodeCount !== 1 ? 's' : ''} (Depth {layout.maxDepth})
          </span>
        </div>

        {/* Canvas Controls */}
        <div className="flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs pointer-events-auto">
          <button
            onClick={() => handleZoom(0.15)}
            title="Zoom In"
            aria-label="Zoom In"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.15)}
            title="Zoom Out"
            aria-label="Zoom Out"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono px-1 text-slate-500 dark:text-slate-400 min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleFitToScreen}
            title="Fit Tree to Viewport"
            aria-label="Fit tree to viewport"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            title="Reset View"
            aria-label="Reset tree view"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-0.5" />
          <button
            onClick={() => setShowSublabels(!showSublabels)}
            title={showSublabels ? 'Hide Contact Info Sublabels' : 'Show Contact Info Sublabels'}
            aria-label="Toggle contact labels"
            className={`p-1.5 rounded-lg transition-colors ${
              showSublabels
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Tag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full h-full cursor-grab active:cursor-grabbing overflow-hidden ${
          layout.nodeCount === 0 ? 'flex items-center justify-center' : ''
        }`}
      >
        {layout.nodeCount === 0 ? (
          /* Empty Tree State */
          <div className="max-w-md p-8 text-center text-slate-500 dark:text-slate-400">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
              <User className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
              The Binary Search Tree is Empty
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              No contacts currently exist in this session. Root is <code className="text-indigo-500">None</code>,
              Height is <code className="text-indigo-500">0</code>, and Count is <code className="text-indigo-500">0</code>.
            </p>
            <button
              onClick={onLoadDemo}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Load 5 Sample Contacts (Aarav, Diya, Kabir, Meera, Rohan)</span>
            </button>
          </div>
        ) : (
          <svg
            className="w-full h-full"
            style={{ touchAction: 'none' }}
            aria-label="Interactive Binary Search Tree Visualization"
          >
            <defs>
              {/* Arrow marker for right edge */}
              <marker
                id="arrow-right"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#818cf8" />
              </marker>
              {/* Arrow marker for left edge */}
              <marker
                id="arrow-left"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#60a5fa" />
              </marker>
              {/* Radial gradient for highlighted path */}
              <radialGradient id="highlightGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
              </radialGradient>
            </defs>

            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Tree Edges (Connecting Lines) */}
              {layout.edges.map((edge) => {
                const isLeft = edge.type === 'left';
                const fromInPath = isNodeInSearchPath(edge.fromName);
                const toInPath = isNodeInSearchPath(edge.toName);
                const isEdgeInPath = fromInPath && toInPath;

                // Subtle smooth cubic bezier for aesthetic branch curves
                const midY = (edge.y1 + edge.y2) / 2;
                const pathD = `M ${edge.x1} ${edge.y1} C ${edge.x1} ${midY}, ${edge.x2} ${midY}, ${edge.x2} ${edge.y2}`;

                return (
                  <g key={edge.id}>
                    <path
                      d={pathD}
                      fill="none"
                      stroke={
                        isEdgeInPath
                          ? '#14b8a6'
                          : isLeft
                          ? 'rgba(96, 165, 250, 0.45)'
                          : 'rgba(168, 85, 247, 0.45)'
                      }
                      strokeWidth={isEdgeInPath ? 3.5 : 2}
                      strokeDasharray={isEdgeInPath ? 'none' : 'none'}
                      className="tree-edge-transition"
                    />
                    {/* Branch Label Badge */}
                    <rect
                      x={(edge.x1 + edge.x2) / 2 - 10}
                      y={(edge.y1 + edge.y2) / 2 - 8}
                      width={20}
                      height={16}
                      rx={4}
                      fill="var(--color-slate-900, #0f172a)"
                      className="dark:fill-slate-950 fill-white stroke stroke-slate-200 dark:stroke-slate-800"
                    />
                    <text
                      x={(edge.x1 + edge.x2) / 2}
                      y={(edge.y1 + edge.y2) / 2 + 4}
                      textAnchor="middle"
                      fontSize={9}
                      fontWeight="bold"
                      fill={isLeft ? '#3b82f6' : '#a855f7'}
                      className="font-mono select-none"
                    >
                      {isLeft ? '<' : '>'}
                    </text>
                  </g>
                );
              })}

              {/* Tree Nodes */}
              {layout.nodes.map((node) => {
                const inSearch = isNodeInSearchPath(node.name);
                const searchStep = getNodeSearchStep(node.name);
                const isMatch = isMatchedNode(node.name);
                const isRecent = isRecentlyChanged(node.name);
                const isSelected = selectedNode?.key === node.key;

                // Colors
                let circleFill = '#ffffff';
                let circleStroke = '#6366f1'; // Indigo default
                let textColor = '#0f172a';

                if (isMatch) {
                  circleFill = '#0d9488'; // Emerald/Teal target match
                  circleStroke = '#14b8a6';
                  textColor = '#ffffff';
                } else if (inSearch) {
                  circleFill = '#0f766e'; // Teal search path
                  circleStroke = '#2dd4bf';
                  textColor = '#ffffff';
                } else if (isRecent) {
                  circleFill = '#4f46e5'; // Purple recent
                  circleStroke = '#818cf8';
                  textColor = '#ffffff';
                }

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectNode(node);
                    }}
                    className="cursor-pointer group"
                    role="button"
                    tabIndex={0}
                    aria-label={`Contact node ${node.name}, key: ${node.key}, depth: ${node.depth}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onSelectNode(node);
                      }
                    }}
                  >
                    {/* Outer Glow Pulse when node is in search path or target match */}
                    {(inSearch || isMatch) && (
                      <circle
                        r={38}
                        fill="none"
                        stroke="#14b8a6"
                        strokeWidth={2}
                        opacity={0.8}
                        className="search-path-highlight"
                      />
                    )}

                    {/* Selected Ring */}
                    {isSelected && (
                      <circle
                        r={34}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        strokeDasharray="4 2"
                        className="animate-spin-slow"
                      />
                    )}

                    {/* Node Capsule Circle */}
                    <circle
                      r={28}
                      fill={circleFill}
                      stroke={circleStroke}
                      strokeWidth={isSelected ? 3.5 : inSearch ? 3 : 2}
                      className="tree-node-transition shadow-lg filter drop-shadow-sm group-hover:scale-105"
                    />

                    {/* Main Name Label */}
                    <text
                      textAnchor="middle"
                      dy={showSublabels ? -2 : 4}
                      fontSize={12}
                      fontWeight="700"
                      fill={textColor}
                      className="select-none pointer-events-none tracking-tight font-sans"
                    >
                      {node.name}
                    </text>

                    {/* Sublabel: Initial or phone snippet */}
                    {showSublabels && (
                      <text
                        textAnchor="middle"
                        dy={13}
                        fontSize={9}
                        fontWeight="500"
                        fill={inSearch || isMatch || isRecent ? '#cbd5e1' : '#64748b'}
                        className="select-none pointer-events-none font-mono tracking-wider"
                      >
                        {node.phone ? node.phone.slice(-4) : `[d:${node.depth}]`}
                      </text>
                    )}

                    {/* Search Path Order Badge (1, 2, 3...) */}
                    {searchStep && (
                      <g transform="translate(18, -18)">
                        <circle r={10} fill="#f59e0b" stroke="#ffffff" strokeWidth={1.5} />
                        <text
                          textAnchor="middle"
                          dy={3.5}
                          fontSize={10}
                          fontWeight="bold"
                          fill="#ffffff"
                          className="font-mono select-none pointer-events-none"
                        >
                          {searchStep}
                        </text>
                      </g>
                    )}

                    {/* Root Badge */}
                    {node.depth === 0 && (
                      <g transform="translate(0, -34)">
                        <rect
                          x={-16}
                          y={-8}
                          width={32}
                          height={14}
                          rx={7}
                          fill="#4f46e5"
                          className="shadow-xs"
                        />
                        <text
                          textAnchor="middle"
                          dy={2.5}
                          fontSize={8}
                          fontWeight="800"
                          fill="#ffffff"
                          className="font-sans tracking-wider uppercase select-none pointer-events-none"
                        >
                          ROOT
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        )}
      </div>

      {/* Selected Node Details Card (Overlay) */}
      {selectedNode && (
        <div className="absolute bottom-3 left-3 max-w-xs sm:max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl z-20 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Selected Node (Depth {selectedNode.depth})
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedNode.name}
              </h4>
            </div>
            <button
              onClick={() => onSelectNode(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 text-xs"
              aria-label="Close details"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            {selectedNode.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono">{selectedNode.phone}</span>
              </div>
            )}
            {selectedNode.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{selectedNode.email}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono">
              <span className={selectedNode.hasLeft ? 'text-blue-500 font-semibold' : 'text-slate-400'}>
                L: {selectedNode.leftName || 'null'}
              </span>
              <span className={selectedNode.hasRight ? 'text-purple-500 font-semibold' : 'text-slate-400'}>
                R: {selectedNode.rightName || 'null'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Visualizer Legend */}
      <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span>Normal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
          <span>Search Path</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>1,2.. Comparison</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-blue-500 font-bold">&lt;</span>
          <span>Left Subtree</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-purple-500 font-bold">&gt;</span>
          <span>Right Subtree</span>
        </div>
      </div>
    </div>
  );
};
