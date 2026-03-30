"use client";

import React from "react";


export default function EternlOnboardingHeader() {
  return (
    <header
      data-v-c5fc6fea=""
      className="main-layout-header w-full flex flex-row et-jc-is fixed top-0 left-0 right-0 z-[100] bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 h-16"
    >
      <div
        data-v-c5fc6fea=""
        className="main-layout-header-left flex flex-row et-jb-ic w-full et-header et-header-p gap-x-4 sm:gap-x-6 et-max-width-global lg:gap-x-10 px-4 sm:px-8 max-w-[1400px] mx-auto h-full"
      >
        <div
          data-v-c5fc6fea=""
          className="relative shrink-0 grow-0 flex flex-col et-jc-is lg:w-full lg:grow h-full transition-all lg:et-max-width-menu justify-center"
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
              src="https://eternl.io/images/eternl-logo-text-prod-white-440x128.png"
              alt="Eternl logo"
              className="h-8 block"
            />
          </button>
          <span className="absolute bottom-0 text-[10px] text-white/40 left-0">
            v2.0.16.0
          </span>
        </div>
        <div
          data-v-c5fc6fea=""
          className="shrink-0 grow h-full flex flex-row et-jb-ic et-gap-sm pl-1"
        >
          <div
            data-v-c5fc6fea=""
            className="main-layout-header-center shrink-0 grow h-full flex flex-row et-js-ic"
          ></div>
          <div
            data-v-c5fc6fea=""
            className="main-layout-header-right shrink-0 h-full flex flex-row et-js-ic et-gap-xs"
          ></div>
        </div>
      </div>
      {/* Gradient bottom line */}
      <div 
        className="absolute -bottom-[2px] left-0 right-0 h-[5px]" 
        style={{ background: 'linear-gradient(90deg,#44fff9 0%,#7188ff 25%,#ff5178 50%,#ffb719 75%,#d153d1 100%)' }}
      />
    </header>
  );
}
