"use client";

import { useId, useState } from "react";
import { ETERNL_MODAL_BACKDROP } from "./eternlModalBackdrop";

export type EternlTermsDrawerProps = {
  open: boolean;
  onConfirm: () => void;
  onClose?: () => void;
  termsHref?: string;
  privacyHref?: string;
};

/**
 * Bottom-sheet terms acceptance (max-w-4xl). Confirm stays disabled until all
 * three boxes are checked.
 */
export default function EternlTermsDrawer({
  open,
  onConfirm,
  onClose,
  termsHref = "#",
  privacyHref = "#",
}: EternlTermsDrawerProps) {
  const baseId = useId().replace(/:/g, "");
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [c, setC] = useState(false);
  const allChecked = a && b && c;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[75] flex flex-col justify-end px-3 pb-0 sm:px-6">
      {onClose ? (
        <button
          type="button"
          className={`absolute inset-0 ${ETERNL_MODAL_BACKDROP}`}
          aria-label="Dismiss"
          onClick={onClose}
        />
      ) : (
        <div
          className={`absolute inset-0 ${ETERNL_MODAL_BACKDROP}`}
          aria-hidden
        />
      )}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${baseId}-title`}
        className="relative mx-auto mb-0 w-full max-w-4xl rounded-t-2xl border border-white/10 bg-[#171717] px-4 pb-6 pt-2 shadow-[0_-12px_48px_rgba(0,0,0,0.55)] sm:px-6"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-8 overflow-hidden rounded-t-2xl">
          <div className="absolute top-0 h-1.5 w-full bg-brand-gradient" />
        </div>

        <header className="relative mt-6 px-1 text-center sm:mt-8">
          <h2
            id={`${baseId}-title`}
            className="min-h-12 text-xl font-semibold capitalize text-white"
          >
            Welcome to Eternl
          </h2>
          <p className="mt-2 text-sm leading-snug text-white/55">
            Please review and accept our Terms of Service and Privacy Policy to
            continue using the wallet.
          </p>
        </header>

        <div className="relative mt-6 border-t border-white/10 pt-4">
          <div className="mb-4 flex w-full flex-col gap-4 text-left text-sm text-white/85">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 size-4 shrink-0 rounded border-white/25 bg-white/5 accent-brand-red"
                checked={a}
                onChange={(e) => setA(e.target.checked)}
              />
              <span>
                I agree to the{" "}
                <a href={termsHref} className="underline hover:text-white">
                  Terms of Service
                </a>{" "}
                (ToS) and confirm that I am at least 18 years old. I have taken
                note of the{" "}
                <a href={privacyHref} className="underline hover:text-white">
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 size-4 shrink-0 rounded border-white/25 bg-white/5 accent-brand-red"
                checked={b}
                onChange={(e) => setB(e.target.checked)}
              />
              <span>
                I agree to the immediate start of the service and acknowledge
                that I waive my 14-day cooling-off period (for the ToS).
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 size-4 shrink-0 rounded border-white/25 bg-white/5 accent-brand-red"
                checked={c}
                onChange={(e) => setC(e.target.checked)}
              />
              <span>
                I understand that Eternl is a non-custodial wallet. I am solely
                responsible for my recovery phrase. Tastenkunst cannot recover my
                funds if I lose access.
              </span>
            </label>
          </div>

          <div className="flex w-full flex-wrap justify-end gap-2">
            <button
              type="button"
              disabled={!allChecked}
              onClick={onConfirm}
              aria-label="Confirm"
              className="p-button p-component p-button-rounded et-button w-fit px-12 py-3 text-base font-semibold justify-center bg-brand-red !text-black border-none capitalize shadow-lg !rounded-full transition enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="p-button-label px-2 !text-black">Confirm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
