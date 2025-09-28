import { Transition } from '@headlessui/react';
import { LoaderCircle } from 'lucide-react';
import { type ChangeEvent, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useMutation } from '@apollo/client/react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  SetAvatarMutation,
  type SetAvatarMutationResult,
  type SetAvatarMutationVariables,
  readUserFragment,
} from '@/graphql/user';
import { getInitials } from '@/lib/strings';
import { useUser } from '@/providers/user-provider';

export function SetAvatarForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recentlySuccessful, setRecentlySuccessful] = useState(false);

  const [mutate, { loading }] = useMutation<SetAvatarMutationResult, SetAvatarMutationVariables>(
    SetAvatarMutation,
  );
  const { user, setUser } = useUser();

  function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (2MB = 2097152 bytes)
    if (file.size > 2097152) {
      toast.error('File size must be less than 2MB');
      e.target.value = '';
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, GIF, and WebP images are allowed');
      e.target.value = '';
      return;
    }

    const url = URL.createObjectURL(file);
    setAvatarPreviewUrl(url);
    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    try {
      const result = await mutate({
        variables: {
          input: {
            avatar: selectedFile,
          },
        },
      });

      const setAvatarResult = result.data?.User_SetAvatar;

      if (setAvatarResult) {
        setUser(readUserFragment(setAvatarResult.user));

        setSelectedFile(null);
        setAvatarPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        setRecentlySuccessful(true);
        setTimeout(() => setRecentlySuccessful(false), 3000);

        toast.success('Avatar updated successfully');
      }
    } catch (error) {
      console.error('Avatar upload failed:', error);
      toast.error('Failed to update avatar');
    }
  }

  function handleCancel() {
    setSelectedFile(null);
    setAvatarPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  if (!user) {
    return null;
  }

  return (
    <div className="grid gap-2">
      <Label>Avatar</Label>
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatarPreviewUrl || (user.avatarUrl ?? undefined)} alt={user.name} />
          <AvatarFallback className="bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              {selectedFile ? 'Choose different' : 'Change avatar'}
            </Button>
            {selectedFile && (
              <>
                <Button type="button" size="sm" onClick={handleUpload} disabled={loading}>
                  {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  Upload
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
          <p className="text-muted-foreground text-xs">PNG, JPG, GIF, WebP up to 2MB</p>
          <Transition
            show={recentlySuccessful}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
          >
            <p className="text-sm text-neutral-600">Avatar updated</p>
          </Transition>
        </div>
      </div>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
      />
    </div>
  );
}
