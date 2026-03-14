import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET not configured");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature(body, signature, webhookSecret);
    if (!isValid) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const eventType = event.event;
    const payload = event.payload;

    switch (eventType) {
      case "subscription.charged": {
        const rzpSubId = payload.subscription?.entity?.id;
        const paymentId = payload.payment?.entity?.id;
        const amount = payload.payment?.entity?.amount;

        if (rzpSubId) {
          await prisma.subscription.update({
            where: { razorpaySubscriptionId: rzpSubId },
            data: {
              status: "ACTIVE",
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          });

          if (paymentId) {
            await prisma.payment.upsert({
              where: { razorpayPaymentId: paymentId },
              update: { status: "captured", amountPaise: amount || 19900 },
              create: {
                subscriptionId: (
                  await prisma.subscription.findUnique({
                    where: { razorpaySubscriptionId: rzpSubId },
                    select: { id: true },
                  })
                )!.id,
                razorpayPaymentId: paymentId,
                amountPaise: amount || 19900,
                status: "captured",
                paidAt: new Date(),
              },
            });
          }
        }
        break;
      }

      case "subscription.halted":
      case "subscription.cancelled": {
        const rzpSubId = payload.subscription?.entity?.id;
        if (rzpSubId) {
          await prisma.subscription.update({
            where: { razorpaySubscriptionId: rzpSubId },
            data: {
              status: "CANCELLED",
              cancelledAt: new Date(),
            },
          });
        }
        break;
      }

      case "subscription.pending": {
        const rzpSubId = payload.subscription?.entity?.id;
        if (rzpSubId) {
          await prisma.subscription.update({
            where: { razorpaySubscriptionId: rzpSubId },
            data: { status: "PAST_DUE" },
          });
        }
        break;
      }

      case "payment.failed": {
        const paymentId = payload.payment?.entity?.id;
        if (paymentId) {
          // Log failed payment but don't change subscription status
          // (Razorpay will send subscription.pending/halted separately)
          console.warn(`Payment failed: ${paymentId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
