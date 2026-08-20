import type { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  /** One line at most. If it needs two, it belongs in the page, not the header. */
  subtitle?: string;
  /** The single primary action for this page. */
  action?: ReactNode;
}

// Title left, one primary action right. design.md allows exactly one per page:
// a header with three equal buttons tells the reader nothing about what to do.
export function PageHeader ({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className='flex items-start justify-between gap-6 py-5'>
      <div>
        <h1 className='text-2xl font-semibold text-ink-strong'>{title}</h1>
        {subtitle && <p className='mt-1 text-sm text-ink-muted'>{subtitle}</p>}
      </div>
      {action && <div className='shrink-0'>{action}</div>}
    </header>
  );
}
