"use client";

/* Navbar with gradient underline */
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#121212]/95 backdrop-blur-md">
      <div className="w-full">
        <nav className="flex items-center px-6 sm:px-10 lg:px-14 pt-5 sm:pt-6 pb-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="leading-tight">
              <div className="text-white font-bold text-xl sm:text-2xl tracking-tight">Eternl</div>
              <div className="text-[11px] sm:text-xs text-white/50 mt-0.5 font-medium tracking-wide">v2.0.18.4</div>
            </div>
            <img
              src="/brand/eternl.svg"
              alt="Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-md"
            />
          </div>

          <div className="flex-1" />
        </nav>
      </div>

      <div className="h-1 w-full bg-linear-to-r from-cyan-400 via-indigo-500/80 to-[#1f1828]" />
    </header>
  );
}
