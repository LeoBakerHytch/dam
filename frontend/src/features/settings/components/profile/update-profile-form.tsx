import { useMutation } from '@apollo/client/react';
import { Transition } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputError } from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import {
  UpdateProfileMutation,
  type UpdateProfileMutationResult,
  type UpdateProfileMutationVariables,
} from '@/graphql/user';
import { useCurrentUser } from '@/hooks/use-current-user';

const profileSchema = z.object({
  name: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export function UpdateProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  const [mutate, { loading }] = useMutation<
    UpdateProfileMutationResult,
    UpdateProfileMutationVariables
  >(UpdateProfileMutation);

  const { user } = useCurrentUser();
  const [recentlySuccessful, setRecentlySuccessful] = useState(false);

  const watchedName = watch('name');

  const hasChanges = watchedName && watchedName.trim() !== '' && watchedName !== user?.name;

  const onSubmit = useCallback(async (data: ProfileForm) => {
    try {
      const result = await mutate({
        variables: {
          input: {
            name: data.name,
          },
        },
      });

      const updateProfileResult = result.data?.User_UpdateProfile;

      if (updateProfileResult) {
        setRecentlySuccessful(true);
        setTimeout(() => setRecentlySuccessful(false), 3000);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  }, [mutate]);

  return (
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
        <Button type="submit" disabled={loading || !hasChanges} data-test="update-profile-button">
          {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
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
  );
}
