import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const signature = req.headers.get("x-event-checksum");

    const eventsKey = process.env.WOMPI_EVENTS_KEY;
    const transaction = body.event?.data?.transaction;
    if (!transaction) return NextResponse.json({ ok: true });

    if (eventsKey && signature) {
      const checkString = `${transaction.id}${transaction.status}${transaction.amount_in_cents}${transaction.currency}${eventsKey}`;
      const expected = crypto.createHash("sha256").update(checkString).digest("hex");
      if (expected !== signature) {
        return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
      }
    }

    const status =
      transaction.status === "APPROVED"
        ? "completed"
        : transaction.status === "DECLINED" || transaction.status === "VOIDED"
        ? "failed"
        : "pending";

    const admin = createAdminClient();
    const { error } = await admin
      .from("donaciones")
      .update({
        status,
        donor_email: transaction.customer_email ?? undefined,
        donor_name: transaction.payment_method?.extra?.name ?? undefined,
        raw_payload: body,
      })
      .eq("gateway_reference", transaction.reference);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Wompi webhook error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
