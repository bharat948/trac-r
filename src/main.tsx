import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import App from './App.tsx';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Validate that client ID is set
if (!GOOGLE_CLIENT_ID) {
  console.error(
    'VITE_GOOGLE_CLIENT_ID is not set. Please configure it in your environment variables.\n' +
    'For Vercel: Go to Project Settings > Environment Variables and add VITE_GOOGLE_CLIENT_ID'
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {GOOGLE_CLIENT_ID ? (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    ) : (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-danger-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Configuration Error</h1>
          <p className="text-gray-600 mb-4">
            Google OAuth Client ID is not configured.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left text-sm text-gray-700">
            <p className="font-semibold mb-2">To fix this:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to your Vercel project settings</li>
              <li>Navigate to <strong>Environment Variables</strong></li>
              <li>Add a new variable:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li><strong>Name:</strong> <code>VITE_GOOGLE_CLIENT_ID</code></li>
                  <li><strong>Value:</strong> Your Google Client ID</li>
                  <li><strong>Environment:</strong> Production, Preview, Development</li>
                </ul>
              </li>
              <li>Redeploy your application</li>
            </ol>
            <p className="mt-3 text-xs text-gray-500">
              See <code>GOOGLE_AUTH_SETUP.md</code> for detailed instructions.
            </p>
          </div>
        </div>
      </div>
    )}
  </StrictMode>
);
