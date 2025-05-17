import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { registerSW } from './registerSW';

// Only attempt to register service worker in supported environments
if (typeof window !== 'undefined' && !window.navigator.userAgent.includes('StackBlitz')) {
  registerSW();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);