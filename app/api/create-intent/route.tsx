import { NextResponse } from "next/server";
import Stripe from "stripe"; // Import from 'stripe' for backend use

// Initialize Stripe instance with the secret key
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY,{

  apiVersion: "2024-09-30.acacia",
  typescript: true,
});

export async function POST(request: Request) {
  const data = await request.json();
  const amount = data.amount;

  try {
    // Create a PaymentIntent with the specified amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount),
      currency: "INR",
    });

    // Return the client secret from the PaymentIntent
    return NextResponse.json(
      { client_secret: paymentIntent.client_secret },
      { status: 200 }
    );
  } catch (error: any) {
    // Handle the error and return a structured error message
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
