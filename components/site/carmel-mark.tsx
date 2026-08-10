/**
 * Emblema del Monte Carmelo: cruz, estrella y tres picos de montaña,
 * simplificación del escudo carmelita tradicional. Referencia directa a
 * "Nuestra Señora del Carmen" y, a la vez, a las montañas reales de
 * Cachipay.
 */
export function CarmelMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1.5" />

      {/* cruz */}
      <path
        d="M50 10 V22 M45 15 H55"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* estrella */}
      <path
        d="M50 26 Q52 35 61 37 Q52 39 50 48 Q48 39 39 37 Q48 35 50 26 Z"
        fill="currentColor"
      />

      {/* monte de tres picos */}
      <path
        d="M16 74 L33 47 L42 58 L50 38 L58 58 L67 47 L84 74 Z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <line x1="13" y1="74" x2="87" y2="74" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
