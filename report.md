# B.TECH SEMESTER 3 DATA STRUCTURES MINI-PROJECT REPORT
## Project 16: BST-Based Contact Manager & Interactive Visualizer
**Subject:** Data Structures & Algorithms Lab (CS201 / IT201)  
**Academic Session:** 2026–2027  

---

### Student Information (Placeholders)
- **Student Name:** [Student Name]
- **Roll Number:** [Roll Number]
- **Branch:** Computer Science & Engineering / Information Technology
- **Semester:** 3rd Semester
- **Batch / Section:** [Section]
- **Submission Date:** [Date]

---

## 1. Title and Introduction

### 1.1 Project Title
**BST-Based Contact Manager & Interactive Visualizer (BST LAB)**

### 1.2 Introduction
In computer science, efficient data organization and retrieval are fundamental challenges. Linear data structures, such as contiguous arrays and linked lists, suffer from severe trade-offs: arrays provide $O(1)$ random access by index but require $O(n)$ time for element insertion and deletion due to shifting; singly linked lists permit $O(1)$ pointer rewiring once a position is located, but searching requires linear scanning of $O(n)$ elements.

A **Binary Search Tree (BST)** is an hierarchical non-linear data structure that combines the advantages of both worlds: dynamic allocation via node pointers and logarithmic search time $O(\log n)$ by bisecting the search space at each comparison.

This project implements a complete, practical contact management system where contacts (comprising full name, telephone number, and email address) are stored and indexed within a custom Binary Search Tree. The project couples a core Python backend with an interactive web visualizer to render the underlying tree hierarchy and demonstrate operations live.

---

## 2. Problem Statement

To design, develop, test, and analyze an interactive Contact Management System from first principles using a Binary Search Tree (BST) without relying on built-in associative arrays, dictionaries, or external tree libraries for core storage.

The application must support:
1. Alphabetical key indexing based on contact names (case-insensitive).
2. Contact insertion, with automatic in-place updates when duplicate names are encountered.
3. Contact search with real-time reporting of visited nodes and comparison counts.
4. Contact deletion implementing all four classical BST deletion cases (leaf, single left child, single right child, two children with in-order successor replacement).
5. Dynamic in-order traversal to output the full directory in strictly sorted alphabetical order.
6. Computation of structural tree statistics, including total contact count and tree height.
7. Multi-user session isolation to guarantee that concurrent users maintain independent tree states.

---

## 3. Objectives

- **Algorithmic Rigor:** Implement a custom `ContactNode` class with explicit `left` and `right` pointers.
- **Academic Correctness:** Ensure exact adherence to standard tree definitions, defining the height of an empty tree as 0 and a single root node as 1.
- **Visual Pedagogy:** Provide a responsive SVG canvas rendering parent-child branches and step-by-step search paths.
- **Asymptotic Analysis:** Evaluate best, average, and worst-case time complexities and explain the recursive stack auxiliary space $O(h)$.
- **Empirical Validation:** Construct an automated unit test suite covering all 18 standard edge cases.

---

## 4. Data Structure Design

### 4.1 Node Structure (`ContactNode`)

Each node in the Binary Search Tree contains the contact payload and two pointers:

```
+-------------------------------------------------------+
|                      ContactNode                      |
+-------------------------------------------------------+
| name  : str           (e.g., "Kabir")                 |
| phone : str           (e.g., "+91 98765 43210")       |
| email : str           (e.g., "kabir@demo.edu")        |
| key   : str           (normalized: name.lower())      |
+-------------------------------------------------------+
| left  : Optional[ContactNode]  (keys < current.key)   |
| right : Optional[ContactNode]  (keys > current.key)   |
+-------------------------------------------------------+
```

### 4.2 The BST Ordering Invariant

For every node $X$ in the tree:
$$\forall Y \in \text{LeftSubtree}(X), \quad \text{key}(Y) < \text{key}(X)$$
$$\forall Z \in \text{RightSubtree}(X), \quad \text{key}(Z) > \text{key}(X)$$

Case-insensitivity is achieved by defining $\text{key}(X) = \text{lowercase}(\text{trim}(\text{name}))$.

---

## 5. Tree Architecture and Visual Diagram

Below is the ASCII structural diagram of the educational sample tree seeded in BST LAB:

```
                          [ Kabir ]
                         /         \
                 [ Diya ]           [ Meera ]
                /                           \
         [ Aarav ]                           [ Rohan ]
```

### Path Trace and Subtree Verification:
1. **Root:** `"Kabir"` (`key: "kabir"`)
2. **Left Child of Root:** `"Diya"` because `'diya' < 'kabir'`.
3. **Left Child of Diya:** `"Aarav"` because `'aarav' < 'diya'`.
4. **Right Child of Root:** `"Meera"` because `'meera' > 'kabir'`.
5. **Right Child of Meera:** `"Rohan"` because `'rohan' > 'meera'`.

---

## 6. Algorithms and Implementation

### 6.1 Insertion Algorithm
```text
Algorithm INSERT(root, name, phone, email):
1. key <- LOWERCASE(TRIM(name))
2. If root is NULL then:
       root <- CREATE_NODE(name, phone, email, key)
       Return (True, "Inserted as root")
3. current <- root
4. While True do:
       If key == current.key then:
           current.phone <- phone
           current.email <- email
           Return (False, "Contact updated in-place")
       Else if key < current.key then:
           If current.left is NULL then:
               current.left <- CREATE_NODE(name, phone, email, key)
               Return (True, "Inserted into left subtree")
           current <- current.left
       Else:
           If current.right is NULL then:
               current.right <- CREATE_NODE(name, phone, email, key)
               Return (True, "Inserted into right subtree")
           current <- current.right
```

