"use client";

import { DestinationCoordiContext } from "@/context/DestinationCoordiContext";
import { SourceCoordiContext } from "@/context/SourceCoordiContext";
import React, { useContext, useEffect, useState } from "react";
const session_token = "5ccce4a4-ab0a-4a7c-943d-580e55542363";
const MAPBOX_RETRIEVE_URL =
  "https://api.mapbox.com/search/searchbox/v1/retrieve/";

function AutoCompleteAddress() {
  const [source, setSource] = useState<string>("");
  const [destination, setDestination] = useState<string>("");

  const [sourceAddressList, setSourceAddressList] = useState<any>({
    suggestions: [],
  });
  const [destinationAddressList, setDestinationAddressList] = useState<any>({
    suggestions: [],
  });

  const [sourceChange, setSourceChange] = useState<boolean>(false);
  const [destinationChange, setDestinationChange] = useState<boolean>(false);
  const { sourceCoordinates, setSourceCoordinates } =
    useContext(SourceCoordiContext);
  const { destinationCoordinates, setDestinationCoordinates } = useContext(
    DestinationCoordiContext
  );

  // Fetch suggestions when 'source' changes
  useEffect(() => {
    if (!sourceChange) return; // Exit if no source change is detected
    const delayBounce = setTimeout(() => {
      if (source) {
        getAddress(source, setSourceAddressList);
      }
    }, 1000);
    return () => clearTimeout(delayBounce); // Cleanup on unmount
  }, [source]);

  // Fetch suggestions when 'destination' changes
  useEffect(() => {
    if (!destinationChange) return; // Exit if no destination change is detected
    const delayBounce = setTimeout(() => {
      if (destination) {
        getAddress(destination, setDestinationAddressList);
      }
    }, 1000);
    return () => clearTimeout(delayBounce); // Cleanup on unmount
  }, [destination]);

  // Fetch address suggestions from your API
  const getAddress = async (query: string, setAddressList: Function) => {
    try {
      const res = await fetch(`/api/search-address?q=${query}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      setAddressList(result);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // Handle source address click to fetch full address details
  const onSourceAddressClick = async (item: any) => {
    try {
      setSource(item.full_address);
      setSourceAddressList({ suggestions: [] });
      setSourceChange(false); // Disable further source suggestions

      const res = await fetch(
        `${MAPBOX_RETRIEVE_URL}${item.mapbox_id}?session_token=${session_token}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
      );
      const result = await res.json();
      setSourceCoordinates({
        lng: result.features[0].geometry.coordinates[0],
        lat: result.features[0].geometry.coordinates[1],
      });
      console.log(result);
    } catch (error) {
      console.error("Error fetching address details:", error);
    }
  };

  // Handle destination address click to fetch full address details
  const onDestinationAddressClick = async (item: any) => {
    try {
      setDestination(item.full_address);
      setDestinationAddressList({ suggestions: [] });
      setDestinationChange(false); // Disable further destination suggestions

      const res = await fetch(
        `${MAPBOX_RETRIEVE_URL}${item.mapbox_id}?session_token=${session_token}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
      );
      const result = await res.json();
      setDestinationCoordinates({
        lng: result.features[0].geometry.coordinates[0],
        lat: result.features[0].geometry.coordinates[1],
      });
      console.log(result);
    } catch (error) {
      console.error("Error fetching address details:", error);
    }
  };

  return (
    <div className="mt-5">
      {/* Source Address Input */}
      <div className="relative">
        <label className="text-gray-400">Where from?</label>
        <input
          type="text"
          className="bg-white p-1 border-[1px] w-full rounded-md outline-none focus:border-yellow-300"
          onChange={(e) => {
            setSource(e.target.value);
            setSourceChange(true); // Enable fetching suggestions on change
          }}
          value={source}
        />
        {sourceAddressList?.suggestions.length > 0 && sourceChange && (
          <div className="mt-2 shadow-md p-1 rounded-md absolute w-full bg-white z-10">
            {sourceAddressList.suggestions.map((item: any, index: number) => (
              <h2
                className="p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => onSourceAddressClick(item)}
                key={index}
              >
                {item.full_address}
              </h2>
            ))}
          </div>
        )}
      </div>

      {/* Destination Address Input */}
      <div className="mt-3 relative">
        <label className="text-gray-400">Where to?</label>
        <input
          type="text"
          className="bg-white p-1 border-[1px] w-full rounded-md outline-none focus:border-yellow-300"
          onChange={(e) => {
            setDestination(e.target.value);
            setDestinationChange(true); // Enable fetching suggestions on change
          }}
          value={destination}
        />
        {destinationAddressList?.suggestions.length > 0 &&
          destinationChange && (
            <div className="mt-2 shadow-md p-1 rounded-md absolute w-full bg-white z-10">
              {destinationAddressList.suggestions.map(
                (item: any, index: number) => (
                  <h2
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => onDestinationAddressClick(item)}
                    key={index}
                  >
                    {item.full_address}
                  </h2>
                )
              )}
            </div>
          )}
      </div>
    </div>
  );
}

export default AutoCompleteAddress;
