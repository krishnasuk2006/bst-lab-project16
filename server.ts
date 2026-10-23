/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const PYTHON_BST_API_URL = (process.env.PYTHON_BST_API_URL || '').replace(/\/$/, '');

app.use(express.json({ limit: '200kb' }));

// Educational fictional preview dataset used when Python microservice is not yet connected
const PREVIEW_CONTACTS = [
  { name: 'Aarav', phone: '+91 98765 43213', email: 'aarav@demo.edu', key: 'aarav' },
  { name: 'Diya', phone: '+91 98765 43211', email: 'diya@demo.edu', key: 'diya' },
  { name: 'Kabir', phone: '+91 98765 43210', email: 'kabir@demo.edu', key: 'kabir' },
  { name: 'Meera', phone: '+91 98765 43212', email: 'meera@demo.edu', key: 'meera' },
  { name: 'Rohan', phone: '+91 98765 43214', email: 'rohan@demo.edu', key: 'rohan' },
];

const PREVIEW_TREE = {
  name: 'Kabir',
  phone: '+91 98765 43210',
  email: 'kabir@demo.edu',
  key: 'kabir',
  depth: 0,
  has_left: true,
  has_right: true,
  left: {
    name: 'Diya',
    phone: '+91 98765 43211',
    email: 'diya@demo.edu',
    key: 'diya',
    depth: 1,
    has_left: true,
    has_right: false,
    left: {
      name: 'Aarav',
      phone: '+91 98765 43213',
      email: 'aarav@demo.edu',
      key: 'aarav',
      depth: 2,
      has_left: false,
      has_right: false,
      left: null,
      right: null,
    },
    right: null,
  },
  right: {
    name: 'Meera',
    phone: '+91 98765 43212',
    email: 'meera@demo.edu',
    key: 'meera',
    depth: 1,
    has_left: false,
    has_right: true,
    left: null,
    right: {
      name: 'Rohan',
      phone: '+91 98765 43214',
      email: 'rohan@demo.edu',
      key: 'rohan',
      depth: 2,
      has_left: false,
      has_right: false,
      left: null,
      right: null,
    },
  },
};

// --- Proxy Helper ---
async function forwardToPython(
  req: Request,
  res: Response,
  endpoint: string,
  method: string = req.method,
  body?: any
) {
  if (!PYTHON_BST_API_URL) {
    return null;
  }

  const targetUrl = `${PYTHON_BST_API_URL}${endpoint}`;
  const sessionId = req.headers['x-session-id'] || 'default-session';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Session-ID': String(sessionId),
    };

    const options: RequestInit = {
      method,
      headers,
      signal: controller.signal,
    };

    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(targetUrl, options);
    clearTimeout(timeout);

    const data = await response.json().catch(() => ({}));
    return { status: response.status, data };
  } catch (err: any) {
    return null;
  }
}

// 1. Health check endpoint
app.get('/api/health', async (req: Request, res: Response) => {
  if (!PYTHON_BST_API_URL) {
    return res.json({
      status: 'ok',
      connected: false,
      python_url: null,
      mode: 'preview',
      message: 'Python BST service URL is not configured. BST LAB is operating in Preview Mode.',
    });
  }

  const result = await forwardToPython(req, res, '/api/health', 'GET');
  if (result && result.status === 200) {
    return res.json({
      status: 'ok',
      connected: true,
      python_url: PYTHON_BST_API_URL,
      mode: 'live',
      service_info: result.data,
      message: 'Connected to live Python Flask BST microservice.',
    });
  }

  return res.json({
    status: 'ok',
    connected: false,
    python_url: PYTHON_BST_API_URL,
    mode: 'preview',
    message: `Unable to connect to Python BST microservice at ${PYTHON_BST_API_URL}. Showing Preview Mode.`,
  });
});

// 2. State endpoint
app.get('/api/state', async (req: Request, res: Response) => {
  const result = await forwardToPython(req, res, '/api/state', 'GET');
  if (result) {
    return res.status(result.status).json({
      ...result.data,
      is_preview: false,
    });
  }

  // Fictional Preview Mode fallback
  return res.json({
    session_id: 'preview-session',
    contacts: PREVIEW_CONTACTS,
    tree: PREVIEW_TREE,
    stats: {
      count: PREVIEW_CONTACTS.length,
      height: 3,
      root: 'Kabir',
      is_empty: false,
    },
    is_preview: true,
    preview_notice: 'Educational Preview Mode: Python Flask BST backend is not connected. Fictional sample tree shown.',
  });
});

