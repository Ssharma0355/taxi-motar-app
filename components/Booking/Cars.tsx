"use client";
import React, { useContext, useState } from "react";
import CarList from "../Data/CarList";
import Image from "next/image";
import { DirectionDataContext } from "@/context/DirectionDataContext";
import { SelectedCarAmount } from "@/context/SelectedCarAmount";

function Cars() {
  const [selectedCar, setSelectedCar] = useState<any>();
  const {directionData,setDirectionData} = useContext(DirectionDataContext);
  const {carAmount,setCarAmount} = useContext(SelectedCarAmount);
  const getCost =(charges:any)=>{
    return (charges*directionData.routes[0].distance*0.000621371192).toFixed(2)
  }

  return (
    <div className="mt-2">
      <h2 className="font-semibold">Select Cars</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {CarList.map((item, index) => (
          <div
            key={index}
            className={`m-2 p-2 border-[1px] rounded-md hover:border-yellow-400 cursor-pointer ${index===selectedCar?`border-yellow-400 border-[2px]`:null}`}
            onClick={()=>{setSelectedCar(index); setCarAmount(getCost(item.charges))}}
          >
            <Image
              src={item.image}
              alt={item.name}
              width={75}
              height={90}
              className="w-full"
            />
            <h2 className="text-[12px] text-gray-500">
              {item.name}
              {directionData.routes?
              <span className="float-right font-md text-black">Rs {getCost(item.charges)}</span>:null
               }
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cars;
