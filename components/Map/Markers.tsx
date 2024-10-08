import { DestinationCoordiContext } from '@/context/DestinationCoordiContext';
import { SourceCoordiContext } from '@/context/SourceCoordiContext';
import { UserLocationContext } from '@/context/UserLocationContext';
import React, { useContext } from 'react'
import {Map,Marker} from 'react-map-gl'
import drop from "../../Public/drop.png"
import pin from "../../Public/pin.png"
import Image from "next/image";

function Markers
() {
    const {userLocation,setUserLocation}=useContext(UserLocationContext);
    const {sourceCoordinates,setSourceCoordinates}=useContext(SourceCoordiContext);
    const {destinationCoordinates,setDestinationCoordinates}=useContext(DestinationCoordiContext);
  return (
    <div>
      {/* <Marker
        longitude={userLocation.lng} // Corrected access to lng
        latitude={userLocation.lat} // Corrected access to lat
        anchor="bottom"
      >
        <img src="./pin.png" alt="Marker" className="w-20 h-20" />{" "}
      </Marker> */}

      {/* source marker */}
      {sourceCoordinates.length != 0 ? (
        <Marker
          longitude={sourceCoordinates.lng} // Corrected access to lng
          latitude={sourceCoordinates.lat} // Corrected access to lat
          anchor="bottom"
        >
          <Image src={pin} alt="Marker" className="w-20 h-20" />{" "}
          {/* Added alt text for accessibility */}
        </Marker>
      ) : null}

      {/* destination marker */}
      {destinationCoordinates.length != 0 ? (
        <Marker
          longitude={destinationCoordinates.lng} // Corrected access to lng
          latitude={destinationCoordinates.lat} // Corrected access to lat
          anchor="bottom"
        >
          <Image src={drop} alt="Marker" className="w-10 h-10" />{" "}
        </Marker>
      ) : null}
    </div>
  );
}

export default Markers
