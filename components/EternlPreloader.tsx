/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";

/**
 * Eternl-style preloader overlay.
 * Assets: keep the `src` paths as provided; update later when you share links.
 */
export default function EternlPreloader() {
  return (
    <div className="preloader fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-black/55 backdrop-blur-sm">
      <div
        className="p-card p-component w-full relative max-w-72 sm:max-w-96 min-w-[200px] min-h-48 sm:min-h-58 p-0 transition-all overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-2xl"
        data-pc-name="card"
        data-pc-section="root"
      >
        <div className="p-card-body p-0 h-full" data-pc-section="body">
          <div
            className="p-card-content px-5 pt-5 pb-4 h-full sm:px-6 sm:pt-6 sm:pb-4 flex flex-col"
            data-pc-section="content"
          >
            <div className="relative grow h-full flex flex-col gap-3 text-right">
              {/* Background blob (fallback for the missing `/images/preloader-bg-default.svg`). */}
              <div className="absolute -top-11 sm:-top-18 -right-5 sm:-right-8 h-32 w-56 sm:h-48 sm:w-72 rounded-full bg-gradient-to-r from-rose-500/30 via-amber-400/20 to-fuchsia-500/25 blur-2xl" />

              <div className="relative grow flex flex-row justify-center items-center gap-3">
                <img
                  className="shrink-0 grow-0 w-full max-w-20 sm:max-w-26 -ml-4 -mt-3 sm:-mt-4 aspect-square transition-all"
                  src="/brand/eternl.svg"
                  alt="Eternl logo"
                />

                <div className="grow w-full h-full -mt-4 flex flex-col justify-start items-end">
                  <div className="text-xl sm:text-2xl font-bold text-white/90 mt-4">
                    90%
                  </div>
                  <div className="text-md sm:text-lg font-semibold text-white/80 flex items-center gap-2 mt-1">
                    <div className="text-left">Eternl</div>
                  </div>
                  <div className="text-xs sm:text-sm text-white/50 mt-1">
                    v2.0.16.0
                  </div>
                  <div className="grow" />
                </div>
              </div>

              <div className="relative w-full text-xs text-white/50 text-right -mb-1.5">
                Tastenkunst GmbH
              </div>
              <div className="relative w-full text-xs text-white/50 text-right">
                2020-2026
              </div>
            </div>

            <div className="w-full h-1.5 absolute bottom-0 left-0 rounded-b-lg overflow-hidden">
              <div className="w-full h-1.5 absolute top-0 bg-gradient-to-r from-rose-500 via-amber-400 to-fuchsia-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

