import {
  Atom,
  AudioLines,
  FileText,
  Image,
  LayoutGrid,
  LayoutTemplate,
  Target,
} from 'lucide-react';

import type { NavItem } from '@/types/NavItem';

export const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: LayoutGrid,
    root: true,
  },
  {
    title: 'Image library',
    path: '/image-library',
    icon: Image,
  },
  {
    title: 'Logo library',
    path: '/logo-library',
    icon: Target,
  },
  {
    title: 'Document library',
    path: '/document-library',
    icon: FileText,
  },
  {
    title: 'Sound library',
    path: '/sound-library',
    icon: AudioLines,
  },
  {
    title: 'Icon library',
    path: '/icon-library',
    icon: Atom,
  },
  {
    title: 'Template library',
    path: '/template-library',
    icon: LayoutTemplate,
  },
];

export const footerNavItems: NavItem[] = [];
