"use client";
import { UserLocationContext } from "@/context/UserLocationContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Map } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Markers from "./Markers";
import { DestinationCoordiContext } from "@/context/DestinationCoordiContext";
import { SourceCoordiContext } from "@/context/SourceCoordiContext";
import { DirectionDataContext } from "@/context/DirectionDataContext";
import MapBoxRoute from "./MapBoxRoute";
import DistanceTime from "./DistanceTime";

const MAPBOX_DRIVING_ENDPOINT =
  "https://api.mapbox.com/directions/v5/mapbox/driving/";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

function MapBoxMap() {
  const mapRef = useRef<any>();
  const { userLocation } = useContext(UserLocationContext);
  const { sourceCoordinates } = useContext(SourceCoordiContext);
  const { destinationCoordinates } = useContext(DestinationCoordiContext);
  const { directionData, setDirectionData } = useContext(DirectionDataContext);

  const [mapError, setMapError] = useState<string | null>(null);

  // Fly to source
  useEffect(() => {
    if (!mapRef.current || !sourceCoordinates) return;

    mapRef.current.flyTo({
      center: [sourceCoordinates.lng, sourceCoordinates.lat],
      duration: 2500,
    });
  }, [sourceCoordinates]);

  // Fly + route
  useEffect(() => {
    if (!sourceCoordinates || !destinationCoordinates) return;

    mapRef.current?.flyTo({
      center: [destinationCoordinates.lng, destinationCoordinates.lat],
      duration: 2500,
    });

    getDirectionRoute();
  }, [sourceCoordinates, destinationCoordinates]);

  // Directions API
  const getDirectionRoute = async () => {
    if (!MAPBOX_TOKEN) {
      setMapError("Map service unavailable (invalid API key)");
      return;
    }

    try {
      const res = await fetch(
        `${MAPBOX_DRIVING_ENDPOINT}${sourceCoordinates.lng},${sourceCoordinates.lat};${destinationCoordinates.lng},${destinationCoordinates.lat}?overview=full&geometries=geojson&access_token=${MAPBOX_TOKEN}`
      );

      if (!res.ok) {
        throw new Error("Mapbox directions service error");
      }

      const data = await res.json();

      if (!data.routes?.length) {
        throw new Error("No route found");
      }

      setDirectionData(data);
      setMapError(null);
    } catch (err) {
      console.error(err);
      setMapError("Mapbox server is having issues. Please try again later.");
    }
  };

  // ❌ Token missing → show fallback UI
  if (!MAPBOX_TOKEN) {
    return (
      <div className="p-5 text-center bg-red-50 rounded-lg">
        <h2 className="text-lg font-semibold text-red-600">
          Map service unavailable
        </h2>
        <p className="text-sm text-gray-600">
          Mapbox API key is missing or invalid.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 relative">
      <h2 className="text-[20px] font-semibold">Spot your route</h2>

      {mapError && (
        <div className="mb-3 p-3 bg-yellow-100 text-yellow-800 rounded-md text-sm">
          ⚠️ {mapError}
        </div>
      )}

      <div className="rounded-lg overflow-hidden">
        {userLocation ? (
          <Map
            ref={mapRef}
            mapboxAccessToken={MAPBOX_TOKEN}
            initialViewState={{
              longitude: userLocation.lng,
              latitude: userLocation.lat,
              zoom: 14,
            }}
            style={{ width: "100%", height: 550 }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            onError={() =>
              setMapError("Mapbox map failed to load. Please retry.")
            }
          >
            <Markers />

            {directionData?.routes?.[0]?.geometry?.coordinates && (
              <MapBoxRoute
                coordinates={directionData.routes[0].geometry.coordinates}
              />
            )}
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
