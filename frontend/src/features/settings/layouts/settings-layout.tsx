import { type PropsWithChildren } from 'react';
import { Link } from 'react-router';

import { Heading } from '@/components/text/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { settingsNavItems } from '@/features/settings/settings-nav-items';
import { cn } from '@/lib/utils';

export function SettingsLayout(props: PropsWithChildren) {
  const currentPath = window.location.pathname;

  return (
    <div className="px-4 py-6">
      <Heading title="Settings" description="Manage your profile and account settings" />

      <div className="flex flex-col lg:flex-row lg:space-x-12">
        <aside className="w-full max-w-xl lg:w-48">
          <nav className="flex flex-col space-x-0 space-y-1">
            {settingsNavItems.map((item) => (
              <Button
                key={item.path}
                size="sm"
                variant="ghost"
                asChild
                className={cn('w-full justify-start', {
                  'bg-muted': currentPath.startsWith(item.path),
                })}
              >
                <Link to={item.path}>
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>
        </aside>

        <Separator className="my-6 lg:hidden" />

        <div className="flex-1 md:max-w-2xl">
          <section className="max-w-xl space-y-12">{props.children}</section>
        </div>
      </div>
    </div>
  );
}
