"use client";
import CheckoutForm from "@/components/payment/CheckoutForm";
import { SelectedCarAmount } from "@/context/SelectedCarAmount";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useContext } from "react";
function Payment() {
  // const { carAmount, setCarAmount } = useContext(SelectedCarAmount);
 const stripePromise = loadStripe(
   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
 );
 const clientSecret = process.env.STRIPE_SECRET_KEY;
//  const {carAmount}= useContext(SelectedCarAmount);
//  console.log(carAmount);

  const options: any = {
    clientSecret,
    mode: "payment",
    amount: 3000,
    currency: "eur",
    payment_method_types: [
      "bancontact",
      "card",
      "eps",
      "giropay",
      "ideal",
      "p24",
      "sepa_debit",
    ],
  };
  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
   
  );
}

export default Payment;
