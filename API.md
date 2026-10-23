# BST LAB — REST API Contract
**Assignment 16: BST-Based Contact Manager & Interactive Visualizer**

---

## 1. Overview

The BST LAB platform uses a decoupled client-server architecture:
- **Python Flask Microservice:** Implements the pure Binary Search Tree logic in `python-backend/app.py`.
- **Node.js Integration Layer:** Acts as an Express reverse-proxy (`server.ts`) forwarding requests to the Python service with visitor session identifiers, handling timeouts, and serving the React client.

All request and response payloads use JSON with standard HTTP status codes.

---

## 2. Session Management & Privacy

To ensure data privacy and user isolation:
- Every client request includes an `X-Session-ID` header.
- The Python backend maps this identifier to an isolated in-memory `BinarySearchTree` instance.
- A visitor **never** sees or alters another visitor's tree.
- In-memory data is temporary and resets when backend services restart.

---

## 3. Endpoints

### 3.1 Health Check
**`GET /api/health`**

Validates service availability and connectivity.

#### Response (200 OK — Connected):
```json
{
  "status": "healthy",
  "service": "BST LAB Python Service",
  "version": "1.0.0",
  "runtime": "Python 3.10.12",
  "academic_assignment": 16
}
```

---

### 3.2 Get Tree State
**`GET /api/state`**

Returns the full state of the visitor's BST, including the sorted contact list, hierarchical tree structure for SVG rendering, and structural statistics.

#### Headers:
- `X-Session-ID`: `<uuid-or-session-string>`

#### Response (200 OK):
```json
{
  "session_id": "bst-ses-xyz123",
  "contacts": [
    { "name": "Aarav", "phone": "+91 98765 43213", "email": "aarav@demo.edu", "key": "aarav" },
    { "name": "Diya", "phone": "+91 98765 43211", "email": "diya@demo.edu", "key": "diya" },
    { "name": "Kabir", "phone": "+91 98765 43210", "email": "kabir@demo.edu", "key": "kabir" },
    { "name": "Meera", "phone": "+91 98765 43212", "email": "meera@demo.edu", "key": "meera" },
    { "name": "Rohan", "phone": "+91 98765 43214", "email": "rohan@demo.edu", "key": "rohan" }
  ],
  "tree": {
    "name": "Kabir",
    "phone": "+91 98765 43210",
    "email": "kabir@demo.edu",
    "key": "kabir",
    "depth": 0,
    "has_left": true,
    "has_right": true,
    "left": {
      "name": "Diya",
      "phone": "+91 98765 43211",
      "email": "diya@demo.edu",
      "key": "diya",
      "depth": 1,
      "left": { "name": "Aarav", "depth": 2, "left": null, "right": null },
      "right": null
    },
    "right": {
      "name": "Meera",
      "phone": "+91 98765 43212",
      "email": "meera@demo.edu",
      "key": "meera",
      "depth": 1,
      "left": null,
      "right": { "name": "Rohan", "depth": 2, "left": null, "right": null }
    }
  },
  "stats": {
    "count": 5,
    "height": 3,
    "root": "Kabir",
    "is_empty": false
  }
}
```

---

### 3.3 Insert or Update Contact
**`POST /api/contacts`**

Inserts a new contact or updates contact details if a matching case-insensitive key already exists.

#### Request Body:
```json
{
  "name": "Bhavna",
  "phone": "+91 98765 00000",
  "email": "bhavna@demo.edu"
}
```

#### Response (201 Created — New Node):
```json
{
  "success": true,
  "is_new": true,
  "message": "Contact 'Bhavna' inserted into right subtree under 'Aarav'.",
  "contact": {
    "name": "Bhavna",
    "phone": "+91 98765 00000",
    "email": "bhavna@demo.edu",
    "key": "bhavna"
  },
  "stats": {
    "count": 6,
    "height": 3,
    "root": "Kabir"
  }
}
```

#### Response (200 OK — Updated Existing Key):
```json
{
  "success": true,
  "is_new": false,
  "message": "Contact 'Bhavna' updated with new information (case-insensitive duplicate key).",
  "contact": { ... },
  "stats": { "count": 6, "height": 3, "root": "Kabir" }
}
```

---

### 3.4 Search Contact by Name
**`GET /api/contacts/search?name=<query>`**

Performs BST binary search and returns comparison counts, visited nodes, and path decisions.

#### Query Parameters:
- `name`: Target contact name (e.g. `?name=Aarav`)

#### Response (200 OK — Match Found):
```json
{
  "found": true,
  "contact": {
    "name": "Aarav",
    "phone": "+91 98765 43213",
    "email": "aarav@demo.edu",
    "key": "aarav"
  },
  "comparisons": 3,
  "path": ["Kabir", "Diya", "Aarav"],
  "steps": [
    { "node": "Kabir", "comparison": "'aarav' < 'kabir'", "action": "Branch left (< alphabetical order)", "direction": "left" },
    { "node": "Diya", "comparison": "'aarav' < 'diya'", "action": "Branch left (< alphabetical order)", "direction": "left" },
    { "node": "Aarav", "comparison": "'aarav' == 'aarav'", "action": "Target contact found!", "direction": "match" }
  ],
  "message": "Found 'Aarav' in 3 comparisons."
}
```

---

### 3.5 Delete Contact
**`DELETE /api/contacts/<name>`**

Deletes a contact by key handling all 4 deletion cases.

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Contact 'Diya' deleted successfully. Case 4: Two children. Replaced 'Diya' with in-order successor 'Gauri'.",
  "stats": {
    "count": 4,
    "height": 3,
    "root": "Kabir",
    "is_empty": false
  }
}
```

#### Response (404 Not Found):
```json
{
  "success": false,
  "message": "Contact 'Zara' not found in the BST.",
  "stats": { ... }
}
```

---

### 3.6 Load Demo Contacts
**`POST /api/demo`**

Re-seeds the current visitor's session with the 5 standard educational demo contacts (`Kabir`, `Diya`, `Meera`, `Aarav`, `Rohan`).

---

### 3.7 Reset Tree
**`POST /api/reset`**

Clears all contacts for the current visitor session, resetting height to 0 and count to 0.
