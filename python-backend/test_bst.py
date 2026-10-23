"""
BST LAB — Academic Unit Test Suite
Assignment 16: BST-Based Contact Manager & Interactive Visualizer

Validates all 18 core requirements defined in Section 13 of the project specification.
Uses Python's standard `unittest` framework (no external packages required).
"""

import unittest
import os
import sys

# Ensure local module directory is in Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from bst import BinarySearchTree, BSTSessionManager, ContactNode


class TestBSTContactManager(unittest.TestCase):
    def setUp(self):
        """Creates a fresh, empty BinarySearchTree before every test case."""
        self.bst = BinarySearchTree()

    def test_01_empty_tree(self):
        """1. Empty tree initial properties."""
        self.assertTrue(self.bst.is_empty())
        self.assertEqual(self.bst.count(), 0)
        self.assertEqual(self.bst.height(), 0)
        self.assertIsNone(self.bst.root)
        self.assertEqual(self.bst.inorder(), [])
        self.assertIsNone(self.bst.serialize())

    def test_02_inserting_one_node(self):
        """2. Inserting one node becomes root."""
        is_new, msg = self.bst.insert("Kabir", "+91 98765 00001", "kabir@demo.edu")
        self.assertTrue(is_new)
        self.assertFalse(self.bst.is_empty())
        self.assertEqual(self.bst.count(), 1)
        self.assertEqual(self.bst.height(), 1)
        self.assertIsNotNone(self.bst.root)
        self.assertEqual(self.bst.root.name, "Kabir")
        self.assertEqual(self.bst.root.key, "kabir")
        self.assertIsNone(self.bst.root.left)
        self.assertIsNone(self.bst.root.right)

    def test_03_inserting_multiple_nodes(self):
        """3. Inserting multiple nodes places them according to BST invariant (left < root < right)."""
        # Insert Root
        self.bst.insert("Kabir")
        # Diya < Kabir -> left
        self.bst.insert("Diya")
        # Meera > Kabir -> right
        self.bst.insert("Meera")

        self.assertEqual(self.bst.count(), 3)
        self.assertEqual(self.bst.root.name, "Kabir")
        self.assertEqual(self.bst.root.left.name, "Diya")
        self.assertEqual(self.bst.root.right.name, "Meera")

    def test_04_searching_existing_node(self):
        """4. Searching for an existing node returns contact data, path, and comparison count."""
        self.bst.insert("Kabir")
        self.bst.insert("Diya")
        self.bst.insert("Meera")
        self.bst.insert("Aarav")

        result = self.bst.search("Aarav")
        self.assertTrue(result["found"])
        self.assertIsNotNone(result["contact"])
        self.assertEqual(result["contact"]["name"], "Aarav")
        # Path: Kabir -> Diya -> Aarav = 3 comparisons
        self.assertEqual(result["comparisons"], 3)
        self.assertEqual(result["path"], ["Kabir", "Diya", "Aarav"])

    def test_05_searching_missing_node(self):
        """5. Searching for a missing node returns found=False and the evaluated search path."""
        self.bst.insert("Kabir")
        self.bst.insert("Diya")
        self.bst.insert("Meera")

        result = self.bst.search("Zara")
        self.assertFalse(result["found"])
        self.assertIsNone(result["contact"])
        # Kabir -> Meera -> None
        self.assertEqual(result["comparisons"], 2)
        self.assertEqual(result["path"], ["Kabir", "Meera"])

    def test_06_alphabetical_inorder_traversal(self):
        """6. In-order traversal strictly produces alphabetically sorted contact names."""
        names = ["Meera", "Aarav", "Rohan", "Diya", "Kabir"]
        for n in names:
            self.bst.insert(n)

        inorder = self.bst.inorder()
        output_names = [item["name"] for item in inorder]
        self.assertEqual(output_names, ["Aarav", "Diya", "Kabir", "Meera", "Rohan"])

    def test_07_updating_duplicate_name(self):
        """7. Inserting duplicate name (case-insensitive) updates fields without creating a duplicate node."""
        self.bst.insert("Kabir", "+91 99999 11111", "old@demo.edu")
        self.assertEqual(self.bst.count(), 1)

        # Update with differing casing
        is_new, msg = self.bst.insert("KABIR", "+91 88888 22222", "new@demo.edu")
        self.assertFalse(is_new)
        self.assertEqual(self.bst.count(), 1, "Count must remain 1 after updating existing key")
        
        search_res = self.bst.search("kabir")
        self.assertTrue(search_res["found"])
        self.assertEqual(search_res["contact"]["phone"], "+91 88888 22222")
        self.assertEqual(search_res["contact"]["email"], "new@demo.edu")

    def test_08_deleting_leaf_node(self):
        """8. Deleting a leaf node (0 children) safely removes pointer from parent."""
        self.bst.insert("Kabir")
        self.bst.insert("Diya")
        self.bst.insert("Aarav")  # Aarav is a leaf under Diya

        success, msg = self.bst.delete("Aarav")
        self.assertTrue(success)
        self.assertIn("Case 1", msg)
        self.assertEqual(self.bst.count(), 2)
        self.assertIsNone(self.bst.root.left.left)
        self.assertFalse(self.bst.search("Aarav")["found"])

    def test_09_deleting_node_with_only_left_child(self):
        """9. Deleting a node with only a left child replaces node with left subtree."""
        self.bst.insert("Kabir")
        self.bst.insert("Diya")
        self.bst.insert("Aarav")  # Diya only has left child Aarav

        success, msg = self.bst.delete("Diya")
        self.assertTrue(success)
        self.assertIn("Case 3", msg)
        self.assertEqual(self.bst.count(), 2)
        # Kabir's left child should now be Aarav
        self.assertEqual(self.bst.root.left.name, "Aarav")

    def test_10_deleting_node_with_only_right_child(self):
        """10. Deleting a node with only a right child replaces node with right subtree."""
        self.bst.insert("Kabir")
        self.bst.insert("Meera")
        self.bst.insert("Rohan")  # Meera only has right child Rohan

        success, msg = self.bst.delete("Meera")
        self.assertTrue(success)
        self.assertIn("Case 2", msg)
        self.assertEqual(self.bst.count(), 2)
        # Kabir's right child should now be Rohan
        self.assertEqual(self.bst.root.right.name, "Rohan")

    def test_11_deleting_node_with_two_children(self):
        """11. Deleting node with two children correctly substitutes in-order successor."""
        # Tree:
        #        Kabir
        #       /     \
        #    Diya      Rohan
        #   /    \
        # Aarav  Gauri
        self.bst.insert("Kabir")
        self.bst.insert("Diya")
        self.bst.insert("Rohan")
        self.bst.insert("Aarav")
        self.bst.insert("Gauri")

        # Delete Diya (has two children: Aarav and Gauri; successor is Gauri)
        success, msg = self.bst.delete("Diya")
        self.assertTrue(success)
        self.assertIn("Case 4", msg)
        self.assertEqual(self.bst.count(), 4)
        self.assertEqual(self.bst.root.left.name, "Gauri")
        self.assertEqual(self.bst.root.left.left.name, "Aarav")
        self.assertIsNone(self.bst.root.left.right)

    def test_12_deleting_root(self):
        """12. Deleting root node correctly restructures tree."""
        self.bst.insert("Kabir")
        self.bst.insert("Diya")
        self.bst.insert("Meera")

        # Root Kabir has two children; successor in right subtree is Meera
        success, msg = self.bst.delete("Kabir")
        self.assertTrue(success)
        self.assertEqual(self.bst.count(), 2)
        self.assertEqual(self.bst.root.name, "Meera")
        self.assertEqual(self.bst.root.left.name, "Diya")

    def test_13_deleting_final_node(self):
        """13. Deleting the last remaining node in the tree resets root to None and count to 0."""
        self.bst.insert("Kabir")
        self.assertEqual(self.bst.count(), 1)

        success, msg = self.bst.delete("Kabir")
        self.assertTrue(success)
        self.assertEqual(self.bst.count(), 0)
        self.assertIsNone(self.bst.root)
        self.assertEqual(self.bst.height(), 0)

    def test_14_deleting_from_empty_tree(self):
        """14. Deleting from empty tree returns clean failure without throwing unhandled exceptions."""
        success, msg = self.bst.delete("Ghost")
        self.assertFalse(success)
        self.assertIn("empty", msg)

    def test_15_correct_count_after_operations(self):
        """15. Accurate count tracking through a series of insertions, duplicate updates, and deletions."""
        self.assertEqual(self.bst.count(), 0)
        self.bst.insert("A")
        self.bst.insert("B")
        self.bst.insert("C")
        self.assertEqual(self.bst.count(), 3)

        # Duplicate update
        self.bst.insert("a", "+91 000")
        self.assertEqual(self.bst.count(), 3)

        self.bst.delete("B")
        self.assertEqual(self.bst.count(), 2)
        self.bst.delete("A")
        self.assertEqual(self.bst.count(), 1)
        self.bst.delete("C")
        self.assertEqual(self.bst.count(), 0)

    def test_16_correct_tree_height(self):
        """16. Accurate tree height under balanced and skewed configurations."""
        self.assertEqual(self.bst.height(), 0)

        # 1 node -> height 1
        self.bst.insert("Kabir")
        self.assertEqual(self.bst.height(), 1)

        # Balanced additions
        self.bst.insert("Diya")   # left (height 2)
        self.assertEqual(self.bst.height(), 2)
        self.bst.insert("Meera")  # right (height still 2)
        self.assertEqual(self.bst.height(), 2)

        # Deep left additions
        self.bst.insert("Aarav")  # left of Diya (height 3)
        self.assertEqual(self.bst.height(), 3)

    def test_17_correct_search_path_information(self):
        """17. Accurate step-by-step search path reporting for visualizer highlights."""
        self.bst.insert("Kabir")
        self.bst.insert("Diya")
        self.bst.insert("Meera")
        self.bst.insert("Rohan")

        # Search for Rohan (Kabir -> Meera -> Rohan)
        res = self.bst.search("Rohan")
        self.assertTrue(res["found"])
        self.assertEqual(res["path"], ["Kabir", "Meera", "Rohan"])
        self.assertEqual(len(res["steps"]), 3)
        self.assertEqual(res["steps"][0]["direction"], "right")
        self.assertEqual(res["steps"][1]["direction"], "right")
        self.assertEqual(res["steps"][2]["direction"], "match")

    def test_18_separation_between_two_visitor_sessions(self):
        """18. Explicit isolation between two visitor sessions — session A never touches session B."""
        manager = BSTSessionManager()
        session_a = "user_session_alpha_123"
        session_b = "user_session_beta_456"

        bst_a = manager.get_or_create(session_a)
        bst_b = manager.get_or_create(session_b)

        # Reset both to known blank state for testing
        bst_a.reset()
        bst_b.reset()

        bst_a.insert("SessionAContact", "111")
        bst_b.insert("SessionBContact", "222")

        # Verify session A only sees its own contact
        self.assertEqual(bst_a.count(), 1)
        self.assertTrue(bst_a.search("SessionAContact")["found"])
        self.assertFalse(bst_a.search("SessionBContact")["found"])

        # Verify session B only sees its own contact
        self.assertEqual(bst_b.count(), 1)
        self.assertTrue(bst_b.search("SessionBContact")["found"])
        self.assertFalse(bst_b.search("SessionAContact")["found"])


if __name__ == "__main__":
    unittest.main()
