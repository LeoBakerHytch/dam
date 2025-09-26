import {
  CalendarIcon,
  DatabaseIcon,
  FileIcon,
  ImageIcon,
  ScalingIcon,
  ScanEyeIcon,
  TagIcon,
  TextAlignStartIcon,
} from 'lucide-react';
import { type ComponentType } from 'react';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { formatDate } from '@/lib/utils';
import { type ImageAsset } from '@/types/graphql';

export function ImageAssetDetailSheet({
  asset,
  open,
  onOpenChange,
}: {
  asset: ImageAsset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!asset) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-left">{asset.name}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 p-4">
          <div className="relative">
            <img
              src={asset.url}
              alt={asset.altText || asset.name}
              className="max-h-64 w-full rounded-lg object-contain"
            />
          </div>

          <div className="space-y-3">
            <PropertyRow icon={FileIcon} label="File" value={asset.fileName} />
            <PropertyRow icon={DatabaseIcon} label="Size" value={asset.fileSizeHuman} />
            <PropertyRow
              icon={ScalingIcon}
              label="Dimensions"
              value={`${asset.width} × ${asset.height}px`}
            />
            <PropertyRow icon={ImageIcon} label="Type" value={asset.mimeType} />
          </div>

          {asset.description && (
            <TextSection
              title="Description"
              icon={TextAlignStartIcon}
              content={asset.description}
            />
          )}

          {asset.altText && (
            <TextSection title="Alt text" icon={ScanEyeIcon} content={asset.altText} />
          )}

          {asset.tags && asset.tags.length > 0 && <TagsSection tags={asset.tags} />}

          <div className="space-y-3 border-t pt-4">
            <PropertyRow icon={CalendarIcon} label="Created" value={formatDate(asset.createdAt)} />
            <PropertyRow icon={CalendarIcon} label="Updated" value={formatDate(asset.updatedAt)} />
          </div>
        </div>
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
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-neutral-500" />
        <span className="font-medium">{label}</span>
      </div>
      <span className="text-right text-neutral-600 dark:text-neutral-400">{value}</span>
    </div>
  );
}

function TextSection({
  title,
  icon: Icon,
  content,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  content: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-neutral-500" />
        <h4 className="text-sm font-medium">{title}</h4>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">{content}</p>
    </div>
  );
}

function TagsSection({ tags }: { tags: string[] }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <TagIcon className="h-4 w-4 text-neutral-500" />
        <h4 className="text-sm font-medium">Tags</h4>
      </div>
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
    </div>
  );
}
