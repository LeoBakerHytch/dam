import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle, XIcon } from 'lucide-react';
import { type KeyboardEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { InputError } from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { Kbd } from '@/components/ui/shadcn-io/kbd';
import {
  type ImageAsset,
  SetImageAssetDetailsMutation,
  type SetImageAssetDetailsMutationResult,
  type SetImageAssetDetailsMutationVariables,
  readImageAssetFragment,
} from '@/graphql/images';
import { normalizeTag } from '@/lib/strings';

const tagsSchema = z.object({
  newTag: z.string().max(40, 'Tags may be 40 characters at most.').optional(),
});

type TagsForm = z.infer<typeof tagsSchema>;

export function EditTagsDialog({
  asset,
  open,
  onOpenChange,
  onSuccess,
}: {
  asset: ImageAsset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedAsset: ImageAsset) => void;
}) {
  const [tags, setTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TagsForm>({
    resolver: zodResolver(tagsSchema),
  });

  const [mutate, { loading }] = useMutation<
    SetImageAssetDetailsMutationResult,
    SetImageAssetDetailsMutationVariables
  >(SetImageAssetDetailsMutation);

  // Reset form when asset changes or dialog opens
  useEffect(() => {
    if (open) {
      setTags(asset.tags || []);
      reset({ newTag: '' });
    }
  }, [asset.tags, open, reset]);

  const watchedNewTag = watch('newTag');
  const hasChanges = JSON.stringify(tags) !== JSON.stringify(asset.tags || []);

  const addTag = (tagText: string) => {
    const normalized = normalizeTag(tagText);
    if (normalized && !tags.includes(normalized)) {
      setTags([...tags, normalized]);
      setValue('newTag', '');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const onSubmit = async (data: TagsForm) => {
    // Add the current input as a tag if it's not empty
    if (data.newTag) {
      addTag(data.newTag);
      return; // Don't submit yet, let user see the tag was added
    }

    try {
      const result = await mutate({
        variables: {
          input: {
            id: asset.id,
            tags: tags.length > 0 ? tags : null,
          },
        },
      });

      const setDetailsResult = result.data?.ImageAsset_SetDetails;

      if (setDetailsResult) {
        onSuccess(readImageAssetFragment(setDetailsResult.imageAsset));
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Tags update failed:', error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (watchedNewTag) {
        addTag(watchedNewTag);
      }
    }
  };

  const handleDialogKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && hasChanges && !loading) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onKeyDown={handleDialogKeyDown}>
        <DialogHeader>
          <DialogTitle>
            {asset.tags && asset.tags.length > 0 ? 'Edit tags' : 'Add tags'}
          </DialogTitle>
          <DialogDescription>
            Add tags to help categorize and find this image. Press Enter to add each tag.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="newTag">Add tag</Label>
              <Input
                id="newTag"
                type="text"
                placeholder="Type a tag and press Enter..."
                onKeyDown={handleKeyDown}
                {...register('newTag')}
              />
              <InputError message={errors.newTag?.message} />
            </div>

            {tags.length > 0 && (
              <div className="grid gap-2">
                <Label>Current tags</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="rounded-full p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row">
            <div className="mb-2 flex flex-1 items-center sm:mb-0">
              {hasChanges && (
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <span>Press</span>
                  <Kbd>
                    {navigator.platform.includes('Mac') ? ['⌘', 'Enter'] : ['Ctrl', 'Enter']}
                  </Kbd>
                  <span>to save</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !hasChanges}>
                {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Save tags
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
