import { type ComponentProps } from 'react';
import { Link } from 'react-router';

import { cn } from '@/lib/utils';

type LinkProps = ComponentProps<typeof Link>;

export function TextLink({ className = '', children, ...props }: LinkProps) {
  return (
    <Link
      className={cn(
        'text-foreground hover:decoration-current! underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out dark:decoration-neutral-500',
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
