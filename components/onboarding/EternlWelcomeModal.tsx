"use client";

import React, { useEffect, useRef } from "react";
import EternlModalShell from "./EternlModalShell";

export type EternlWelcomeModalProps = {
  open: boolean;
  onNext: () => void;
  onClose?: () => void;
  zIndexClass?: string;
};

/**
 * Welcome screen — matches the live Eternl onboarding design exactly.
 * Shows "Welcome to Eternl!", the video illustration, and a Start setup button.
 * Now uses EternlModalShell for consistency across the onboarding flow.
 */
export default function EternlWelcomeModal({
  open,
  onNext,
  onClose,
  zIndexClass = "z-[60]",
}: EternlWelcomeModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!open || !videoRef.current) return;
    const video = videoRef.current;
    video.muted = true;
    video.defaultMuted = true;
    const tryPlay = async () => {
      try {
        await video.play();
      } catch {
        // Ignore autoplay rejections on restrictive environments.
      }
    };
    void tryPlay();
  }, [open]);

  return (
    <EternlModalShell
      open={open}
      title=""
      onClose={onClose}
      zIndexClass={zIndexClass}
      dialogClassName="max-w-[640px] h-[660px] !rounded-2xl"
      footer={
        <div className="w-full flex flex-wrap justify-center gap-4">
          <button
            autoFocus
            type="button"
            onClick={onNext}
            aria-label="Start setup"
            className="p-button p-component p-button-rounded et-button w-fit px-12 py-2.5 text-base font-semibold justify-center bg-brand-red !text-black border-none capitalize shadow-lg !rounded-full outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <span className="p-button-label !text-black">Start setup</span>
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center gap-1 mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center tracking-tight text-white mb-2">
            <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
              Welcome to Eternl!
            </span>
          </h2>
          <p className="text-base sm:text-lg text-center text-white/75">
            a multi-platform Cardano wallet
          </p>
        </div>

        <div className="w-full max-w-[320px] mx-auto flex justify-center overflow-hidden rounded-lg">
          <video
            ref={videoRef}
            src="/VIDEO.MP4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
            onCanPlay={() => {
              if (videoRef.current) {
                void videoRef.current.play().catch(() => {});
              }
            }}
            className="w-full h-auto max-h-[320px] object-cover scale-[1.06] pointer-events-none select-none"
          />
        </div>
      </div>
    </EternlModalShell>
  );
}
