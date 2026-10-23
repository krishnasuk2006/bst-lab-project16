/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTreeLayout, validateContactForm, SerializedTreeNode } from './treeLayout';

test('calculateTreeLayout handles null or empty root gracefully', () => {
  const result = calculateTreeLayout(null);
  assert.equal(result.nodeCount, 0);
  assert.equal(result.nodes.length, 0);
  assert.equal(result.edges.length, 0);
  assert.equal(result.maxDepth, 0);
});

test('calculateTreeLayout positions single root node accurately', () => {
  const root: SerializedTreeNode = {
    name: 'Kabir',
    phone: '123',
    email: 'k@demo.edu',
    key: 'kabir',
    depth: 0,
    left: null,
    right: null,
  };

  const result = calculateTreeLayout(root, 800);
  assert.equal(result.nodeCount, 1);
  assert.equal(result.nodes.length, 1);
  assert.equal(result.edges.length, 0);
  assert.equal(result.nodes[0].name, 'Kabir');
  assert.equal(result.nodes[0].depth, 0);
  assert.ok(result.nodes[0].x > 0);
  assert.ok(result.nodes[0].y > 0);
});

test('calculateTreeLayout preserves left < root < right in-order geometric ranking', () => {
  const tree: SerializedTreeNode = {
    name: 'Kabir',
    phone: '',
    email: '',
    key: 'kabir',
    depth: 0,
    left: {
      name: 'Diya',
      phone: '',
      email: '',
      key: 'diya',
      depth: 1,
      left: {
        name: 'Aarav',
        phone: '',
        email: '',
        key: 'aarav',
        depth: 2,
      },
      right: null,
    },
    right: {
      name: 'Meera',
      phone: '',
      email: '',
      key: 'meera',
      depth: 1,
      left: null,
      right: {
        name: 'Rohan',
        phone: '',
        email: '',
        key: 'rohan',
        depth: 2,
      },
    },
  };

  const result = calculateTreeLayout(tree, 800);
  assert.equal(result.nodeCount, 5);
  assert.equal(result.edges.length, 4);

  const aarav = result.nodes.find((n) => n.name === 'Aarav')!;
  const diya = result.nodes.find((n) => n.name === 'Diya')!;
  const kabir = result.nodes.find((n) => n.name === 'Kabir')!;
  const meera = result.nodes.find((n) => n.name === 'Meera')!;
  const rohan = result.nodes.find((n) => n.name === 'Rohan')!;

  assert.ok(aarav && diya && kabir && meera && rohan);

  // In-order BST x-ordering must be strictly monotonic: Aarav < Diya < Kabir < Meera < Rohan
  assert.ok(aarav.x < diya.x, 'Aarav x must be < Diya x');
  assert.ok(diya.x < kabir.x, 'Diya x must be < Kabir x');
  assert.ok(kabir.x < meera.x, 'Kabir x must be < Meera x');
  assert.ok(meera.x < rohan.x, 'Meera x must be < Rohan x');

  // Verify left and right edge types
  const leftEdges = result.edges.filter((e) => e.type === 'left');
  const rightEdges = result.edges.filter((e) => e.type === 'right');
  assert.equal(leftEdges.length, 2);
  assert.equal(rightEdges.length, 2);
});

test('validateContactForm rejects empty or short names', () => {
  const emptyRes = validateContactForm('', '', '');
  assert.equal(emptyRes.valid, false);
  assert.ok(emptyRes.errors.name);

  const shortRes = validateContactForm('A', '', '');
  assert.equal(shortRes.valid, false);
  assert.ok(shortRes.errors.name);

  const validRes = validateContactForm('Ananya', '9876543210', 'ananya@demo.edu');
  assert.equal(validRes.valid, true);
  assert.equal(Object.keys(validRes.errors).length, 0);
});

test('validateContactForm validates email syntax properly', () => {
  const invalidEmail = validateContactForm('Rahul', '12345', 'not-an-email');
  assert.equal(invalidEmail.valid, false);
  assert.ok(invalidEmail.errors.email);

  const validEmail = validateContactForm('Rahul', '12345', 'rahul@college.edu');
  assert.equal(validEmail.valid, true);
});
