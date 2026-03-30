"use client";

import { ChevronLeft } from "lucide-react";
import { useId, type ReactNode } from "react";
import { ETERNL_MODAL_BACKDROP } from "./eternlModalBackdrop";

export type EternlModalShellProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onClose?: () => void;
  zIndexClass?: string;
  /** Override the dialog max-height / max-width if needed */
  dialogClassName?: string;
  /** Modal body content */
  children: ReactNode;
  /** Footer content (buttons etc.) */
  footer?: ReactNode;
};

/**
 * Shared modal shell for all onboarding scenes.
 * Provides the backdrop, dialog container, gradient top bar,
 * header with back button + title/subtitle, content area and footer.
 */
export default function EternlModalShell({
  open,
  title,
  subtitle,
  onBack,
  onClose,
  zIndexClass = "z-[66]",
  dialogClassName = "max-w-[640px] h-[540px]",
  children,
  footer,
}: EternlModalShellProps) {
  const titleId = useId();

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 ${zIndexClass} flex items-center justify-center px-3 pb-0 pt-0 sm:px-6`}
      role="presentation"
    >
      <button
        type="button"
        className={`absolute inset-0 ${ETERNL_MODAL_BACKDROP}`}
        aria-label="Close"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative flex w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#171717] shadow-[0_-12px_48px_rgba(0,0,0,0.55)] ring-1 ring-white/10 ${dialogClassName}`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-8 overflow-hidden rounded-t-3xl">
          <div className="absolute top-0 h-1.5 w-full bg-brand-gradient" />
        </div>

        <header className="relative shrink-0 px-4 pb-1 pt-4 sm:px-6 sm:pt-5">
          <div className="relative mt-2 flex min-h-12 w-full flex-row items-start justify-center gap-2 md:gap-4">
            {onBack && (
              <div className="absolute left-0 top-0 w-12">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white/90 backdrop-blur-sm transition hover:bg-white/10 sm:h-12 sm:w-12"
                  aria-label="Back"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
                </button>
              </div>
            )}
            {title && (
              <div className="flex w-full flex-col items-center gap-2 px-14 pl-16 text-center sm:gap-3">
                <h2
                  id={titleId}
                  className="min-h-12 w-full text-xl font-semibold capitalize text-white"
                >
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-sm leading-snug text-white/55">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="modal-content flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-2 pt-1 sm:px-5">
          {children}
        </div>

        {footer && (
          <footer className="relative shrink-0 px-4 pb-4 pt-2 sm:px-6">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
