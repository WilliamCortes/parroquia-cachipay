export function SectionEyebrow({
  children,
  tone = "light",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className={`h-px w-8 ${tone === "dark" ? "bg-oro/50" : "bg-carmelo/40"}`} />
      <p
        className={`text-xs font-semibold uppercase tracking-[0.25em] ${
          tone === "dark" ? "text-oro-pale" : "text-carmelo/80"
        }`}
      >
        {children}
      </p>
    </div>
  );
}
