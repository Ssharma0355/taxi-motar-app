"use client";
import React, { useState } from "react";
import CardList from "../Data/CardList";
import Image from "next/image";

function Cards() {
  const [selectedCard, setSelectedCard] = useState<any>();
  return (
    <div>
      <h1 className="text-[14px] font-medium">Payment Methods</h1>
      <div className="grid grid-cols-5 m-2 pl-2">
        {CardList.map((item, index) => (
          <div
            key={index}
            className={`w-[50px] border-[1px] flex items-center justify-center rounded-md 
            cursor-pointer hover:scale-110 transition-all
            hover:border-yellow-400 ${index===selectedCard?`border-yellow-400 border-w-[3px]`:null}`}
            onClick={() => setSelectedCard(index)}
          >
            <Image src={item.image} alt={item.name} width={40} height={80} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cards;
