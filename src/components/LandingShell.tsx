import type { ReactNode } from "react";

export function LandingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-heaven-bg text-heaven-fg">
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8 sm:px-8">
        {/* Soft vignette / halo edges */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--pray-color-white-70),_transparent_55%),_radial-gradient(circle_at_bottom,_var(--pray-color-halo-warm),_transparent_60%)] opacity-80" aria-hidden="true" />
        <div className="relative flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
