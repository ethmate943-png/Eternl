"use client";

/* Navbar with gradient underline */
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#232323]/95 backdrop-blur-md">
      <div className="w-full">
        <nav className="flex items-center px-6 sm:px-10 lg:px-14 pt-4 sm:pt-5 pb-3">
          <div className="flex items-start gap-2 sm:gap-2">
            <div className="leading-tight">
              <div className="text-white font-bold text-base sm:text-xl tracking-tight">Eternl</div>
              <div className="text-[10px] sm:text-[11px] text-white/30  font-medium tracking-wide">v2.0.18.4</div>
            </div>
            <img
              src="/brand/eternl.svg"
              alt="Logo"
               className="h-10 w-10 sm:h-8 sm:w-8 rounded-md"
            />
          </div>

          <div className="flex-1" />
        </nav>
      </div>

      <div
        className="h-[2px] w-full"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #44fff9 0%, #7188ff 25%, #ff5178 50%, #ffb719 75%, #d153d1 80%, rgba(209, 83, 209, 0) 100%)",
          filter: "saturate(1.4) brightness(1.1)",
        }}
      />
    </header>
  );
}
