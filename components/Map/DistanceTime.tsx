import React, { useContext } from "react";
import { DirectionDataContext } from "@/context/DirectionDataContext";

function DistanceTime() {
  const { directionData } = useContext(DirectionDataContext);

  return (
    directionData?.routes && (
      <div className="bg-yellow-500 p-3">
        <h2 className="text-yellow-100 opacity-80 text-[15px]">
          Distance:
          <span className="font-bold mr-3 text-black">
            {(directionData.routes[0].distance * 0.001).toFixed(2)} Km{" "}
            {/* Convert meters to kilometers */}
          </span>
          Duration:{" "}
          <span className="font-bold text-black">
            {(directionData.routes[0].duration / 60).toFixed(2)} mins{" "}
            {/* Convert seconds to minutes */}
          </span>
        </h2>
      </div>
    )
  );
}

export default DistanceTime;
