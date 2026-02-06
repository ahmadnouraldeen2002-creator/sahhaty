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
  if (!SAHHATY_WP.loggedIn) return null; // ✅ إذا ضيف لا نحمّل من WP

  const res = await fetch(
    SAHHATY_WP.ajaxUrl + '?action=sahhaty_load_data&nonce=' + SAHHATY_WP.nonce,
    { method: 'POST' }
  );

  const json = await res.json();
  return json?.data?.data || null;
}


async function sahhatySave(data) {
  if (!window.SAHHATY_WP) return;
  if (!SAHHATY_WP.loggedIn) return; // ✅ الضيف لا نحفظ له على WP

  await fetch(
    SAHHATY_WP.ajaxUrl + '?action=sahhaty_save_data&nonce=' + SAHHATY_WP.nonce,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  );
}
const root = ReactDOM.createRoot(rootElement);
sahhatyLoad().then((savedData) => {
  root.render(
    _jsx(React.StrictMode, {
      children: _jsx(App, {
        initialData: savedData,
        onSave: sahhatySave
      })
    })
  );
});

