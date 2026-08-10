import { NextRequest, NextResponse } from "next/server";
import { captureOrder } from "@/lib/paypal/client";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { orderID } = await req.json();
    if (!orderID) return NextResponse.json({ error: "Falta orderID" }, { status: 400 });

    const capture = await captureOrder(orderID);
    const status = capture.status === "COMPLETED" ? "completed" : "pending";

    const payer = capture.payer;
    const donorEmail = payer?.email_address ?? null;
    const donorName = payer
      ? `${payer.name?.given_name ?? ""} ${payer.name?.surname ?? ""}`.trim() || null
      : null;

    const admin = createAdminClient();
    const { error } = await admin
      .from("donaciones")
      .update({ status, donor_email: donorEmail, donor_name: donorName, raw_payload: capture })
      .eq("gateway_reference", orderID);
    if (error) throw error;

    return NextResponse.json({ status: capture.status });
  } catch (error) {
    console.error("PayPal capture-order error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
