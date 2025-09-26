import { KeyRound, Palette } from 'lucide-react';

import { NavItem } from '@/types/NavItem';

export const settingsNavItems: NavItem[] = [
  {
    title: 'Appearance',
    path: '/settings/appearance',
    icon: Palette,
  },
  {
    title: 'Password',
    path: '/settings/password',
    icon: KeyRound,
  },
];
