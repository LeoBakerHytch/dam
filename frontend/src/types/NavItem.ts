import { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  to: string;
  icon: LucideIcon;
  root?: boolean;
}
