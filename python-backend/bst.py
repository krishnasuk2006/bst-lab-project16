"""
BST LAB — Core Binary Search Tree Implementation
Assignment 16: BST-Based Contact Manager & Interactive Visualizer
Data Structures & Algorithms Coursework

Author: Second-Year Engineering Coursework Implementation
Strict Compliance: Custom Node class, left/right pointers, case-insensitive keys.
"""

from typing import Optional, Dict, List, Any, Tuple
import threading
import time


class ContactNode:
    """
    Represents an individual node in the Binary Search Tree.
    Contains contact payload (name, phone, email) and pointers to left and right child nodes.
    """
    def __init__(self, name: str, phone: str = "", email: str = ""):
        clean_name = name.strip()
        if not clean_name:
            raise ValueError("Contact name cannot be empty.")
        self.name: str = clean_name
        self.phone: str = phone.strip()
        self.email: str = email.strip()
        # Case-insensitive alphabetical comparison key
        self.key: str = clean_name.lower()
        self.left: Optional['ContactNode'] = None
        self.right: Optional['ContactNode'] = None

    def to_dict(self) -> Dict[str, str]:
        """Returns flat dictionary representation of the contact."""
        return {
            "name": self.name,
            "phone": self.phone,
            "email": self.email,
            "key": self.key
        }


class BinarySearchTree:
    """
    Custom Binary Search Tree for Contact Management.
    Implements standard BST operations from scratch with O(h) recursion stack
    and strict alphabetical ordering based on contact name.
    """
    def __init__(self):
        self.root: Optional[ContactNode] = None
        self._count: int = 0

    def is_empty(self) -> bool:
        """Checks if the tree contains zero contacts."""
        return self.root is None

    def count(self) -> int:
        """Returns the total number of contacts in the tree."""
        return self._count

    def height(self) -> int:
        """
        Calculates the height of the tree.
        Academic convention:
        - Empty tree = 0
        - Tree with single root node = 1
        """
        def _get_height(node: Optional[ContactNode]) -> int:
            if node is None:
                return 0
            return 1 + max(_get_height(node.left), _get_height(node.right))

        return _get_height(self.root)

    def insert(self, name: str, phone: str = "", email: str = "") -> Tuple[bool, str]:
        """
        Inserts a new contact or updates existing contact if the key matches.
        Returns:
            (is_new_node: bool, message: str)
        """
        clean_name = name.strip()
        if not clean_name:
            raise ValueError("Contact name cannot be empty.")

        key = clean_name.lower()

        if self.root is None:
            self.root = ContactNode(clean_name, phone, email)
            self._count = 1
            return True, f"Contact '{clean_name}' inserted as root node."

        current = self.root
        while True:
            if key == current.key:
                # Key already exists: update existing contact details in place
                old_name = current.name
                current.name = clean_name  # preserve latest casing
                current.phone = phone.strip()
                current.email = email.strip()
                return False, f"Contact '{old_name}' updated with new information (case-insensitive duplicate key)."
            elif key < current.key:
                if current.left is None:
                    current.left = ContactNode(clean_name, phone, email)
                    self._count += 1
                    return True, f"Contact '{clean_name}' inserted into left subtree under '{current.name}'."
                current = current.left
            else:
                if current.right is None:
                    current.right = ContactNode(clean_name, phone, email)
                    self._count += 1
                    return True, f"Contact '{clean_name}' inserted into right subtree under '{current.name}'."
                current = current.right

    def search(self, name: str) -> Dict[str, Any]:
        """
        Searches for a contact by name (case-insensitive).
        Returns detailed traversal path and comparison counts for visualization.
        """
        clean_name = name.strip()
        if not clean_name:
            return {
                "found": False,
                "contact": None,
                "comparisons": 0,
                "path": [],
                "steps": [],
                "message": "Please enter a valid contact name to search."
            }

        target_key = clean_name.lower()
        comparisons = 0
        path: List[str] = []
        steps: List[Dict[str, Any]] = []

        current = self.root
        while current is not None:
            comparisons += 1
            path.append(current.name)

            if target_key == current.key:
                steps.append({
                    "node": current.name,
                    "comparison": f"'{target_key}' == '{current.key}'",
                    "action": "Target contact found!",
                    "direction": "match"
                })
                return {
                    "found": True,
                    "contact": current.to_dict(),
                    "comparisons": comparisons,
                    "path": path,
                    "steps": steps,
                    "message": f"Found '{current.name}' in {comparisons} comparison{'s' if comparisons != 1 else ''}."
                }
            elif target_key < current.key:
                steps.append({
                    "node": current.name,
                    "comparison": f"'{target_key}' < '{current.key}'",
                    "action": "Branch left (< alphabetical order)",
                    "direction": "left"
                })
                current = current.left
            else:
                steps.append({
                    "node": current.name,
                    "comparison": f"'{target_key}' > '{current.key}'",
                    "action": "Branch right (> alphabetical order)",
                    "direction": "right"
                })
                current = current.right

        # Not found after reaching a leaf's None pointer
        return {
            "found": False,
            "contact": None,
            "comparisons": comparisons,
            "path": path,
            "steps": steps,
            "message": f"Contact '{clean_name}' not found after {comparisons} comparison{'s' if comparisons != 1 else ''}."
        }

    def delete(self, name: str) -> Tuple[bool, str]:
        """
        Deletes a contact by name handling all 4 standard BST deletion cases:
        1. Leaf node (0 children)
        2. Node with only left child
        3. Node with only right child
        4. Node with two children (replaced by in-order successor)
        """
        clean_name = name.strip()
        if not clean_name or self.root is None:
            return False, f"Contact '{clean_name}' not found (tree is empty)."

        target_key = clean_name.lower()
        deleted_name = ""
        case_description = ""

        def _find_min(node: ContactNode) -> ContactNode:
            current = node
            while current.left is not None:
                current = current.left
            return current

        def _delete_node(node: Optional[ContactNode], key: str) -> Optional[ContactNode]:
            nonlocal deleted_name, case_description
            if node is None:
                return None

            if key < node.key:
                node.left = _delete_node(node.left, key)
                return node
            elif key > node.key:
                node.right = _delete_node(node.right, key)
                return node
            else:
                # Node to be deleted found
                deleted_name = node.name

                # Case 1: Leaf node
                if node.left is None and node.right is None:
                    case_description = "Case 1: Leaf node (no children). Simply removed pointer."
                    return None

                # Case 2: Node with only right child
                if node.left is None:
                    case_description = "Case 2: Node with single right child. Replaced node with right subtree."
                    return node.right

                # Case 3: Node with only left child
                if node.right is None:
                    case_description = "Case 3: Node with single left child. Replaced node with left subtree."
                    return node.left

                # Case 4: Node with two children
                # Find in-order successor (smallest in right subtree)
                successor = _find_min(node.right)
                primary_deleted_name = node.name
                primary_case = f"Case 4: Two children. Replaced '{node.name}' with in-order successor '{successor.name}'."
                
                # Copy successor data into current node
                node.name = successor.name
                node.phone = successor.phone
                node.email = successor.email
                node.key = successor.key

                # Delete successor from right subtree
                node.right = _delete_node(node.right, successor.key)
                
                # Restore top-level name and case description
                deleted_name = primary_deleted_name
                case_description = primary_case
                return node

        initial_count = self._count
        self.root = _delete_node(self.root, target_key)

        if deleted_name:
            self._count -= 1
            return True, f"Contact '{deleted_name}' deleted successfully. {case_description}"
        else:
            return False, f"Contact '{clean_name}' not found in the BST."

    def inorder(self) -> List[Dict[str, str]]:
        """
        Performs in-order traversal: Left subtree -> Current Node -> Right subtree.
        In a Binary Search Tree with alphabetical keys, this strictly yields contacts in sorted A-Z order.
        Time Complexity: O(n)
        Auxiliary Space: O(h) recursion stack
        """
        result: List[Dict[str, str]] = []

        def _traverse(node: Optional[ContactNode]):
            if node is not None:
                _traverse(node.left)
                result.append(node.to_dict())
                _traverse(node.right)

        _traverse(self.root)
        return result

    def serialize(self) -> Optional[Dict[str, Any]]:
        """
        Serializes the BST into a hierarchical JSON structure for SVG visualization.
        Computes subtree heights and relative branch indicators.
        """
        def _serialize_node(node: Optional[ContactNode], depth: int = 0) -> Optional[Dict[str, Any]]:
            if node is None:
                return None
            return {
                "name": node.name,
                "phone": node.phone,
                "email": node.email,
                "key": node.key,
                "depth": depth,
                "left": _serialize_node(node.left, depth + 1),
                "right": _serialize_node(node.right, depth + 1),
                "has_left": node.left is not None,
                "has_right": node.right is not None
            }

        return _serialize_node(self.root, 0)

    def load_demo_contacts(self) -> None:
        """
        Seeds standard educational demo contacts.
        Inserted in deliberate order (Kabir, Diya, Meera, Aarav, Rohan)
        to form a multi-level, well-distributed BST suitable for classroom explanation.
        """
        self.reset()
        demo_contacts = [
            ("Kabir", "+91 98765 43210", "kabir@demo.edu"),
            ("Diya", "+91 98765 43211", "diya@demo.edu"),
            ("Meera", "+91 98765 43212", "meera@demo.edu"),
            ("Aarav", "+91 98765 43213", "aarav@demo.edu"),
            ("Rohan", "+91 98765 43214", "rohan@demo.edu"),
        ]
        for name, phone, email in demo_contacts:
            self.insert(name, phone, email)

    def reset(self) -> None:
        """Clears all contacts and resets the tree."""
        self.root = None
        self._count = 0


