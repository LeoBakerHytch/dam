import { Transition } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'urql';
import { z } from 'zod';

import { AppLayout } from '@/components/app/layouts/app-layout';
import { HeadingSmall } from '@/components/text/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputError } from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { SettingsLayout } from '@/features/settings/settings-layout';
import { ChangePasswordMutation } from '@/graphql/auth';
import { readUserFragment } from '@/graphql/user';
import { useUser } from '@/providers/user-provider';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(1, 'New password is required')
      .min(8, 'New password must be at least 8 characters'),
    passwordConfirmation: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.newPassword === data.passwordConfirmation, {
    message: 'Passwords don’t match',
    path: ['passwordConfirmation'],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

export function SettingsPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const [result, executeMutation] = useMutation(ChangePasswordMutation);
  const { user, setUser } = useUser();
  const [recentlySuccessful, setRecentlySuccessful] = useState(false);

  const onSubmit = async (data: PasswordForm) => {
    try {
      const result = await executeMutation({
        input: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
      });

      const changePasswordResult = result.data?.Auth_ChangePassword;

      if (changePasswordResult) {
        setUser(readUserFragment(changePasswordResult.user));
        reset();
        setRecentlySuccessful(true);
        setTimeout(() => setRecentlySuccessful(false), 3000);
      }
    } catch (error) {
      console.error('Password change failed:', error);
    }
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Password', path: '/settings/password' }]}>
      <title>Password settings</title>
      <SettingsLayout>
        <HeadingSmall
          title="Update password"
          description="Ensure your account is using a long, random password to stay secure"
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              value={user?.email || ''}
              readOnly
              className="cursor-not-allowed bg-neutral-50"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              placeholder="Current password"
              {...register('currentPassword')}
            />
            <InputError message={errors.currentPassword?.message} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="New password"
              {...register('newPassword')}
            />
            <InputError message={errors.newPassword?.message} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="passwordConfirmation">Confirm password</Label>
            <Input
              id="passwordConfirmation"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm password"
              {...register('passwordConfirmation')}
            />
            <InputError message={errors.passwordConfirmation?.message} />
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={result.fetching} data-test="update-password-button">
              {result.fetching && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Save password
            </Button>

            <Transition
              show={recentlySuccessful}
              enter="transition ease-in-out"
              enterFrom="opacity-0"
              leave="transition ease-in-out"
              leaveTo="opacity-0"
            >
              <p className="text-sm text-neutral-600">Saved</p>
            </Transition>
          </div>
        </form>
      </SettingsLayout>
    </AppLayout>
  );
}
