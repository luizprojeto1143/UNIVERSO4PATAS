const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000';

export async function fetchApiClient(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  let token = '';
  if (typeof window !== 'undefined') {
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

  const response = await fetch(url, defaultOptions);

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}
