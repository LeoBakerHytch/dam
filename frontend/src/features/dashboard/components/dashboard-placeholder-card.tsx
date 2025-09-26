import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

export function DashboardPlaceholderCard() {
  return (
    <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
      <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
    </div>
  );
}
