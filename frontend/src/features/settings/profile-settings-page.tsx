import { Transition } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from 'urql';
import { z } from 'zod';

import { AppLayout } from '@/components/app/layouts/app-layout';
import { HeadingSmall } from '@/components/text/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputError } from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { useUser } from '@/context/user-provider';
import { SetAvatarForm } from '@/features/settings/profile/set-avatar-form';
import { SettingsLayout } from '@/features/settings/settings-layout';
import { USER_FRAGMENT } from '@/lib/graphql-fragments';

const profileSchema = z.object({
  name: z.string().optional(),
});

const updateProfileMutation = gql`
  mutation User_UpdateProfile($input: User_UpdateProfile_Input!) {
    User_UpdateProfile(input: $input) {
      user {
        ...UserFragment
      }
    }
  }
  ${USER_FRAGMENT}
`;

type ProfileForm = z.infer<typeof profileSchema>;

export function ProfileSettingsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  const [result, executeMutation] = useMutation(updateProfileMutation);
  const { user, setUser } = useUser();
  const [recentlySuccessful, setRecentlySuccessful] = useState(false);

  const watchedName = watch('name');

  const hasChanges = watchedName && watchedName.trim() !== '' && watchedName !== user?.name;

  const onSubmit = async (data: ProfileForm) => {
    try {
      const result = await executeMutation({
        input: {
          name: data.name,
        },
      });

      if (result.data?.User_UpdateProfile?.user) {
        // Update user in context
        setUser(result.data.User_UpdateProfile.user);

        // Show success message
        setRecentlySuccessful(true);
        setTimeout(() => setRecentlySuccessful(false), 3000);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <AppLayout breadcrumbs={[{ title: 'Profile settings', path: '/settings/profile' }]}>
      <title>Profile settings</title>
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title="Profile information" description="Update your name and avatar" />

          <SetAvatarForm />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Full name"
                defaultValue={user?.name || ''}
                {...register('name')}
              />
              <InputError message={errors.name?.message} />
            </div>

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                disabled={result.fetching || !hasChanges}
                data-test="update-profile-button"
              >
                {result.fetching && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Save name
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
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
