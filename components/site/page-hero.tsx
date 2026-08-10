import { CarmelMark } from "./carmel-mark";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="relative overflow-hidden bg-espresso py-20 text-espresso-foreground">
      <CarmelMark className="pointer-events-none absolute -right-12 -top-12 size-64 text-oro/[0.08]" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-oro" />
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-oro-pale">{eyebrow}</p>
        </div>
        <h1 className="mt-4 font-serif text-4xl font-semibold sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-xl text-espresso-foreground/70">{description}</p>
        )}
      </div>
    </div>
  );
}
