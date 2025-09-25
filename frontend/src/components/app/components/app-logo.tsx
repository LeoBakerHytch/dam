import { AppLogoIcon } from './app-logo-icon';

export function AppLogo() {
  return (
    <>
      <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
        <AppLogoIcon className="size-8" />
      </div>
      <div className="ml-1 grid flex-1 text-left text-sm">
        <span className="mb-0.5 truncate font-semibold leading-tight">DAM</span>
      </div>
    </>
  );
}
