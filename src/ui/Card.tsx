import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Adds the hover lift. Only for cards that are actually clickable. */
  interactive?: boolean;
}

// 1px border, 8px radius, no shadow by default — design.md is explicit that
// depth is not how this system separates things; whitespace and hairlines are.
export function Card ({ children, interactive = false, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`rounded-card border border-border bg-surface-0 p-6 ${
        interactive ? 'transition-shadow hover:shadow-[0_1px_2px_rgba(0,0,0,.04)]' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
