import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import { LoginPage } from '@/features/auth/pages/login-page';
import { RegisterPage } from '@/features/auth/pages/register-page';
import { DashboardPage } from '@/features/dashboard/dashboard-page';
import { DocumentLibraryPage } from '@/features/documents/document-library-page';
import { IconLibraryPage } from '@/features/icons/icon-library-page';
import { ImageLibraryPage } from '@/features/images/image-library-page';
import { LogoLibraryPage } from '@/features/logos/logo-library-page';
import { SettingsAppearancePage } from '@/features/settings/pages/settings-appearance-page';
import { SettingsPasswordPage } from '@/features/settings/pages/settings-password-page';
import { SettingsProfilePage } from '@/features/settings/pages/settings-profile-page';
import { SoundLibraryPage } from '@/features/sounds/sound-library-page';
import { TemplateLibraryPage } from '@/features/templates/template-library-page';
import { initializeTheme } from '@/hooks/use-appearance';
import { ApiProvider } from '@/providers/api-provider';
import { ApolloApiProvider } from '@/providers/apollo-api-provider';
import { AuthProvider, useAuth } from '@/providers/auth-provider';
import { UserProvider } from '@/providers/user-provider';

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
      <Route path="/settings/appearance" element={<SettingsAppearancePage />} />
      <Route path="/settings/password" element={<SettingsPasswordPage />} />
      <Route path="/settings/profile" element={<SettingsProfilePage />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <ApiProvider>
          <ApolloApiProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ApolloApiProvider>
        </ApiProvider>
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>,
);

initializeTheme();