class BSTSessionManager:
    """
    Manages isolated in-memory BST instances per visitor session.
    Protects user privacy: a visitor never sees or mutates another visitor's tree.
    """
    def __init__(self, max_sessions: int = 200, session_timeout_seconds: int = 7200):
        self._sessions: Dict[str, Dict[str, Any]] = {}
        self._lock = threading.Lock()
        self._max_sessions = max_sessions
        self._timeout = session_timeout_seconds

    def get_or_create(self, session_id: str) -> BinarySearchTree:
        now = time.time()
        with self._lock:
            # Clean expired sessions if collection grows large
            if len(self._sessions) > self._max_sessions:
                expired = [
                    sid for sid, data in self._sessions.items()
                    if now - data["last_accessed"] > self._timeout
                ]
                for sid in expired:
                    del self._sessions[sid]

            if session_id not in self._sessions:
                bst = BinarySearchTree()
                # Initialize new session with the 5 demo contacts so user starts with a visualized tree
                bst.load_demo_contacts()
                self._sessions[session_id] = {
                    "bst": bst,
                    "last_accessed": now
                }
            else:
                self._sessions[session_id]["last_accessed"] = now

            return self._sessions[session_id]["bst"]

    def reset_session(self, session_id: str) -> BinarySearchTree:
        with self._lock:
            bst = BinarySearchTree()
            self._sessions[session_id] = {
                "bst": bst,
                "last_accessed": time.time()
            }
            return bst
