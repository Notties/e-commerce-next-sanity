import prisma from "@/lib/prisma";
import { createClient } from "next-sanity";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  // Get Stripe client
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-06-30.basil",
  });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  // Get sanity client
  const sanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    token: process.env.SANITY_API_WRITE_TOKEN,
  });

  try {
    const body = await req.text();
    const headerList = await headers();
    const signature = headerList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature found " },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (e) {
      console.log("Event couldn't be constructed:");
      console.log(e);
      return NextResponse.json(
        { error: "Invalid signature " },
        { status: 400 }
      );
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const cartId = session.metadata?.cartId;
        const userId = session.metadata?.userId;

        if (!cartId) {
          throw new Error("No cart ID in session metadata");
        }

        const cart = await prisma.cart.findUnique({
          where: {
            id: cartId,
          },
          include: {
            items: true,
          },
        });

        if (!cart) {
          throw new Error("Cart not found");
        }

        await sanityClient.create({
          _type: "order",
          orderNumber: session.id.slice(-8).toUpperCase(),
          orderDate: new Date().toISOString(),
          customerId: userId !== "-" ? userId : undefined,
          customerEmail: session.customer_details?.email,
          customerName: session.customer_details?.name,
          stripeCustomerId:
            typeof session.customer === "object"
              ? session.customer?.id || ""
              : session.customer,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string,
          totalPrice: Number(session.amount_total) / 100,
          shippingAddress: {
            _type: "shippingAddress",
            name: "",
            line1: "",
            line2: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
          },
          orderItems: cart.items.map((item) => ({
            _type: "orderItem",
            _key: item.id,
            product: {
              _type: "reference",
              _ref: item.sanityProductId,
            },
            quantity: item.quantity,
            price: item.price,
          })),
          status: "PROCESSING",
        });

        await prisma.cart.delete({
          where: {
            id: cartId,
          },
        });
        break;
      }

      default: {
        console.log(`Unhandled event type: ${event.type}`);
        break;
      }
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.log("Something went wrong:");
    console.log(e);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
