import { NextResponse } from "next/server";

const BASE_URL = "https://api.mapbox.com/search/searchbox/v1/suggest"; // Updated to correct Mapbox API endpoint

export async function GET(request: any) {
  const { searchParams } = new URL(request.url);
  const searchText = searchParams.get("q");

  if (!searchText) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(
        searchText
      )}&language=en&limit=10&session_token=5ccce4a4-ab0a-4a7c-943d-580e55542363&country=IN&access_token=${
        process.env.MAPBOX_ACCESS_TOKEN
      }`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from Mapbox API" },
        { status: res.status }
      );
    }

    const searchResult = await res.json();
    return NextResponse.json(searchResult);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching data" },
      { status: 500 }
    );
  }
}
