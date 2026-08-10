import crypto from "crypto";

/**
 * Firma de integridad de Wompi Web Checkout.
 * Orden estricto: referencia + monto_en_centavos + moneda + [expiración] + secreto_integridad
 * https://docs.wompi.co (Widget & Checkout Web)
 */
export function buildIntegritySignature(params: {
  reference: string;
  amountInCents: number;
  currency: string;
  expirationTime?: string;
}) {
  const { reference, amountInCents, currency, expirationTime } = params;
  const secret = process.env.WOMPI_INTEGRITY_SECRET;
  if (!secret) throw new Error("Falta WOMPI_INTEGRITY_SECRET");

  const base = expirationTime
    ? `${reference}${amountInCents}${currency}${expirationTime}${secret}`
    : `${reference}${amountInCents}${currency}${secret}`;

  return crypto.createHash("sha256").update(base).digest("hex");
}

export function generateReference() {
  return `DON-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
}

export const WOMPI_CHECKOUT_URL = "https://checkout.wompi.co/p/";
