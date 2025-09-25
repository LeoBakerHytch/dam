import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import { DashboardPage } from '@/features/dashboard/dashboard-page';

import '../css/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