// 3. Search endpoint
app.get('/api/contacts/search', async (req: Request, res: Response) => {
  const queryName = String(req.query.name || '');
  const result = await forwardToPython(req, res, `/api/contacts/search?name=${encodeURIComponent(queryName)}`, 'GET');

  if (result) {
    return res.status(result.status).json(result.data);
  }

  // Preview Mode search logic based on the educational preview tree (Kabir -> Diya -> Aarav / Meera -> Rohan)
  const cleanTarget = queryName.trim().toLowerCase();
  if (!cleanTarget) {
    return res.status(400).json({ error: "Query parameter 'name' is required." });
  }

  let comparisons = 0;
  const path: string[] = [];
  const steps: any[] = [];
  let foundContact: any = null;

  // Simulate search on Preview tree: Kabir (root), Diya (left), Meera (right), Aarav (Diya left), Rohan (Meera right)
  comparisons += 1;
  path.push('Kabir');
  if (cleanTarget === 'kabir') {
    foundContact = PREVIEW_CONTACTS.find((c) => c.key === 'kabir');
    steps.push({ node: 'Kabir', comparison: "'kabir' == 'kabir'", action: 'Target found!', direction: 'match' });
  } else if (cleanTarget < 'kabir') {
    steps.push({ node: 'Kabir', comparison: `'${cleanTarget}' < 'kabir'`, action: 'Branch left', direction: 'left' });
    comparisons += 1;
    path.push('Diya');
    if (cleanTarget === 'diya') {
      foundContact = PREVIEW_CONTACTS.find((c) => c.key === 'diya');
      steps.push({ node: 'Diya', comparison: "'diya' == 'diya'", action: 'Target found!', direction: 'match' });
    } else if (cleanTarget < 'diya') {
      steps.push({ node: 'Diya', comparison: `'${cleanTarget}' < 'diya'`, action: 'Branch left', direction: 'left' });
      comparisons += 1;
      path.push('Aarav');
      if (cleanTarget === 'aarav') {
        foundContact = PREVIEW_CONTACTS.find((c) => c.key === 'aarav');
        steps.push({ node: 'Aarav', comparison: "'aarav' == 'aarav'", action: 'Target found!', direction: 'match' });
      }
    }
  } else {
    steps.push({ node: 'Kabir', comparison: `'${cleanTarget}' > 'kabir'`, action: 'Branch right', direction: 'right' });
    comparisons += 1;
    path.push('Meera');
    if (cleanTarget === 'meera') {
      foundContact = PREVIEW_CONTACTS.find((c) => c.key === 'meera');
      steps.push({ node: 'Meera', comparison: "'meera' == 'meera'", action: 'Target found!', direction: 'match' });
    } else if (cleanTarget > 'meera') {
      steps.push({ node: 'Meera', comparison: `'${cleanTarget}' > 'meera'`, action: 'Branch right', direction: 'right' });
      comparisons += 1;
      path.push('Rohan');
      if (cleanTarget === 'rohan') {
        foundContact = PREVIEW_CONTACTS.find((c) => c.key === 'rohan');
        steps.push({ node: 'Rohan', comparison: "'rohan' == 'rohan'", action: 'Target found!', direction: 'match' });
      }
    }
  }

  return res.json({
    found: Boolean(foundContact),
    contact: foundContact,
    comparisons,
    path,
    steps,
    message: foundContact
      ? `[Preview] Found '${foundContact.name}' in ${comparisons} comparison${comparisons !== 1 ? 's' : ''}.`
      : `[Preview] Contact '${queryName}' not found in sample tree after ${comparisons} comparison${comparisons !== 1 ? 's' : ''}.`,
    is_preview: true,
  });
});

// 4. Contact Insert/Update endpoint
app.post('/api/contacts', async (req: Request, res: Response) => {
  const result = await forwardToPython(req, res, '/api/contacts', 'POST', req.body);
  if (result) {
    return res.status(result.status).json(result.data);
  }

  return res.status(503).json({
    error: 'python_service_unavailable',
    is_preview: true,
    message:
      'Live contact insertion requires the Python BST microservice to be active. Please run the Flask service in python-backend/ (`python app.py`) and set PYTHON_BST_API_URL.',
  });
});

// 5. Contact Delete endpoint
app.delete('/api/contacts/:name', async (req: Request, res: Response) => {
  const contactName = req.params.name;
  const result = await forwardToPython(req, res, `/api/contacts/${encodeURIComponent(contactName)}`, 'DELETE');
  if (result) {
    return res.status(result.status).json(result.data);
  }

  return res.status(503).json({
    error: 'python_service_unavailable',
    is_preview: true,
    message:
      'Live contact deletion requires the Python BST microservice to be active. Please start the Flask service in python-backend/ (`python app.py`) and set PYTHON_BST_API_URL.',
  });
});

// 6. Demo reset & re-seed endpoints
app.post('/api/demo', async (req: Request, res: Response) => {
  const result = await forwardToPython(req, res, '/api/demo', 'POST');
  if (result) {
    return res.status(result.status).json(result.data);
  }

  return res.json({
    success: true,
    is_preview: true,
    message: 'Preview demonstration dataset reloaded.',
  });
});

app.post('/api/reset', async (req: Request, res: Response) => {
  const result = await forwardToPython(req, res, '/api/reset', 'POST');
  if (result) {
    return res.status(result.status).json(result.data);
  }

  return res.status(503).json({
    error: 'python_service_unavailable',
    is_preview: true,
    message: 'Resetting the live BST requires the Python backend to be connected.',
  });
});

// Vite dev middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BST LAB] Express Server running on port ${PORT}`);
    if (PYTHON_BST_API_URL) {
      console.log(`[BST LAB] Proxying Python BST requests to: ${PYTHON_BST_API_URL}`);
    } else {
      console.log(`[BST LAB] PYTHON_BST_API_URL unset — Preview Mode enabled`);
    }
  });
}

startServer();
