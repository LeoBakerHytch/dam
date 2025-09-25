import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import { ApiProvider } from '@/context/api-provider';
import { AuthProvider } from '@/context/auth-provider';
import { UserProvider } from '@/context/user-provider';
import { RegisterPage } from '@/features/auth/pages/register-page';
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
    <AuthProvider>
      <UserProvider>
        <ApiProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/register" element={<RegisterPage />} />

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
        </ApiProvider>
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>,
);
