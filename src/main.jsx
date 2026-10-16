import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './styles/dark-theme.css';

// One-time migration: demo accounts moved from @eventhorizon.dev / @assemble.dev to @connect.dev
try {
  if (!localStorage.getItem('assemble_migrated_connect_emails')) {
    Object.keys(localStorage)
      .filter((key) => key.startsWith('assemble_'))
      .forEach((key) => {
        const value = localStorage.getItem(key);
        if (value && /@(eventhorizon|assemble)\.dev/.test(value)) {
          localStorage.setItem(key, value.replace(/@(eventhorizon|assemble)\.dev/g, '@connect.dev'));
        }
      });
    localStorage.setItem('assemble_migrated_connect_emails', '1');
  }
} catch {
  // Storage unavailable; nothing to migrate
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
