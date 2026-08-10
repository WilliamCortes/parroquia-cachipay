export function OrnateFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative p-8 sm:p-10 ${className}`}>
      <span className="pointer-events-none absolute left-0 top-0 size-8 border-l-2 border-t-2 border-oro" />
      <span className="pointer-events-none absolute right-0 top-0 size-8 border-r-2 border-t-2 border-oro" />
      <span className="pointer-events-none absolute bottom-0 left-0 size-8 border-b-2 border-l-2 border-oro" />
      <span className="pointer-events-none absolute bottom-0 right-0 size-8 border-b-2 border-r-2 border-oro" />
      {children}
    </div>
  );
}
