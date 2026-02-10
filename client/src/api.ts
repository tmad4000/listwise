const BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('listwise_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export interface ListSummary {
  title: string;
  description: string;
  category: string;
  tags: string[];
  owner: string;
  slug: string;
  updated: string;
}

export interface ListData {
  meta: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    created: string;
    updated: string;
    public: boolean;
  };
  content: string;
  owner: string;
  slug: string;
}

export interface AuthUser {
  username: string;
  displayName: string;
}

export interface SampleAccount {
  username: string;
  displayName: string;
  isSample: boolean;
}

// Auth
export const api = {
  login: (username: string, password: string) =>
    request<{ token: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  signup: (username: string, password: string, displayName: string) =>
    request<{ token: string; user: AuthUser }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, password, displayName }),
    }),

  sampleLogin: (username: string) =>
    request<{ token: string; user: AuthUser }>('/auth/sample-login', {
      method: 'POST',
      body: JSON.stringify({ username }),
    }),

  getMe: () => request<{ user: AuthUser | null }>('/auth/me'),

  getSampleAccounts: () => request<{ accounts: SampleAccount[] }>('/auth/sample-accounts'),

  // Lists
  getLists: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ lists: ListSummary[] }>(`/lists${query}`);
  },

  getCategories: () => request<{ categories: string[] }>('/lists/categories'),

  getList: (owner: string, slug: string) =>
    request<ListData>(`/lists/${owner}/${slug}`),

  createList: (data: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    content: string;
    isPublic: boolean;
  }) =>
    request<{ owner: string; slug: string; editToken?: string }>('/lists', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateList: (owner: string, slug: string, data: Record<string, unknown>, editToken?: string) => {
    const headers: Record<string, string> = {};
    if (editToken) headers['x-edit-token'] = editToken;
    return request<{ owner: string; slug: string }>(`/lists/${owner}/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers,
    });
  },

  deleteList: (owner: string, slug: string) =>
    request<{ deleted: boolean }>(`/lists/${owner}/${slug}`, { method: 'DELETE' }),

  getUserLists: (username: string) =>
    request<{ lists: ListSummary[] }>(`/lists?user=${username}`),
};
