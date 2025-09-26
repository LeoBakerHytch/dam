import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';
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
import { InputError } from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { Kbd } from '@/components/ui/shadcn-io/kbd';
import { Textarea } from '@/components/ui/textarea';
import { IMAGE_ASSET_FRAGMENT } from '@/lib/graphql-fragments';
import { type ImageAsset } from '@/types/graphql';

const descriptionSchema = z.object({
  description: z.string().max(1000, 'Description may be 1000 characters at most.').optional(),
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

type DescriptionForm = z.infer<typeof descriptionSchema>;

interface EditDescriptionDialogProps {
  asset: ImageAsset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedAsset: Partial<ImageAsset>) => void;
}

export function EditDescriptionDialog({
  asset,
  open,
  onOpenChange,
  onSuccess,
}: EditDescriptionDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<DescriptionForm>({
    resolver: zodResolver(descriptionSchema),
    defaultValues: {
      description: asset.description || '',
    },
  });

  const [result, executeMutation] = useMutation(setDetailsMutation);

  // Reset form when asset changes or dialog opens
  useEffect(() => {
    if (open) {
      reset({
        description: asset.description || '',
      });
    }
  }, [asset.description, open, reset]);

  const watchedDescription = watch('description');
  const hasChanges = isDirty && watchedDescription !== asset.description;

  const onSubmit = async (data: DescriptionForm) => {
    try {
      const result = await executeMutation({
        input: {
          id: asset.id,
          description: data.description || null,
        },
      });

      if (result.data?.Media_ImageAsset_SetDetails?.imageAsset) {
        onSuccess(result.data.Media_ImageAsset_SetDetails.imageAsset);
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Description update failed:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && hasChanges && !result.fetching) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>{asset.description ? 'Edit description' : 'Add description'}</DialogTitle>
          <DialogDescription>
            Provide a description for this image to help others understand its content.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what's in this image..."
                rows={4}
                {...register('description')}
              />
              <InputError message={errors.description?.message} />
            </div>
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
                {asset.description ? 'Update' : 'Add'} description
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
