import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RestaurantProvider } from './context/RestaurantContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RestaurantProvider>
      <App />
    </RestaurantProvider>
  </React.StrictMode>
);
