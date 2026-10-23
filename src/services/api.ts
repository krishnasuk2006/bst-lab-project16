/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SerializedTreeNode } from '../utils/treeLayout';

export type { SerializedTreeNode };

export interface Contact {
  name: string;
  phone: string;
  email: string;
  key: string;
}

export interface TreeStats {
  count: number;
  height: number;
  root: string | null;
  is_empty?: boolean;
}

export interface StateResponse {
  session_id: string;
  contacts: Contact[];
  tree: SerializedTreeNode | null;
  stats: TreeStats;
  is_preview?: boolean;
  preview_notice?: string;
}

export interface HealthResponse {
  status: string;
  connected: boolean;
  python_url: string | null;
  mode: 'live' | 'preview';
  message: string;
  service_info?: any;
}

export interface SearchStep {
  node: string;
  comparison: string;
  action: string;
  direction: 'left' | 'right' | 'match' | 'root';
}

export interface SearchResponse {
  found: boolean;
  contact: Contact | null;
  comparisons: number;
  path: string[];
  steps?: SearchStep[];
  message: string;
  is_preview?: boolean;
}

export interface MutationResponse {
  success?: boolean;
  is_new?: boolean;
  message: string;
  contact?: Contact;
  stats?: TreeStats;
  error?: string;
  is_preview?: boolean;
}

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server-session';
  let sid = sessionStorage.getItem('bst_lab_session_id');
  if (!sid) {
    sid = 'bst-ses-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now().toString(36);
    sessionStorage.setItem('bst_lab_session_id', sid);
  }
  return sid;
}

const DEFAULT_PYTHON_API_URL = 'https://bst-lab-python-api.onrender.com';

export const API_BASE_URL: string = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PYTHON_BST_API_URL) ||
  DEFAULT_PYTHON_API_URL
).replace(/\/$/, '');

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const sessionId = getOrCreateSessionId();
  const headers = new Headers(options.headers || {});
  headers.set('X-Session-ID', sessionId);
  if (!headers.has('Content-Type') && options.method && ['POST', 'PUT', 'DELETE'].includes(options.method)) {
    headers.set('Content-Type', 'application/json');
  }

  // Prepend API_BASE_URL to prevent requests from hitting local or Netlify /api routes
  const url = endpoint.startsWith('http://') || endpoint.startsWith('https://')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || data.error || `HTTP error ${response.status}`;
    const err = new Error(errorMsg) as Error & { status: number; data: any };
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data as T;
}

export const bstApi = {
  getBaseUrl(): string {
    return API_BASE_URL;
  },

  async getHealth(): Promise<HealthResponse> {
    try {
      const data = await request<any>('/api/health');
      const isHealthy = data?.status === 'healthy' || data?.status === 'ok';
      return {
        status: data?.status || 'healthy',
        connected: isHealthy,
        python_url: API_BASE_URL,
        mode: isHealthy ? 'live' : 'preview',
        message: isHealthy
          ? `Connected to live Python Flask BST backend at ${API_BASE_URL}`
          : 'Backend returned non-healthy status.',
        service_info: data,
      };
    } catch (e: any) {
      return {
        status: 'error',
        connected: false,
        python_url: API_BASE_URL,
        mode: 'preview',
        message: `Could not reach Python BST backend at ${API_BASE_URL}: ${e.message}`,
      };
    }
  },

  async getState(): Promise<StateResponse> {
    return await request<StateResponse>('/api/state');
  },

  async searchContact(name: string): Promise<SearchResponse> {
    return await request<SearchResponse>(`/api/contacts/search?name=${encodeURIComponent(name)}`);
  },

  async addContact(contact: { name: string; phone?: string; email?: string }): Promise<MutationResponse> {
    return await request<MutationResponse>('/api/contacts', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  },

  async deleteContact(name: string): Promise<MutationResponse> {
    return await request<MutationResponse>(`/api/contacts/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    });
  },

  async loadDemo(): Promise<MutationResponse> {
    return await request<MutationResponse>('/api/demo', {
      method: 'POST',
    });
  },

  async resetTree(): Promise<MutationResponse> {
    return await request<MutationResponse>('/api/reset', {
      method: 'POST',
    });
  },
};
