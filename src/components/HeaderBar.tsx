export function HeaderBar() {
  return (
    <header className="flex items-center justify-between border-b border-white/40 pb-4">
      <div className="flex items-baseline gap-3">
        <span className="text-xs tracking-[0.3em] uppercase text-[rgba(0,0,0,0.5)]">
          PRAY-I
        </span>
        <span className="text-xs text-[rgba(0,0,0,0.4)]">
          delegated devotion experiment
        </span>
      </div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-[rgba(0,0,0,0.4)]">
        an artwork about outsourced faith
      </div>
    </header>
  );
}
