import {
  CalendarIcon,
  DatabaseIcon,
  FileIcon,
  ImageIcon,
  PencilIcon,
  PlusIcon,
  ScalingIcon,
  ScanEyeIcon,
  TagIcon,
  TextAlignStartIcon,
} from 'lucide-react';
import { type ComponentType, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { type ImageAsset } from '@/graphql/images';
import { formatDate } from '@/lib/dates';

import { EditAltTextDialog } from './edit-alt-text-dialog';
import { EditDescriptionDialog } from './edit-description-dialog';
import { EditTagsDialog } from './edit-tags-dialog';

export function ImageAssetDetailSheet({
  asset,
  open,
  onOpenChange,
}: {
  asset: ImageAsset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [currentAsset, setCurrentAsset] = useState<ImageAsset | null>(asset);
  const [editDescriptionOpen, setEditDescriptionOpen] = useState(false);
  const [editAltTextOpen, setEditAltTextOpen] = useState(false);
  const [editTagsOpen, setEditTagsOpen] = useState(false);

  // Update current asset when prop changes
  if (asset && (!currentAsset || currentAsset.id !== asset.id)) {
    setCurrentAsset(asset);
  }

  if (!currentAsset) return null;

  function handleAssetUpdate(updatedAsset: ImageAsset) {
    setCurrentAsset(updatedAsset);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="break-all pr-8 text-left">{currentAsset.name}</SheetTitle>
          <SheetDescription className="sr-only">
            Details and metadata for the selected image asset
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 p-4">
          <div className="relative">
            <img
              src={currentAsset.url}
              alt={currentAsset.altText || currentAsset.name}
              className="max-h-64 w-full rounded-lg object-contain"
            />
          </div>

          <div className="space-y-3">
            <PropertyRow icon={FileIcon} label="File" value={currentAsset.fileName} />
            <PropertyRow icon={DatabaseIcon} label="Size" value={currentAsset.fileSizeHuman} />
            <PropertyRow
              icon={ScalingIcon}
              label="Dimensions"
              value={`${currentAsset.width} × ${currentAsset.height}px`}
            />
            <PropertyRow icon={ImageIcon} label="Type" value={currentAsset.mimeType} />
          </div>

          <EditableTextSection
            title="Description"
            icon={TextAlignStartIcon}
            content={currentAsset.description}
            placeholder="No description provided"
            onEdit={() => setEditDescriptionOpen(true)}
          />

          <EditableTextSection
            title="Alt text"
            icon={ScanEyeIcon}
            content={currentAsset.altText}
            placeholder="No alt text provided"
            onEdit={() => setEditAltTextOpen(true)}
          />

          <EditableTagsSection
            tags={currentAsset.tags}
            placeholder="No tags"
            onEdit={() => setEditTagsOpen(true)}
          />

          <div className="space-y-3 border-t pt-4">
            <PropertyRow
              icon={CalendarIcon}
              label="Created"
              value={formatDate(currentAsset.createdAt)}
            />
            <PropertyRow
              icon={CalendarIcon}
              label="Updated"
              value={formatDate(currentAsset.updatedAt)}
            />
          </div>
        </div>

        <EditDescriptionDialog
          asset={currentAsset}
          open={editDescriptionOpen}
          onOpenChange={setEditDescriptionOpen}
          onSuccess={handleAssetUpdate}
        />

        <EditAltTextDialog
          asset={currentAsset}
          open={editAltTextOpen}
          onOpenChange={setEditAltTextOpen}
          onSuccess={handleAssetUpdate}
        />

        <EditTagsDialog
          asset={currentAsset}
          open={editTagsOpen}
          onOpenChange={setEditTagsOpen}
          onSuccess={handleAssetUpdate}
        />
      </SheetContent>
    </Sheet>
  );
}

function PropertyRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-neutral-500" />
        <span className="font-medium">{label}</span>
      </div>
      <span className="break-all text-right text-neutral-600 dark:text-neutral-400">{value}</span>
    </div>
  );
}

function EditableTextSection({
  title,
  icon: Icon,
  content,
  placeholder,
  onEdit,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  content: string | null;
  placeholder: string;
  onEdit: () => void;
}) {
  const isPlaceholder = !content;
  const displayText = content || placeholder;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-neutral-500" />
          <h4 className="text-sm font-medium">{title}</h4>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit} className="h-8 w-8 p-0">
          {isPlaceholder ? <PlusIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
        </Button>
      </div>
      <p
        className={`text-sm ${isPlaceholder ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-600 dark:text-neutral-400'}`}
      >
        {displayText}
      </p>
    </div>
  );
}

function EditableTagsSection({
  tags,
  placeholder,
  onEdit,
}: {
  tags?: string[];
  placeholder: string;
  onEdit: () => void;
}) {
  const hasTags = tags && tags.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TagIcon className="h-4 w-4 text-neutral-500" />
          <h4 className="text-sm font-medium">Tags</h4>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit} className="h-8 w-8 p-0">
          {!hasTags ? <PlusIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
        </Button>
      </div>
      {hasTags ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-400 dark:text-neutral-500">{placeholder}</p>
      )}
    </div>
  );
}
