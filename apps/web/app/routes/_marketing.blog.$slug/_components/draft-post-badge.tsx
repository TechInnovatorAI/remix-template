import React from 'react';

export function DraftPostBadge({ children }: React.PropsWithChildren) {
  return (
    <span className="dark:text-dark-800 rounded-md bg-yellow-200 px-4 py-2 font-semibold">
      {children}
    </span>
  );
}
