import Image from "next/image";

export function SiteLogo({ className = "size-9" }: { className?: string }) {
  return (
    <span className={`relative shrink-0 overflow-hidden rounded-full ring-1 ring-oro/70 ${className}`}>
      <Image
        src="/images/logo-parroquia-real.jpg"
        alt="Escudo de la Parroquia Nuestra Señora del Carmen de Cachipay"
        fill
        className="object-cover"
        sizes="40px"
      />
    </span>
  );
}
