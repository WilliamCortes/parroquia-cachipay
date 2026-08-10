import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paypal/client";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const webhookEvent = JSON.parse(rawBody);

    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    if (webhookId) {
      const verification = await verifyWebhookSignature({
        transmissionId: req.headers.get("paypal-transmission-id") ?? "",
        transmissionTime: req.headers.get("paypal-transmission-time") ?? "",
        certUrl: req.headers.get("paypal-cert-url") ?? "",
        authAlgo: req.headers.get("paypal-auth-algo") ?? "",
        transmissionSig: req.headers.get("paypal-transmission-sig") ?? "",
        webhookId,
        webhookEvent,
      });
      if (verification.verification_status !== "SUCCESS") {
        return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
      }
    }

    if (webhookEvent.event_type !== "PAYMENT.CAPTURE.COMPLETED") {
      return NextResponse.json({ ok: true });
    }

    const capture = webhookEvent.resource;
    const orderId = capture?.supplementary_data?.related_ids?.order_id;
    if (!orderId) return NextResponse.json({ ok: true });

    const admin = createAdminClient();
    const { error } = await admin
      .from("donaciones")
      .update({ status: "completed", raw_payload: webhookEvent })
      .eq("gateway_reference", orderId);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
