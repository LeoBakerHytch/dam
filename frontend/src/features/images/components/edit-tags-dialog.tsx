import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from 'urql';
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
import { IMAGE_ASSET_FRAGMENT } from '@/lib/graphql-fragments';
import { type ImageAsset } from '@/types/graphql';

const tagsSchema = z.object({
  newTag: z.string().max(40, 'Tags may be 40 characters at most.').optional(),
});

const setDetailsMutation = gql`
  mutation Media_ImageAsset_SetDetails($input: Media_ImageAsset_SetDetails_Input!) {
    Media_ImageAsset_SetDetails(input: $input) {
      imageAsset {
        ...ImageAssetFragment
      }
    }
  }
  ${IMAGE_ASSET_FRAGMENT}
`;

type TagsForm = z.infer<typeof tagsSchema>;

interface EditTagsDialogProps {
  asset: ImageAsset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedAsset: Partial<ImageAsset>) => void;
}

function normalizeTag(tag: string): string {
  return tag.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function EditTagsDialog({ asset, open, onOpenChange, onSuccess }: EditTagsDialogProps) {
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

  const [result, executeMutation] = useMutation(setDetailsMutation);

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
      const result = await executeMutation({
        input: {
          id: asset.id,
          tags: tags.length > 0 ? tags : null,
        },
      });

      if (result.data?.Media_ImageAsset_SetDetails?.imageAsset) {
        onSuccess(result.data.Media_ImageAsset_SetDetails.imageAsset);
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Tags update failed:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (watchedNewTag) {
        addTag(watchedNewTag);
      }
    }
  };

  const handleDialogKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && hasChanges && !result.fetching) {
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
                      className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="rounded-full p-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      >
                        <XIcon className="h-3 w-3" />
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
                disabled={result.fetching}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={result.fetching || !hasChanges}>
                {result.fetching && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Save tags
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
