import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawName = searchParams.get('name') || '';
  const name = rawName.split(/[/,]/)[0].trim();
  if (!name) {
    return NextResponse.json({ gifUrl: null }, { status: 404 });
  }

  try {
    // Step 1: search for the exercise on Wger (free, no API key)
    const searchRes = await fetch(
      `https://wger.de/api/v2/exercise/search/?term=${encodeURIComponent(name)}&language=english&format=json`,
      { next: { revalidate: 604800 } }
    );
    if (!searchRes.ok) {
      return NextResponse.json({ gifUrl: null }, { status: 404 });
    }

    const searchData = await searchRes.json();
    const suggestions: Array<{ data: { base_id: number } }> = searchData?.suggestions ?? [];
    if (suggestions.length === 0) {
      return NextResponse.json({ gifUrl: null }, { status: 404 });
    }

    const baseId = suggestions[0].data.base_id;

    // Step 2: fetch images for that exercise
    const imgRes = await fetch(
      `https://wger.de/api/v2/exerciseimage/?format=json&exercise_base=${baseId}`,
      { next: { revalidate: 604800 } }
    );
    if (!imgRes.ok) {
      return NextResponse.json({ gifUrl: null }, { status: 404 });
    }

    const imgData = await imgRes.json();
    const imageUrl: string | null = imgData?.results?.[0]?.image ?? null;

    return NextResponse.json(
      { gifUrl: imageUrl },
      {
        status: imageUrl ? 200 : 404,
        headers: { 'Cache-Control': 'public, max-age=604800' },
      }
    );
  } catch {
    return NextResponse.json({ gifUrl: null }, { status: 404 });
  }
}
