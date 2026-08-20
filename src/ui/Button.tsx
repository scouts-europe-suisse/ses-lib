import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
}

// The primary action is ink, not brand red: design.md reserves the brand colours
// for the logo lockup, so colour earns its presence instead of filling buttons.
const variantClasses: Record<Variant, string> = {
  primary: 'bg-ink-strong text-surface-0 hover:opacity-90 active:opacity-80',
  secondary: 'bg-surface-1 text-ink-strong border border-border hover:bg-surface-2',
  ghost: 'text-ink-body hover:bg-surface-1',
  danger: 'bg-status-removed text-surface-0 hover:opacity-90',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm rounded-md gap-1.5',
  md: 'h-10 px-4 text-sm rounded-lg gap-2',
};

export function Button ({
  variant = 'secondary',
  size = 'md',
  icon,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-info ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
