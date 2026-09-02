const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  let token = '';
  if (typeof window === 'undefined') {
    // No servidor
    const { cookies } = require('next/headers');
    const cookieStore = await cookies();
    token = cookieStore.get('token')?.value || '';
  } else {
    // No cliente
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    if (match) token = match[2];
  }

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      console.warn(`[Mock API] Suppressed error for ${url}: ${response.statusText}`);
      return [];
    }

    return response.json();
  } catch (error) {
    console.warn(`[Mock API] Suppressed fetch error for ${url}:`, error);
    return [];
  }
}

export const api = {
  get: (url: string) => fetchApi(url).then(data => ({ data })),
  post: (url: string, data: any) => fetchApi(url, { method: 'POST', body: JSON.stringify(data) }).then(resData => ({ data: resData })),
  put: (url: string, data: any) => fetchApi(url, { method: 'PUT', body: JSON.stringify(data) }).then(resData => ({ data: resData })),
  patch: (url: string, data: any) => fetchApi(url, { method: 'PATCH', body: JSON.stringify(data) }).then(resData => ({ data: resData })),
  delete: (url: string) => fetchApi(url, { method: 'DELETE' }).then(resData => ({ data: resData }))
};

export default api;
