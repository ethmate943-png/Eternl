"use client";

import React from "react";

/**
 * The branded header for the onboarding flow.
 * Displays the Eternl logo and application version.
 */
export default function EternlOnboardingHeader() {
  return (
    <header
      className="main-layout-header fixed top-0 left-0 right-0 z-[100] w-full flex flex-row et-jc-is bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 h-16"
      data-v-8abd37e1=""
    >
      <div
        className="main-layout-header-left flex flex-row items-center justify-between w-full gap-x-4 sm:gap-x-6 lg:gap-x-10 px-4 sm:px-8 max-w-[1400px] mx-auto h-full"
        data-v-8abd37e1=""
      >
        <div
          className="relative shrink-0 grow-0 flex flex-col justify-center gap-1 lg:w-full lg:grow h-full lg:max-w-xs"
          data-v-8abd37e1=""
        >
          <button
            className="p-button p-component p-button-text relative px-2 -mx-2 py-2 -my-2 md:px-4 md:-mx-4 md:py-2 md:-my-2 hover:bg-transparent"
            data-p="text"
            type="button"
            data-pc-name="button"
            data-p-disabled="false"
            data-pc-section="root"
          >
            <img
              src="/images/eternl-logo-text-prod-white-440x128.png"
              alt="Eternl logo"
              className="h-8 block brightness-110"
            />
          </button>
          <span className="absolute bottom-1 left-0 text-[10px] text-white/40">
            v2.0.16.0
          </span>
        </div>
        <div
          className="shrink-0 grow h-full flex flex-row items-center justify-between gap-2 pl-1"
          data-v-8abd37e1=""
        >
          <div
            className="main-layout-header-center shrink-0 grow h-full flex flex-row items-center justify-start"
            data-v-8abd37e1=""
          >
            <div className="w-full hidden md:flex flex-row items-center justify-start gap-4"></div>
          </div>
          <div
            className="main-layout-header-right shrink-0 h-full flex flex-row items-center justify-end gap-2 sm:gap-4"
            data-v-8abd37e1=""
          >
            <button
              className="p-button p-component p-button-link p-0 mr-1.5"
              data-p="link"
              type="button"
              data-pc-name="button"
              data-p-disabled="false"
              data-pc-section="root"
              data-pd-tooltip="true"
            >
              <div className="flex flex-col items-end text-sm">
                <div className="flex flex-row numeric text-sm">
                  <div className="relative flex flex-row items-center truncate text-green-500 text-sm font-medium">
                    <span>+</span>
                    <span>0</span>
                    <span>.</span>
                    <span>82</span>
                    <span>%</span>
                  </div>
                </div>
                <div className="flex flex-row numeric items-center rounded-full overflow-hidden py-0">
                  <div className="relative flex flex-row items-center truncate text-sm text-white/80">
                    <span>$</span>
                    <span>0</span>
                    <span>.</span>
                    <span>25</span>
                  </div>
                </div>
              </div>
            </button>
            <div
              className="p-overlaybadge flex items-center"
              data-pc-name="overlaybadge"
              data-pc-section="root"
            >
              <span
                className="p-badge p-component p-badge-circle hidden"
                data-p="circle"
                data-pc-name="pcbadge"
                data-pc-extend="badge"
                data-pc-section="root"
              >
                0
              </span>
            </div>
            <button
              className="p-button p-component p-button-link p-button-rounded p-1 text-white/80 hover:text-white transition"
              data-p="rounded link"
              type="button"
              data-pc-name="button"
              data-p-disabled="false"
              data-pc-section="root"
              data-pd-tooltip="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
                className="w-6 h-6"
              >
                <path
                  d="M21.5 14.0784C20.3003 14.7189 18.9301 15.0821 17.4751 15.0821C12.7491 15.0821 8.91792 11.2509 8.91792 6.52485C8.91792 5.06986 9.28105 3.69968 9.92163 2.5C5.66765 3.49698 2.5 7.31513 2.5 11.8731C2.5 17.1899 6.8101 21.5 12.1269 21.5C16.6849 21.5 20.503 18.3324 21.5 14.0784Z"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>
            <div className="pt-3 pb-3 h-full flex items-center">
              <div
                className="p-divider p-component p-divider-vertical p-divider-solid p-divider-center ml-0 mr-1.5 sm:mr-2 border-l border-white/20 h-8 mx-2"
                role="separator"
                aria-orientation="vertical"
                data-p="vertical solid"
                data-pc-name="divider"
                data-pc-section="root"
                style={{ alignItems: "center" }}
              ></div>
            </div>
            <div
              className="h-full flex flex-col items-end justify-center text-[10px] sm:text-xs text-white/50 leading-tight"
              data-pd-tooltip="true"
            >
              <div className="capitalize">epoch: 621</div>
              <div>Remaining time</div>
              <div> ~2d 09:03:31</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
