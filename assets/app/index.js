import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}
async function sahhatyLoad() {
  if (!window.SAHHATY_WP) return null;
  if (!window.SAHHATY_WP.loggedIn) return null; // âœ… Ø¥Ø°Ø§ Ø¶ÙŠÙ Ù„Ø§ Ù†Ø­Ù…Ù‘Ù„ Ù…Ù† WP

  const res = await fetch(
    window.SAHHATY_WP.ajaxUrl + '?action=sahhaty_load_data&nonce=' + window.SAHHATY_WP.nonce,
    { method: 'POST' }
  );

  const json = await res.json();
  return json?.data?.data || null;
}


async function sahhatySave(data) {
  if (!window.SAHHATY_WP) return;
  if (!window.SAHHATY_WP.loggedIn) return; // âœ… Ø§Ù„Ø¶ÙŠÙ Ù„Ø§ Ù†Ø­ÙØ¸ Ù„Ù‡ Ø¹Ù„Ù‰ WP

  await fetch(
    window.SAHHATY_WP.ajaxUrl + '?action=sahhaty_save_data&nonce=' + window.SAHHATY_WP.nonce,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  );
}
const root = ReactDOM.createRoot(rootElement);
const mountApp = (savedData) => {
  root.render(
    _jsx(React.StrictMode, {
      children: _jsx(App, {
        initialData: savedData,
        onSave: sahhatySave
      })
    })
  );
};

sahhatyLoad()
  .then((savedData) => {
    mountApp(savedData);
  })
  .catch((error) => {
    console.error('sahhatyLoad failed:', error);
    mountApp(null);
  });


