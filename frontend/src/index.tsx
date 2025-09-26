import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { ApiProvider } from '@/context/api-provider';
import { AuthProvider, useAuth } from '@/context/auth-provider';
import { UserProvider } from '@/context/user-provider';
import { LoginPage } from '@/features/auth/pages/login-page';
import { RegisterPage } from '@/features/auth/pages/register-page';
import { DashboardPage } from '@/features/dashboard/dashboard-page';
import { DocumentLibraryPage } from '@/features/documents/document-library-page';
import { IconLibraryPage } from '@/features/icons/icon-library-page';
import { ImageLibraryPage } from '@/features/images/image-library-page';
import { LogoLibraryPage } from '@/features/logos/logo-library-page';
import { AppearanceSettingsPage } from '@/features/settings/appearance-settings-page';
import { PasswordSettingsPage } from '@/features/settings/password-settings-page';
import { ProfileSettingsPage } from '@/features/settings/profile-settings-page';
import { SoundLibraryPage } from '@/features/sounds/sound-library-page';
import { TemplateLibraryPage } from '@/features/templates/template-library-page';

import '../css/index.css';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Navigate to="/dashboard" replace />} />
      <Route path="/register" element={<Navigate to="/dashboard" replace />} />

      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/image-library" element={<ImageLibraryPage />} />
      <Route path="/logo-library" element={<LogoLibraryPage />} />
      <Route path="/document-library" element={<DocumentLibraryPage />} />
      <Route path="/sound-library" element={<SoundLibraryPage />} />
      <Route path="/icon-library" element={<IconLibraryPage />} />
      <Route path="/template-library" element={<TemplateLibraryPage />} />

      <Route path="/settings" element={<Navigate to="/settings/profile" replace />} />
      <Route path="/settings/appearance" element={<AppearanceSettingsPage />} />
      <Route path="/settings/password" element={<PasswordSettingsPage />} />
      <Route path="/settings/profile" element={<ProfileSettingsPage />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <ApiProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ApiProvider>
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>,
);
