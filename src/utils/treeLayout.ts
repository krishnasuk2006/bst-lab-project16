/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SerializedTreeNode {
  name: string;
  phone: string;
  email: string;
  key: string;
  depth: number;
  left?: SerializedTreeNode | null;
  right?: SerializedTreeNode | null;
  has_left?: boolean;
  has_right?: boolean;
}

export interface PositionedNode {
  id: string;
  name: string;
  phone: string;
  email: string;
  key: string;
  x: number;
  y: number;
  depth: number;
  hasLeft: boolean;
  hasRight: boolean;
  leftName?: string;
  rightName?: string;
}

export interface TreeEdge {
  id: string;
  fromName: string;
  toName: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: 'left' | 'right';
}

export interface TreeLayoutResult {
  nodes: PositionedNode[];
  edges: TreeEdge[];
  width: number;
  height: number;
  nodeCount: number;
  maxDepth: number;
}

/**
 * Calculates deterministic (x, y) coordinates for rendering a Binary Search Tree in SVG.
 * Uses an in-order x-coordinate layout algorithm so BST nodes are visually ordered
 * from left to right strictly according to their key values, guaranteeing no horizontal edge crossings!
 */
export function calculateTreeLayout(
  root: SerializedTreeNode | null | undefined,
  canvasWidth: number = 800,
  levelHeight: number = 90,
  topMargin: number = 60,
  nodeRadius: number = 28
): TreeLayoutResult {
  if (!root) {
    return {
      nodes: [],
      edges: [],
      width: canvasWidth,
      height: 300,
      nodeCount: 0,
      maxDepth: 0,
    };
  }

  const nodes: PositionedNode[] = [];
  const edges: TreeEdge[] = [];
  let maxDepth = 0;

  // 1. Assign in-order rank (0, 1, 2, ... n-1) so nodes appear strictly left-to-right
  let inOrderIndex = 0;
  const inOrderMap = new Map<SerializedTreeNode, number>();

  function traverseInOrder(node: SerializedTreeNode | null | undefined) {
    if (!node) return;
    traverseInOrder(node.left);
    inOrderMap.set(node, inOrderIndex);
    inOrderIndex++;
    traverseInOrder(node.right);
  }
  traverseInOrder(root);

  const totalNodes = inOrderIndex;
  // Calculate horizontal pitch
  const effectiveWidth = Math.max(canvasWidth, (totalNodes + 1) * 90);
  const horizontalStep = effectiveWidth / (totalNodes + 1);

  // 2. Assign coordinates and generate edges
  function positionSubtree(node: SerializedTreeNode, depth: number) {
    if (depth > maxDepth) {
      maxDepth = depth;
    }

    const rank = inOrderMap.get(node) ?? 0;
    const x = (rank + 1) * horizontalStep;
    const y = topMargin + depth * levelHeight;

    const leftChild = node.left;
    const rightChild = node.right;

    const positioned: PositionedNode = {
      id: `node-${node.key}-${depth}`,
      name: node.name,
      phone: node.phone || '',
      email: node.email || '',
      key: node.key,
      x,
      y,
      depth,
      hasLeft: Boolean(leftChild),
      hasRight: Boolean(rightChild),
      leftName: leftChild ? leftChild.name : undefined,
      rightName: rightChild ? rightChild.name : undefined,
    };
    nodes.push(positioned);

    if (leftChild) {
      const leftRank = inOrderMap.get(leftChild) ?? 0;
      const childX = (leftRank + 1) * horizontalStep;
      const childY = topMargin + (depth + 1) * levelHeight;

      edges.push({
        id: `edge-${node.key}-to-${leftChild.key}`,
        fromName: node.name,
        toName: leftChild.name,
        x1: x,
        y1: y + nodeRadius,
        x2: childX,
        y2: childY - nodeRadius,
        type: 'left',
      });
      positionSubtree(leftChild, depth + 1);
    }

    if (rightChild) {
      const rightRank = inOrderMap.get(rightChild) ?? 0;
      const childX = (rightRank + 1) * horizontalStep;
      const childY = topMargin + (depth + 1) * levelHeight;

      edges.push({
        id: `edge-${node.key}-to-${rightChild.key}`,
        fromName: node.name,
        toName: rightChild.name,
        x1: x,
        y1: y + nodeRadius,
        x2: childX,
        y2: childY - nodeRadius,
        type: 'right',
      });
      positionSubtree(rightChild, depth + 1);
    }
  }

  positionSubtree(root, 0);

  const totalHeight = topMargin + (maxDepth + 1) * levelHeight + 60;

  return {
    nodes,
    edges,
    width: effectiveWidth,
    height: Math.max(340, totalHeight),
    nodeCount: totalNodes,
    maxDepth,
  };
}

/**
 * Validates contact input fields according to academic demo rules.
 */
export function validateContactForm(name: string, phone: string, email: string): {
  valid: boolean;
  errors: { name?: string; phone?: string; email?: string };
} {
  const errors: { name?: string; phone?: string; email?: string } = {};

  const cleanName = name.trim();
  if (!cleanName) {
    errors.name = 'Contact name is required.';
  } else if (cleanName.length < 2) {
    errors.name = 'Contact name must be at least 2 characters.';
  } else if (cleanName.length > 50) {
    errors.name = 'Contact name must be 50 characters or less.';
  }

  const cleanEmail = email.trim();
  if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    errors.email = 'Please enter a valid email address (e.g., student@demo.edu).';
  }

  const cleanPhone = phone.trim();
  if (cleanPhone && cleanPhone.length > 30) {
    errors.phone = 'Phone number must be 30 characters or less.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
