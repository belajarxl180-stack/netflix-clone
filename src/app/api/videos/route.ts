import { getMovieVideos } from "@/lib/tmdb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const movieId = searchParams.get("movieId");

  if (!movieId) {
    return NextResponse.json({ results: [] });
  }

  const data = await getMovieVideos(movieId);
  return NextResponse.json(data);
}
