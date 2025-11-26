import { getTrailerVideoId } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get('movieId') || '1033462';
  const title = searchParams.get('title') || 'Test Movie';
  const year = searchParams.get('year') || '2024';

  console.log(`🧪 Testing trailer search...`);
  console.log(`Movie ID: ${movieId}, Title: ${title}, Year: ${year}`);

  const trailerVideoId = await getTrailerVideoId(movieId, title, year);

  return NextResponse.json({
    movieId,
    title,
    year,
    trailerVideoId,
    success: !!trailerVideoId,
    message: trailerVideoId ? 'Trailer found!' : 'No trailer found'
  });
}
