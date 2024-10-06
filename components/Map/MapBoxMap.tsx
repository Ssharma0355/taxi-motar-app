"use client";
import { UserLocationContext } from "@/context/UserLocationContext";
import React, { useContext, useEffect, useRef } from "react";
import { Map, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Markers from "./Markers";
import { DestinationCoordiContext } from "@/context/DestinationCoordiContext";
import { SourceCoordiContext } from "@/context/SourceCoordiContext";
import { DirectionDataContext } from "@/context/DirectionDataContext";
import MapBoxRoute from "./MapBoxRoute";
import DistanceTime from "./DistanceTime";

const MAPBOX_DRIVING_ENDPOINT =
  "https://api.mapbox.com/directions/v5/mapbox/driving/";

function MapBoxMap() {
  const mapRef = useRef<any>();
  const { userLocation } = useContext(UserLocationContext);
  const { sourceCoordinates } = useContext(SourceCoordiContext);
  const { destinationCoordinates } = useContext(DestinationCoordiContext);
  const { directionData, setDirectionData } = useContext(DirectionDataContext);

  // Fly to source coordinates when they change
  useEffect(() => {
    if (sourceCoordinates) {
      mapRef.current?.flyTo({
        center: [sourceCoordinates.lng, sourceCoordinates.lat],
        duration: 2500,
      });
    }
  }, [sourceCoordinates]);

  // Fly to destination coordinates and fetch route
  useEffect(() => {
    if (destinationCoordinates) {
      mapRef.current?.flyTo({
        center: [destinationCoordinates.lng, destinationCoordinates.lat],
        duration: 2500,
      });
    }
    if (sourceCoordinates && destinationCoordinates) {
      getDirectionRoute();
    }
  }, [destinationCoordinates]);

  // Fetch route between source and destination
  const getDirectionRoute = async () => {
    try {
      const res = await fetch(
        `${MAPBOX_DRIVING_ENDPOINT}${sourceCoordinates.lng},${sourceCoordinates.lat};${destinationCoordinates.lng},${destinationCoordinates.lat}?overview=full&geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await res.json();
      console.log(result);
      // Log the route result
      setDirectionData(result);
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-[20px] font-semibold">Spot your route</h2>
      <div className="rounded-lg overflow-hidden">
        {userLocation ? (
          <Map
            ref={mapRef}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            initialViewState={{
              longitude: userLocation.lng,
              latitude: userLocation.lat,
              zoom: 14,
            }}
            style={{ width: "100%", height: 550, borderRadius: 10 }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >
            <Markers />
            {directionData?.routes?.[0]?.geometry?.coordinates ? (
              <MapBoxRoute
                coordinates={directionData.routes[0].geometry.coordinates}
              />
            ) : null}
          </Map>
        ) : (
          <p className="text-center">Loading location...</p>
        )}
      </div>
      <div className="absolute bottom-[200px] z-20 right-[20px] hidden md:block">
        <DistanceTime />
      </div>
    </div>
  );
}

export default MapBoxMap;
