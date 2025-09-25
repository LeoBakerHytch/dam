import { ComponentProps, type ReactNode } from 'react';
import { Link } from 'react-router';

type LinkProps = ComponentProps<typeof Link>;

export function DashboardCard(
  props: {
    title: string;
    icon?: ReactNode;
  } & LinkProps,
) {
  return (
    <Link
      className="border-sidebar-border/70 bg-muted dark:border-sidebar-border flex aspect-video flex-col overflow-hidden rounded-xl border transition-all duration-200 hover:border-purple-600 hover:text-purple-700 dark:hover:border-purple-100 dark:hover:text-purple-300"
      to={props.to ?? '#'}
    >
      {props.icon && (
        <div className="from-muted/50 to-muted dark:from-muted/20 dark:to-muted/50 flex flex-1 items-center justify-center bg-gradient-to-b">
          <div className="flex h-1/2 justify-center">{props.icon}</div>
        </div>
      )}
      <div className="flex items-center justify-center bg-white p-5 dark:bg-gray-700">
        <span className="text-md font-medium">{props.title}</span>
      </div>
    </Link>
  );
}
