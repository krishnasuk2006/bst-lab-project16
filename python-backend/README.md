# BST LAB — Python Flask Backend Service
**Assignment 16: BST-Based Contact Manager & Interactive Visualizer**
*B.Tech Semester 3 Data Structures Coursework*

---

## Overview

This standalone microservice provides the core in-memory Binary Search Tree (BST) algorithms for **BST LAB**. It is implemented in pure Python 3 using a custom `ContactNode` class with left/right pointers, case-insensitive key normalization, and per-visitor session isolation.

No database, dictionary lookup, or built-in sorted collections are substituted for the core tree operations.

---

## Project Structure

```
python-backend/
├── bst.py             # Custom ContactNode, BinarySearchTree, and Session Manager
├── app.py             # Flask REST JSON API endpoints (/api/*)
├── test_bst.py        # 18 comprehensive academic unit tests (unittest)
├── requirements.txt   # Flask, Flask-CORS, and Gunicorn dependencies
└── README.md          # Setup and execution guide
```

---

## Local Setup & Run Instructions

### 1. Prerequisites
- Python 3.9, 3.10, 3.11, or 3.12 installed
- Virtual environment tool (`venv`)

### 2. Windows Setup (PowerShell)

Open PowerShell and navigate to the `python-backend` directory:

```powershell
cd python-backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
.\venv\Scripts\Activate.ps1

# Install required dependencies
pip install -r requirements.txt

# Run the 18 automated unit tests
python -m unittest test_bst.py -v

# Start the Flask API service (runs on port 5000 by default)
python app.py
```

*Note: If PowerShell displays an `Execution_Policies` restriction when activating the venv, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` and then run `.\venv\Scripts\Activate.ps1` again.*

### 3. Windows Setup (Command Prompt / cmd.exe)

```cmd
cd python-backend
python -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt
python -m unittest test_bst.py -v
python app.py
```

### 4. macOS / Linux Setup (Bash / Zsh)

```bash
cd python-backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the 18 automated unit tests
python3 -m unittest test_bst.py -v

# Start the Flask API service
python3 app.py
```

The Flask backend will start on `http://127.0.0.1:5000`.

---

## Automated Unit Testing

The test suite in `test_bst.py` validates all 18 requirements without external dependencies:

```bash
python3 -m unittest test_bst.py -v
```

Expected output:
```
test_01_empty_tree (__main__.TestBSTContactManager) ... ok
test_02_inserting_one_node (__main__.TestBSTContactManager) ... ok
test_03_inserting_multiple_nodes (__main__.TestBSTContactManager) ... ok
test_04_searching_existing_node (__main__.TestBSTContactManager) ... ok
test_05_searching_missing_node (__main__.TestBSTContactManager) ... ok
test_06_alphabetical_inorder_traversal (__main__.TestBSTContactManager) ... ok
test_07_updating_duplicate_name (__main__.TestBSTContactManager) ... ok
test_08_deleting_leaf_node (__main__.TestBSTContactManager) ... ok
test_09_deleting_node_with_only_left_child (__main__.TestBSTContactManager) ... ok
test_10_deleting_node_with_only_right_child (__main__.TestBSTContactManager) ... ok
test_11_deleting_node_with_two_children (__main__.TestBSTContactManager) ... ok
test_12_deleting_root (__main__.TestBSTContactManager) ... ok
test_13_deleting_final_node (__main__.TestBSTContactManager) ... ok
test_14_deleting_from_empty_tree (__main__.TestBSTContactManager) ... ok
test_15_correct_count_after_operations (__main__.TestBSTContactManager) ... ok
test_16_correct_tree_height (__main__.TestBSTContactManager) ... ok
test_17_correct_search_path_information (__main__.TestBSTContactManager) ... ok
test_18_separation_between_two_visitor_sessions (__main__.TestBSTContactManager) ... ok
----------------------------------------------------------------------
Ran 18 tests in 0.003s
OK
```

---

## Connecting with the Node.js / React Frontend

In the root of the project, configure your `.env` or set the environment variable:

```bash
PYTHON_BST_API_URL="http://127.0.0.1:5000"
```

When started, the Node.js integration layer (`server.ts`) will forward `/api/*` requests directly to this Python service.
