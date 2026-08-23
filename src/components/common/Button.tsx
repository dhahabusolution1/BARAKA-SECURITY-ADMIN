import React from 'react';

type ButtonVariant = 'primary' | 'danger' | 'outline' | 'ghost' | 'dark';
type ButtonSize = 'sm' | 'md' | 'lg';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  isLoading?: boolean;
};

export const Button: React.FC<Props> = ({
  variant = 'primary',
  size = 'md',
  icon,
  isLoading,
  children,
  className = '',
  disabled,
  ...rest
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none';

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }[size];

  const variantClasses = {
    primary:
      'bg-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold-bright)] text-black font-semibold shadow-md active:scale-[0.98]',
    danger:
      'bg-[var(--color-danger)] hover:bg-red-700 text-white font-semibold shadow-md active:scale-[0.98]',
    outline:
      'border border-[var(--color-brand-border)] hover:border-[var(--color-brand-gold)] text-[var(--color-brand-cream)] hover:text-white bg-transparent',
    ghost:
      'text-[var(--color-brand-muted)] hover:text-[var(--color-brand-cream)] hover:bg-[var(--color-brand-elevated)] bg-transparent',
    dark: 'bg-[var(--color-brand-elevated)] hover:bg-neutral-800 text-[var(--color-brand-cream)] border border-[var(--color-brand-border)]',
  }[variant];

  return (
    <button
      className={`${base} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
};
