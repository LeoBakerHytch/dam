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
import { Input } from '@/components/ui/input';
import { InputError } from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { Kbd } from '@/components/ui/shadcn-io/kbd';
import { IMAGE_ASSET_FRAGMENT } from '@/lib/graphql-fragments';
import { type ImageAsset } from '@/types/graphql';

const altTextSchema = z.object({
  altText: z.string().max(300, 'Alt text may be 300 characters at most.').optional(),
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

type AltTextForm = z.infer<typeof altTextSchema>;

interface EditAltTextDialogProps {
  asset: ImageAsset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedAsset: Partial<ImageAsset>) => void;
}

export function EditAltTextDialog({
  asset,
  open,
  onOpenChange,
  onSuccess,
}: EditAltTextDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<AltTextForm>({
    resolver: zodResolver(altTextSchema),
    defaultValues: {
      altText: asset.altText || '',
    },
  });

  const [result, executeMutation] = useMutation(setDetailsMutation);

  // Reset form when asset changes or dialog opens
  useEffect(() => {
    if (open) {
      reset({
        altText: asset.altText || '',
      });
    }
  }, [asset.altText, open, reset]);

  const watchedAltText = watch('altText');
  const hasChanges = isDirty && watchedAltText !== asset.altText;

  const onSubmit = async (data: AltTextForm) => {
    try {
      const result = await executeMutation({
        input: {
          id: asset.id,
          altText: data.altText || null,
        },
      });

      if (result.data?.Media_ImageAsset_SetDetails?.imageAsset) {
        onSuccess(result.data.Media_ImageAsset_SetDetails.imageAsset);
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Alt text update failed:', error);
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
          <DialogTitle>{asset.altText ? 'Edit alt text' : 'Add alt text'}</DialogTitle>
          <DialogDescription>
            Provide alternative text that describes this image for screen readers and accessibility.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="altText">Alt text</Label>
              <Input
                id="altText"
                type="text"
                placeholder="Describe what's shown in this image..."
                {...register('altText')}
              />
              <InputError message={errors.altText?.message} />
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
                {asset.altText ? 'Update' : 'Add'} alt text
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
