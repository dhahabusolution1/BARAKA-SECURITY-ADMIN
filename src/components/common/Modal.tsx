import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
};

export const Modal: React.FC<Props> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  if (!isOpen) return null;

  const widthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return createPortal(
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full ${widthClass} bg-[var(--color-brand-charcoal)] border border-[var(--color-brand-border)] rounded-xl shadow-2xl overflow-hidden`}
      >
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-[var(--color-brand-border)] flex items-center justify-between gap-3">
          <h3 className="font-display font-semibold text-base sm:text-lg text-[var(--color-brand-cream)] truncate">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--color-brand-muted)] hover:text-white p-1 rounded-md hover:bg-[var(--color-brand-elevated)] transition cursor-pointer shrink-0"
            title="Fermer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
};
