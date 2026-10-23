# BST LAB — Production Deployment Guide
**Assignment 16: BST-Based Contact Manager & Interactive Visualizer**

---

## 1. Architecture Overview

BST LAB consists of two decoupled components:
1. **Frontend Application & Node.js Proxy:** React 19 SPA served via Node.js Express (`server.ts`).
2. **Python Flask BST Service:** Pure Python 3 in-memory Binary Search Tree REST API (`python-backend/app.py`).

Because AI Studio Build mode hosts the Node.js application, the separate Python service should be deployed to a standard Python hosting platform (e.g., Render, Railway, Fly.io, or AWS App Runner), and connected via the `PYTHON_BST_API_URL` environment variable.

---

## 2. Deploying the Python Backend Service

### Option A: Deploy on Render (Recommended Free/Hobby Tier)

1. Create a free account at [render.com](https://render.com).
2. Click **New +** &rarr; **Web Service**.
3. Connect your Git repository (or upload the `python-backend` directory).
4. Configure the service settings:
   - **Name:** `bst-lab-python-api`
   - **Root Directory:** `python-backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn -w 2 -b 0.0.0.0:$PORT app:app`
5. Click **Create Web Service**.
6. Once deployed, Render will provide a public HTTPS URL:
   `https://bst-lab-python-api.onrender.com`

### Option B: Deploy on Railway

1. Install the Railway CLI or use the web dashboard at [railway.app](https://railway.app).
2. Create a new project pointing to `python-backend`.
3. Set the start command to `gunicorn -w 2 -b 0.0.0.0:$PORT app:app`.
4. Generate a public domain (e.g. `https://python-backend-production-xyz.up.railway.app`).

### Verifying the Python Deployment
Open the health check endpoint in your browser or curl:
```bash
curl https://bst-lab-python-api.onrender.com/api/health
```
Expected output:
```json
{
  "status": "healthy",
  "service": "BST LAB Python Service",
  "version": "1.0.0",
  "runtime": "Python 3.10.x",
  "academic_assignment": 16
}
```

---

## 3. Configuring the Frontend & Integration Layer

Once the Python backend is live, configure the frontend to communicate with it:

### Step 1: Set Environment Variable
In your frontend hosting platform's environment settings (or in `.env` for local testing), set:

```env
PYTHON_BST_API_URL="https://bst-lab-python-api.onrender.com"
```

*Important:* Never commit secret credentials to git. `PYTHON_BST_API_URL` is read strictly on the Node.js server side (`server.ts`) and is never exposed directly in frontend client bundles.

### Step 2: Build and Start Frontend

```bash
# Build the production frontend bundle
npm run build

# Start the full-stack server
npm start
```

---

## 4. Health Check Verification Procedure

1. Navigate to your deployed application in a web browser.
2. Observe the connection badge in the header:
   - **Green Badge ("Python API Connected"):** The Node.js proxy successfully reached the Python backend, and live tree operations are active.
   - **Amber Badge ("Preview Mode"):** The frontend is displaying the sample tree. Click the badge to verify why the endpoint is unreachable.
3. Perform a quick verification cycle:
   - Insert a contact: `"Zoya"`, `"+91 98765 00000"`, `"zoya@demo.edu"`.
   - Verify `"Zoya"` appears in the SVG visualizer canvas under the right branch of `"Rohan"`.
   - Search for `"Zoya"` and confirm the search path highlights in teal.
   - Delete `"Zoya"` and confirm node removal.

---

## 5. Security & Academic Integrity Notes

- **Fictional Data Only:** This application is strictly an educational tool for academic demonstration and algorithm visualization. Do not store real personal phone numbers or confidential information.
- **In-Memory Volatility:** In-memory session trees reset when the Python service restarts or re-deploys.
