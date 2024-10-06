"use client";
import Booking from "@/components/Booking/Booking";
import HomeF from "@/components/HomeF";
import MapBoxMap from "@/components/Map/MapBoxMap";
import { DestinationCoordiContext } from "@/context/DestinationCoordiContext";
import { DirectionDataContext } from "@/context/DirectionDataContext";
import { SelectedCarAmount } from "@/context/SelectedCarAmount";
import { SourceCoordiContext } from "@/context/SourceCoordiContext";
import { UserLocationContext } from "@/context/UserLocationContext"; // Corrected import
import { useEffect, useState } from "react";

export default function Home() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null); // Define state type
  const [sourceCoordinates, setSourceCoordinates] = useState<any>([]);
  const [destinationCoordinates, setDestinationCoordinates] = useState<any>([]);
  const [directionData, setDirectionData] = useState<any>([]);
  // const [carAmount,setCarAmount]= useState<any>();
  const [carAmount,setCarAmount]= useState<number | null>();

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          console.log("Position:", pos);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div>
      <UserLocationContext.Provider value={{ userLocation, setUserLocation }}>
        <SourceCoordiContext.Provider
          value={{ sourceCoordinates, setSourceCoordinates }}
        >
          <DestinationCoordiContext.Provider
            value={{ destinationCoordinates, setDestinationCoordinates }}
          >
            <DirectionDataContext.Provider
              value={{ directionData, setDirectionData }}
            >
              <SelectedCarAmount.Provider value={{ carAmount, setCarAmount }}>
                <div className="grid grid-cols-1 md:grid-cols-3 ">
                  <div>
                    <Booking />
                  </div>
                  {/* for 2 cols */}
                  <div className="col-span-2">
                    <MapBoxMap />
                  </div>
                </div>
              </SelectedCarAmount.Provider>
            </DirectionDataContext.Provider>
          </DestinationCoordiContext.Provider>
        </SourceCoordiContext.Provider>
      </UserLocationContext.Provider>
    </div>
  );
}
