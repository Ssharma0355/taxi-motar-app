import React, { useContext, useState } from "react";
import AutoCompleteAddress from "./AutoCompleteAddress";
import Cars from "./Cars";
import Cards from "./Cards";
import { useRouter } from "next/navigation";
import { SelectedCarAmount } from "@/context/SelectedCarAmount";

function Booking() {
  const [amount, setAmount] = useState();
  const { carAmount, setCarAmount } = useContext(SelectedCarAmount);
  const router = useRouter();

  return (
    <div className="p-5">
      <h2 className="text-[20px] font-semibold">Booking</h2>
      <div className="border-[1px] p-4 rounded-md h-full">
        <AutoCompleteAddress />
        <Cars />
        <Cards />
        <button
          className={`w-full p-1 rounded-md mt-4 ${
            carAmount ? "bg-yellow-400" : "bg-gray-200"
          }`}
          // disabled={!carAmount}
          onClick={() => router.push("/payment")}
        >
          Book Ride
        </button>
      </div>
    </div>
  );
}

export default Booking;
