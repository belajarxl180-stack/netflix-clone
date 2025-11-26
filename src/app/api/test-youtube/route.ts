import { NextResponse } from 'next/server';

const YOUTUBE_API_KEY = "AIzaSyBZL7dc2iZrjcbcj_XwIXfqcFqpnyz0yLU";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'Nahual 2025 official trailer';
  
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&type=video&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    return NextResponse.json({
      success: res.ok,
      status: res.status,
      query: query,
      results: data.items?.length || 0,
      videos: data.items?.map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
      })) || [],
      error: data.error || null,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
