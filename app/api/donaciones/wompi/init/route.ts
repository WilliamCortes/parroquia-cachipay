import { NextRequest, NextResponse } from "next/server";
import { donacionSchema } from "@/lib/schema/donacion";
import { buildIntegritySignature, generateReference, WOMPI_CHECKOUT_URL } from "@/lib/wompi/client";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = donacionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const { amount, donor_name, donor_email, purpose } = parsed.data;
    const reference = generateReference();
    const amountInCents = Math.round(amount * 100);
    const currency = "COP";
    const signature = buildIntegritySignature({ reference, amountInCents, currency });

    const admin = createAdminClient();
    const { error } = await admin.from("donaciones").insert({
      donor_name: donor_name || null,
      donor_email: donor_email || null,
      amount,
      currency,
      gateway: "wompi",
      gateway_reference: reference,
      status: "pending",
      purpose,
    });
    if (error) throw error;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    return NextResponse.json({
      checkoutUrl: WOMPI_CHECKOUT_URL,
      publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
      currency,
      amountInCents,
      reference,
      signature,
      redirectUrl: `${appUrl}/donaciones/gracias`,
    });
  } catch (error) {
    console.error("Wompi init error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
