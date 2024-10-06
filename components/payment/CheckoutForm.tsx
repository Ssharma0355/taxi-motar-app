import {
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { PaymentElement } from "@stripe/react-stripe-js";
import React, { useState } from "react";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!elements || !stripe) {
      return;
    }

    setLoading(true);

    try {
      // Make a request to your backend to create a PaymentIntent
      const res = await fetch("/api/create-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 5800, // 5800 paise (₹58) in the smallest currency unit for INR
        }),
      });

      const { clientSecret } = await res.json();

      // Confirm the payment using Stripe
      const { error } = await stripe.confirmPayment({
        clientSecret,
        elements,
        confirmParams: {
          return_url: "https://localhost:3000", // Change this in production
        },
      });

      if (error) {
        setErrorMessage(error.message || "Something went wrong.");
        console.error("Payment confirmation error:", error);
      } else {
        console.log("Payment successful!");
      }
    } catch (error) {
      setErrorMessage("Failed to process payment.");
      console.error("Payment processing error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full mt-10 border-500-black">
      <form onSubmit={handleSubmit} className="max-w-md">
        <PaymentElement />

        <button
          className="w-full bg-yellow-500 p-2 rounder-lg mt-2"
          type="submit"
          disabled={!stripe || !elements || loading}
        >
          {loading ? "Processing..." : "Pay"}
        </button>
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      </form>
    </div>
  );
}

export default CheckoutForm;
