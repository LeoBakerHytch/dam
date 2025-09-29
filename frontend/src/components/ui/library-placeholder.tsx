import { Link } from 'react-router';

export function LibraryPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-muted-foreground">
        <p className="text-lg">There’s nothing here (for now).</p>
        <p className="mt-2">
          Take a look at the{' '}
          <Link to="/image-library" className="text-primary font-medium hover:underline">
            Image library
          </Link>
        </p>
      </div>
    </div>
  );
}
