export function HeroSection() {
  return (
    <section className="mt-10 space-y-6">
      <div className="max-w-xl space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--pray-color-ink-45)]">
          OFFER YOUR REQUEST
        </p>
        <h1 className="text-4xl font-light leading-tight text-[color:var(--pray-color-ink-90)] sm:text-5xl">
          Offload your prayer to a machine.
        </h1>
        <p className="max-w-lg text-sm leading-relaxed text-[color:var(--pray-color-ink-70)]">
          Describe what you would hold in prayer. We translate your offering into
          machine time, letting an artificial agent repeat your request far more
          often than a human could, while you do anything else.
        </p>
      </div>
      <p className="max-w-md text-xs leading-relaxed text-[color:var(--pray-color-ink-60)]">
        This is an experimental artwork. No outcomes are promised. No personal
        data is stored. You are paying to give a language model the opportunity
        to meditate on your words.
      </p>
    </section>
  );
}
