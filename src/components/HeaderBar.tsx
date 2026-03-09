export function HeaderBar() {
  return (
    <header className="flex items-center justify-between border-b border-[color:var(--pray-color-white-40)] pb-4">
      <div className="flex items-baseline gap-3">
        <span className="text-xs tracking-[0.3em] uppercase text-[color:var(--pray-color-ink-50)]">
          PRAY-I
        </span>
        <span className="text-xs text-[color:var(--pray-color-ink-40)]">
          delegated devotion experiment
        </span>
      </div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--pray-color-ink-40)]">
        an artwork about outsourced faith
      </div>
    </header>
  );
}
