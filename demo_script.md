# BST LAB — 5-10 MINUTE DEMO SCRIPT & VIVA VOCE KIT
**Assignment 16: BST-Based Contact Manager & Interactive Visualizer**

---

## Part 1: Presentation & Live Demonstration Script (5 to 10 Minutes)

### Phase 1: Introduction (1 Minute)
> "Good morning/afternoon, respected examiners and faculty members.
>
> Today, I am demonstrating **Project 16: BST-Based Contact Manager & Interactive Visualizer**, or **BST LAB**.
>
> In this project, we explored how a fundamental non-linear data structure—the **Binary Search Tree**—can be applied to manage a contact directory. Rather than relying on standard hash tables or built-in databases, every contact in this application is stored as a custom node in an explicit Binary Search Tree with left and right child pointers, implemented completely from scratch in Python 3."

---

### Phase 2: Architecture & Setup (1 Minute)
> "Before showing the operations, I would like to highlight our technology architecture:
> 1. The **core data structure** is implemented in Python using a custom `ContactNode` class.
> 2. The **Python service** exposes a clean REST API running on Flask.
> 3. Our **Node.js layer** acts as a secure reverse proxy, handling session isolation so that each user has their own private tree.
> 4. The **frontend** is built in React with TypeScript, using SVG to render the real tree topology directly from the serialized backend data."

---

### Phase 3: The BST Ordering & Insertion (2 Minutes)
> *(Action: Point to the Visualizer canvas showing the demo tree.)*
>
> "Notice the root of our tree: **Kabir**.
>
> When we insert contacts, the BST compares the normalized alphabetical key:
> - **Diya** has key `'diya'`, which is lexicographically smaller than `'kabir'`, so it branches to the **left subtree**.
> - **Meera** has key `'meera'`, which is greater than `'kabir'`, so it branches to the **right subtree**.
> - Similarly, **Aarav** was inserted to the left of Diya, and **Rohan** to the right of Meera.
>
> Let us insert a new contact: `'Bhavna'`.
> *(Action: Type 'Bhavna', '+91 98765 00000', 'bhavna@demo.edu', click Insert)*
>
> Notice how the tree dynamically updates: 'Bhavna' is greater than 'Aarav' but smaller than 'Diya', placing it cleanly into the tree at depth 2."

---

### Phase 4: Live Search & Path Highlighting (2 Minutes)
> *(Action: Click the Search tab, enter 'Aarav', press Enter.)*
>
> "Now, look at the visualizer during a search.
>
> Notice the glowing teal path with numbered badges:
> 1. Step 1: Root `'Kabir'` &rarr; `'aarav' < 'kabir'` &rarr; branches Left.
> 2. Step 2: Node `'Diya'` &rarr; `'aarav' < 'diya'` &rarr; branches Left.
> 3. Step 3: Node `'Aarav'` &rarr; `'aarav' == 'aarav'` &rarr; Match found in exactly 3 comparisons!
>
> The entire right half of the tree was eliminated from search immediately. This illustrates the logarithmic average efficiency of binary search."

---

### Phase 5: In-Order Traversal & Alphabetical Order (1.5 Minutes)
> *(Action: Switch to the In-Order Traversal tab or scroll down.)*
>
> "One of the most elegant properties of a Binary Search Tree is that **In-Order Traversal (Left &rarr; Root &rarr; Right)** visits all nodes in strictly sorted order.
>
> Notice our traversal chain:
> `Aarav -> Bhavna -> Diya -> Kabir -> Meera -> Rohan`
>
> This traversal takes $O(n)$ time and requires $O(h)$ auxiliary recursion stack space. The contact directory table below is rendered directly from this in-order sequence."

---

### Phase 6: Deletion Cases Demonstration (1.5 Minutes)
> *(Action: Switch to the Delete tab.)*
>
> "Our implementation handles all four standard BST deletion cases:
> 1. **Leaf node (Case 1):** e.g. deleting 'Bhavna' simply clears the parent pointer.
> 2. **Single child (Cases 2 & 3):** the parent bypasses the deleted node and points to its child.
> 3. **Two children (Case 4):** e.g. deleting root `'Kabir'`.
> *(Action: Delete 'Kabir')*
>
> Look at what happened: the algorithm identified Kabir's **in-order successor** (the smallest node in the right subtree, which was 'Meera'), copied its contact details to the root, and removed the successor from the right subtree. The tree remains a valid BST!"

---

### Phase 7: Conclusion & Wrap-up (30 Seconds)
> "In summary, BST LAB bridges theoretical algorithmic concepts with an intuitive, interactive software interface. All 18 automated edge cases pass in our test suite. Thank you, and I am now ready for your questions."

---

## Part 2: Top Viva Voce Questions & Answers

### Q1: What is a Binary Search Tree?
**Answer:** A Binary Search Tree is a binary tree where each node satisfies the BST invariant: every key in the left subtree is strictly less than the node's key, and every key in the right subtree is strictly greater than the node's key. Both left and right subtrees must themselves be binary search trees.

### Q2: What is the average and worst-case time complexity of BST operations?
**Answer:**
- **Average Case:** $O(\log n)$ for search, insertion, and deletion, assuming a randomly distributed or reasonably balanced tree.
- **Worst Case:** $O(n)$ when keys are inserted in sorted or reverse-sorted order, which degenerates the tree into a linear linked list.

### Q3: Why does In-Order traversal yield keys in ascending sorted order?
**Answer:** In-order traversal visits the left subtree, then the current node, then the right subtree. Since all keys in the left subtree are smaller than the root, and all keys in the right subtree are larger, this recursive ordering naturally flattens the tree into a sorted sequence.

### Q4: How is tree height defined in your project?
**Answer:** We follow the standard academic convention:
- An empty tree (`root is None`) has height $0$.
- A tree with only the root has height $1$.
- In general, $\text{height} = 1 + \max(\text{height}(\text{left}), \text{height}(\text{right}))$.

### Q5: What is an In-Order Successor?
**Answer:** The in-order successor of a node is the node with the smallest key that is strictly greater than the given node's key. In a BST, if a node has a right child, its in-order successor is the leftmost node in its right subtree.

### Q6: How do you handle duplicate contact names in your BST?
**Answer:** To prevent key ambiguity and enforce set semantics, our `insert` method checks if the normalized case-insensitive key already exists. If so, it updates the existing node's phone number, email address, and display casing in-place without creating a redundant duplicate node.

### Q7: Why not use a Hash Table instead of a BST for contacts?
**Answer:** While a hash table provides $O(1)$ average lookup, it does not maintain ordering. A BST allows $O(n)$ sorted alphabetical traversal, range queries (e.g., all contacts between 'D' and 'M'), and finding minimum/maximum elements in $O(h)$ time without additional sorting.

### Q8: What is the auxiliary space complexity of recursive BST operations?
**Answer:** The auxiliary space complexity is $O(h)$, where $h$ is the height of the tree, representing the maximum call stack depth during recursion. In a balanced tree, $h = O(\log n)$; in a degenerate tree, $h = O(n)$.

### Q9: What happens if you insert already sorted contacts into a standard BST?
**Answer:** The tree becomes right-skewed and degenerates into a singly linked list. Tree height becomes $n$, and search time degrades from $O(\log n)$ to linear $O(n)$.

### Q10: How can this worst-case degeneration be prevented in practice?
**Answer:** By using self-balancing binary search trees such as **AVL trees** (which maintain a balance factor of $\pm 1$ using rotations) or **Red-Black trees** (which use node colors and rotation rules to guarantee that the longest path is at most twice the shortest path, ensuring $O(\log n)$ worst-case time).
