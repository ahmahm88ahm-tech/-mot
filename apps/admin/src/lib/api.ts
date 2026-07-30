const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const res = await fetch(`${API}/api/v1${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(opts.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`);
  return data;
}
