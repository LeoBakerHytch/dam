import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import { DashboardPage } from '@/features/dashboard/dashboard-page';
import { DocumentLibraryPage } from '@/features/documents/document-library-page';
import { IconLibraryPage } from '@/features/icons/icon-library-page';
import { ImageLibraryPage } from '@/features/images/image-library-page';
import { LogoLibraryPage } from '@/features/logos/logo-library-page';
import { SettingsAppearancePage } from '@/features/settings/appearance/settings-appearance-page';
import { SoundLibraryPage } from '@/features/sounds/sound-library-page';
import { TemplateLibraryPage } from '@/features/templates/template-library-page';

import '../css/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="image-library" element={<ImageLibraryPage />} />
        <Route path="logo-library" element={<LogoLibraryPage />} />
        <Route path="document-library" element={<DocumentLibraryPage />} />
        <Route path="sound-library" element={<SoundLibraryPage />} />
        <Route path="icon-library" element={<IconLibraryPage />} />
        <Route path="template-library" element={<TemplateLibraryPage />} />

        <Route path="settings/appearance" element={<SettingsAppearancePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
