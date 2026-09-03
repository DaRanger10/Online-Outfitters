import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city")?.trim();
  if (!city) {
    return NextResponse.json({ error: "City required" }, { status: 400 });
  }

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
      { next: { revalidate: 86400 } },
    );
    if (!geoRes.ok) {
      return NextResponse.json({ error: "Geocode failed" }, { status: 502 });
    }
    const geo = (await geoRes.json()) as {
      results?: { name: string; latitude: number; longitude: number }[];
    };
    const place = geo.results?.[0];
    if (!place) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`,
      { next: { revalidate: 600 } },
    );
    if (!weatherRes.ok) {
      return NextResponse.json({ error: "Weather failed" }, { status: 502 });
    }
    const weather = (await weatherRes.json()) as {
      current?: { temperature_2m: number; weather_code: number };
    };
    if (!weather.current) {
      return NextResponse.json({ error: "Weather missing" }, { status: 502 });
    }

    return NextResponse.json({
      displayName: place.name,
      tempF: Math.round(weather.current.temperature_2m),
      code: weather.current.weather_code,
    });
  } catch {
    return NextResponse.json({ error: "Weather failed" }, { status: 502 });
  }
}
