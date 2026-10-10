const envBackend = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL;

// Ignore any legacy/broken Vercel backend URL stored in environment variables
export const BACKEND_URL =
  envBackend && !envBackend.includes('smartcitybackend.vercel.app')
    ? envBackend
    : 'https://smartcitybackend-ct6i.onrender.com';
