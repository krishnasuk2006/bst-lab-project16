# BST LAB
## BST-Based Contact Manager & Interactive Visualizer
**Assignment 16 — B.Tech Semester 3 Data Structures Coursework**

---

## 1. Product Overview

**BST LAB** is a high-fidelity interactive educational software system designed to teach and demonstrate the mechanics of a **Binary Search Tree (BST)** through a real-world contact management application.

Contacts are indexed alphabetically using a custom, from-scratch Binary Search Tree implemented in Python 3. The React and Node.js frontend renders dynamic SVG representations directly from the serialized tree state, allowing students and instructors to visually trace comparisons during search, insertion, and deletion.

---

## 2. System Architecture

```
                       ┌────────────────────────────────────────┐
                       │           Browser Frontend             │
                       │  React 19 + TypeScript + SVG Canvas    │
                       └───────────────────▲────────────────────┘
                                           │  JSON API (/api/*)
                                           │  with Session ID
                       ┌───────────────────▼────────────────────┐
                       │          Node.js Proxy Layer           │
                       │     Express (server.ts) on Port 3000   │
                       │  - Request timeouts & Session pass-thru │
                       │  - Preview Mode fallback when offline   │
                       └───────────────────▲────────────────────┘
                                           │  HTTP Proxy
                                           │  PYTHON_BST_API_URL
                       ┌───────────────────▼────────────────────┐
                       │          Python BST Service            │
                       │      Flask REST API on Port 5000       │
                       │  - Custom ContactNode (pointers)       │
                       │  - Pure BinarySearchTree logic         │
                       │  - In-order traversal & tree stats     │
                       │  - Per-visitor session isolation       │
                       └────────────────────────────────────────┘
```

---

## 3. Core BST Features (Academic Compliance)

1. **Custom Node Class**: `ContactNode` with `name`, `phone`, `email`, `key` (normalized lowercase string for comparison), and `left`/`right` child pointers.
2. **Alphabetical Ordering**: Case-insensitive comparison key ensures strict lexicographical order. Duplicate names update existing contact details in-place.
3. **Four Deletion Cases**:
   - Leaf node (0 children): Parent drops reference to node.
   - Node with single right child: Spliced with right subtree.
   - Node with single left child: Spliced with left subtree.
   - Node with two children: Replaced with in-order successor (minimum node in right subtree).
4. **In-Order Traversal**: Recursive Left &rarr; Root &rarr; Right traversal guarantees sorted alphabetical output.
5. **Tree Height**: Standard academic convention: Empty tree = 0, Leaf-only tree = 1, `h = 1 + max(h_left, h_right)`.
6. **Search Path Trace**: Step-by-step reporting of comparisons made from the root to the target node.
7. **Session Isolation**: Each browser session receives an isolated in-memory BST instance.

---

## 4. Quickstart Guide

### Running the Python Flask Service

```bash
cd python-backend
python3 -m venv venv
source venv/bin/activate       # On Windows: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python3 -m unittest test_bst.py -v   # Run all 18 automated unit tests
python3 app.py                 # Runs on http://127.0.0.1:5000
```

### Running the Node.js / React Frontend

```bash
# In the project root directory
npm install
npm run dev                    # Starts full-stack server on http://localhost:3000
```

---

## 5. Automated Tests

- **Python Tests**: 18 comprehensive tests in `python-backend/test_bst.py` validating tree properties, duplicate updates, all 4 deletion cases, height calculations, and session separation.
- **Node Tests**: Pure geometry layout and form validation tests in `src/utils/treeLayout.test.ts`.

```bash
# Execute Python tests:
python3 python-backend/test_bst.py -v

# Execute Node tests:
npx tsx --test src/utils/treeLayout.test.ts
```

---

## 6. Academic Project Documents

- `report.md`: Complete 5–8 page college project report.
- `demo_script.md`: 5–10 minute presentation script and viva voce questions & answers.
- `API.md`: Complete REST API contract documentation.
- `DEPLOYMENT.md`: Step-by-step production hosting instructions.