### 6.2 Search Algorithm
```text
Algorithm SEARCH(root, target_name):
1. target_key <- LOWERCASE(TRIM(target_name))
2. comparisons <- 0, path <- [], steps <- []
3. current <- root
4. While current is not NULL do:
       comparisons <- comparisons + 1
       path.APPEND(current.name)
       If target_key == current.key then:
           Return (Found=True, Contact=current, comparisons, path)
       Else if target_key < current.key then:
           current <- current.left
       Else:
           current <- current.right
5. Return (Found=False, Contact=None, comparisons, path)
```

### 6.3 Deletion Algorithm (Handling 4 Cases)
```text
Algorithm DELETE(node, target_key):
1. If node is NULL then Return NULL
2. If target_key < node.key then:
       node.left <- DELETE(node.left, target_key)
       Return node
3. Else if target_key > node.key then:
       node.right <- DELETE(node.right, target_key)
       Return node
4. Else: (Node to delete found)
       Case 1: If node.left is NULL and node.right is NULL then
           Return NULL
       Case 2: If node.left is NULL then
           Return node.right
       Case 3: If node.right is NULL then
           Return node.left
       Case 4: (Two children)
           successor <- FIND_MIN(node.right)
           node.name <- successor.name
           node.phone <- successor.phone
           node.email <- successor.email
           node.key <- successor.key
           node.right <- DELETE(node.right, successor.key)
           Return node
```

### 6.4 In-Order Traversal
```text
Algorithm INORDER(node, output_list):
1. If node is not NULL then:
       INORDER(node.left, output_list)
       output_list.APPEND(node.to_dict())
       INORDER(node.right, output_list)
```

---

## 7. Sample Input and Output

### Test Execution Trace:
- **Insert Sequence:** `"Kabir"`, `"Diya"`, `"Meera"`, `"Aarav"`, `"Rohan"`
- **Resulting Stats:** Count = 5, Height = 3, Root = `"Kabir"`
- **In-Order Traversal Output:**
  1. `Aarav` (`+91 98765 43213`, `aarav@demo.edu`)
  2. `Diya` (`+91 98765 43211`, `diya@demo.edu`)
  3. `Kabir` (`+91 98765 43210`, `kabir@demo.edu`)
  4. `Meera` (`+91 98765 43212`, `meera@demo.edu`)
  5. `Rohan` (`+91 98765 43214`, `rohan@demo.edu`)

### Search Trace: Target `"Aarav"`
- Comparison 1: Root `"Kabir"` &rarr; `'aarav' < 'kabir'` &rarr; Branch Left.
- Comparison 2: Node `"Diya"` &rarr; `'aarav' < 'diya'` &rarr; Branch Left.
- Comparison 3: Node `"Aarav"` &rarr; `'aarav' == 'aarav'` &rarr; Match found in 3 comparisons.

---

## 8. Time and Space Complexity Analysis

| Operation | Best Case | Average Case | Worst Case | Auxiliary Space |
| :--- | :--- | :--- | :--- | :--- |
| **Search** | $\Omega(1)$ (Root match) | $\Theta(\log n)$ | $O(n)$ (Skewed) | $O(h)$ recursion stack |
| **Insert** | $\Omega(1)$ (Root creation) | $\Theta(\log n)$ | $O(n)$ (Skewed) | $O(1)$ iterative / $O(h)$ |
| **Delete** | $\Omega(1)$ (Leaf root) | $\Theta(\log n)$ | $O(n)$ (Skewed) | $O(h)$ recursion stack |
| **In-Order Traversal** | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | $O(h)$ stack + $O(n)$ list |
| **Total Tree Space** | $O(n)$ | $O(n)$ | $O(n)$ | One node per contact |

*Note on worst-case:* When items are inserted in strictly sorted or reverse-sorted order, the BST degenerates into a singly linked list with height $h = n$, resulting in $O(n)$ search, insert, and delete performance.

---

## 9. Testing and Edge Cases

The project features 18 automated unit test cases implemented in `python-backend/test_bst.py`:

1. Initial state of empty tree.
2. Insertion of single root node.
3. Insertion of multiple contacts verifying left/right subtree positioning.
4. Searching for an existing contact.
5. Searching for an absent contact.
6. Verification of in-order traversal alphabetical ordering.
7. Updating contact details upon inserting a case-insensitive duplicate key.
8. Deletion of a leaf node (Case 1).
9. Deletion of a node with only a left child (Case 3).
10. Deletion of a node with only a right child (Case 2).
11. Deletion of a node with two children via in-order successor (Case 4).
12. Deletion of the tree root node.
13. Deletion of the final remaining node (resetting to empty tree).
14. Attempted deletion from an empty tree.
15. Accurate tracking of count across multiple operations.
16. Accurate tree height under balanced and skewed configurations.
17. Correct generation of step-by-step search comparison paths.
18. Multi-session isolation verifying zero state leakage between independent visitors.

---

## 10. Conclusion and Future Improvements

The BST-Based Contact Manager successfully demonstrates how hierarchical data structures provide efficient search, insertion, and ordered traversal capabilities.

### Future Scope:
1. **Self-Balancing Trees:** Implement AVL tree rotations (Single LL/RR and Double LR/RL rotations) or Red-Black coloring to strictly enforce $O(\log n)$ worst-case bounds.
2. **Prefix Searching (Trie integration):** Enable instant auto-complete by integrating a Trie data structure alongside the BST.
3. **Secondary Indices:** Construct secondary BSTs indexed by phone number to allow dual-key lookup.

---

## 11. Individual Contribution (Placeholders)

- **Algorithm & Data Structure Implementation:** [Student Name]
- **Unit Testing & Edge Case Verification:** [Student Name]
- **Frontend SVG Visualization & UI Design:** [Student Name]
- **Node.js Integration & Documentation:** [Student Name]
