import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';   // ✅ ajout
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>        {/* ✅ on enveloppe l’app avec le router */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
