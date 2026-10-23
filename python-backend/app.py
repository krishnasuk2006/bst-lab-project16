"""
BST LAB — Python Flask REST API
Assignment 16: BST-Based Contact Manager & Interactive Visualizer
Data Structures & Algorithms Coursework

Runs an in-memory, session-isolated BST REST service exposing the required JSON contract.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
import re
import os
import sys

# Ensure local module directory is in Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from bst import BinarySearchTree, BSTSessionManager

app = Flask(__name__)
# Enable CORS for local and cross-origin development
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Central session manager ensuring visitor isolation
session_manager = BSTSessionManager()


def get_current_session_id() -> str:
    """Extracts or assigns an unpredictable visitor session identifier."""
    session_id = request.headers.get("X-Session-ID") or request.args.get("session_id")
    if not session_id or len(session_id.strip()) < 8:
        session_id = str(uuid.uuid4())
    return session_id.strip()


def sanitize_input(val: str, max_len: int = 100) -> str:
    """Basic sanitization and boundary check."""
    if not isinstance(val, str):
        return ""
    # Strip dangerous HTML/script characters
    cleaned = re.sub(r"[<>]", "", val)
    return cleaned.strip()[:max_len]


@app.after_request
def add_security_and_session_headers(response):
    """Echo session ID and security headers."""
    session_id = getattr(request, "_session_id", None)
    if session_id:
        response.headers["X-Session-ID"] = session_id
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    return response


@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint to verify Python API responsiveness."""
    return jsonify({
        "status": "healthy",
        "service": "BST LAB Python Service",
        "version": "1.0.0",
        "runtime": f"Python {sys.version.split()[0]}",
        "academic_assignment": 16
    }), 200


@app.route("/api/state", methods=["GET"])
def get_state():
    """
    Returns full state for the current visitor's BST:
    - Contacts in alphabetical in-order sequence
    - Hierarchical tree serialization for SVG rendering
    - Live structural statistics (count, height, root node)
    """
    session_id = get_current_session_id()
    request._session_id = session_id
    bst = session_manager.get_or_create(session_id)

    contacts = bst.inorder()
    tree = bst.serialize()
    root_name = bst.root.name if bst.root else None

    return jsonify({
        "session_id": session_id,
        "contacts": contacts,
        "tree": tree,
        "stats": {
            "count": bst.count(),
            "height": bst.height(),
            "root": root_name,
            "is_empty": bst.is_empty()
        }
    }), 200


@app.route("/api/contacts", methods=["POST"])
def add_contact():
    """
    Inserts a new contact or updates existing if key matches.
    JSON payload: {"name": str, "phone": str, "email": str}
    """
    session_id = get_current_session_id()
    request._session_id = session_id
    bst = session_manager.get_or_create(session_id)

    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid request. Expected JSON object with contact details."}), 400

    raw_name = data.get("name", "")
    name = sanitize_input(raw_name, max_len=60)
    phone = sanitize_input(data.get("phone", ""), max_len=30)
    email = sanitize_input(data.get("email", ""), max_len=80)

    if not name or len(name) < 2:
        return jsonify({"error": "Contact name is required and must have at least 2 characters."}), 400

    if email and not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        return jsonify({"error": "Invalid email address format."}), 400

    try:
        is_new, message = bst.insert(name=name, phone=phone, email=email)
        return jsonify({
            "success": True,
            "is_new": is_new,
            "message": message,
            "contact": {
                "name": name,
                "phone": phone,
                "email": email,
                "key": name.lower()
            },
            "stats": {
                "count": bst.count(),
                "height": bst.height(),
                "root": bst.root.name if bst.root else None
            }
        }), 201 if is_new else 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/contacts/search", methods=["GET"])
def search_contact():
    """
    Searches for a contact by name (case-insensitive) using standard BST lookup.
    Query parameter: ?name=...
    Returns search path, comparison steps, and matching contact details.
    """
    session_id = get_current_session_id()
    request._session_id = session_id
    bst = session_manager.get_or_create(session_id)

    name = request.args.get("name", "")
    clean_name = sanitize_input(name, max_len=60)

    if not clean_name:
        return jsonify({"error": "Query parameter 'name' is required."}), 400

    search_result = bst.search(clean_name)
    return jsonify(search_result), 200


@app.route("/api/contacts/<path:name>", methods=["DELETE"])
def delete_contact(name: str):
    """
    Deletes a contact by name handling all BST deletion cases (leaf, 1-child, 2-children with successor).
    """
    session_id = get_current_session_id()
    request._session_id = session_id
    bst = session_manager.get_or_create(session_id)

    clean_name = sanitize_input(name, max_len=60)
    if not clean_name:
        return jsonify({"error": "Invalid contact name provided for deletion."}), 400

    success, message = bst.delete(clean_name)
    if success:
        return jsonify({
            "success": True,
            "message": message,
            "stats": {
                "count": bst.count(),
                "height": bst.height(),
                "root": bst.root.name if bst.root else None,
                "is_empty": bst.is_empty()
            }
        }), 200
    else:
        return jsonify({
            "success": False,
            "message": message,
            "stats": {
                "count": bst.count(),
                "height": bst.height(),
                "root": bst.root.name if bst.root else None,
                "is_empty": bst.is_empty()
            }
        }), 404


@app.route("/api/demo", methods=["POST"])
def load_demo():
    """Loads standard educational sample contacts (Kabir, Diya, Meera, Aarav, Rohan)."""
    session_id = get_current_session_id()
    request._session_id = session_id
    bst = session_manager.get_or_create(session_id)
    bst.load_demo_contacts()

    return jsonify({
        "success": True,
        "message": "Fictional educational demonstration contacts loaded successfully.",
        "stats": {
            "count": bst.count(),
            "height": bst.height(),
            "root": bst.root.name if bst.root else None
        }
    }), 200


@app.route("/api/reset", methods=["POST"])
def reset_tree():
    """Clears the current visitor's tree completely."""
    session_id = get_current_session_id()
    request._session_id = session_id
    bst = session_manager.reset_session(session_id)

    return jsonify({
        "success": True,
        "message": "BST reset to clean empty state (Height: 0, Count: 0).",
        "stats": {
            "count": 0,
            "height": 0,
            "root": None,
            "is_empty": True
        }
    }), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting BST LAB Flask Service on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
