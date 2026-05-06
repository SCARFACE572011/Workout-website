import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    return NextResponse.json({ gifUrl: null }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const rawName = searchParams.get('name') || '';
  // Trim after slash or comma to handle compound exercise names
  const name = rawName.split(/[/,]/)[0].trim().toLowerCase();
  if (!name) {
    return NextResponse.json({ gifUrl: null }, { status: 404 });
  }

  try {
    const res = await fetch(
      `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(name)}?limit=1&offset=0`,
      {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
        },
        next: { revalidate: 604800 },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ gifUrl: null }, { status: 404 });
    }

    const data = await res.json();
    const gifUrl = Array.isArray(data) && data.length > 0 ? data[0].gifUrl : null;

    return NextResponse.json(
      { gifUrl },
      {
        status: gifUrl ? 200 : 404,
        headers: { 'Cache-Control': 'public, max-age=604800' },
      }
    );
  } catch {
    return NextResponse.json({ gifUrl: null }, { status: 404 });
  }
}
