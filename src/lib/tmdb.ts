const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function getPopularMovies() {
  try {
    const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`TMDB API Error: ${res.status} - ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("TMDB fetch error:", error);
    return { results: [] };
  }
}

export async function getMovieDetail(movieId: string) {
  try {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`TMDB API Error: ${res.status} - ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("TMDB fetch error:", error);
    return null;
  }
}

export async function searchMovies(query: string) {
  try {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`;

    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`TMDB API Error: ${res.status} - ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("TMDB fetch error:", error);
    return { results: [] };
  }
}

export async function getGenres() {
  try {
    const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`;

    const res = await fetch(url, {
      next: { revalidate: 86400 }, // Cache for 24 hours
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`TMDB API Error: ${res.status} - ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("TMDB fetch error:", error);
    return { genres: [] };
  }
}

export async function getMoviesByGenre(genreId: string) {
  try {
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US&page=1&sort_by=popularity.desc`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`TMDB API Error: ${res.status} - ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("TMDB fetch error:", error);
    return { results: [] };
  }
}

export async function getMovieVideos(movieId: string) {
  try {
    const url = `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`;

    const res = await fetch(url, {
      next: { revalidate: 86400 },
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`TMDB API Error: ${res.status} - ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("TMDB fetch error:", error);
    return { results: [] };
  }
}

// ========================================================
// YOUTUBE API - SMART TRAILER SEARCH WITH OFFICIAL FILTER
// ========================================================
const YOUTUBE_API_KEY = "AIzaSyBZL7dc2iZrjcbcj_XwIXfqcFqpnyz0yLU";

// Official studios for priority filtering
const OFFICIAL_STUDIOS = [
  "Warner Bros",
  "Universal",
  "Paramount",
  "Sony Pictures",
  "Marvel",
  "DC",
  "Disney",
  "20th Century Studios",
  "Lionsgate",
  "Netflix",
  "Amazon Studios",
  "Apple TV",
];

// YouTube Search Function with embeddable filter
async function youtubeSearch(query: string): Promise<any[]> {
  try {
    // Add videoEmbeddable=true to ensure video can be embedded and not blocked in certain regions
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&type=video&videoEmbeddable=true&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;
    
    const res = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.log(`⚠️ YouTube API failed: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error("YouTube search error:", error);
    return [];
  }
}

// Filter untuk ambil hanya trailer RESMI
function filterOfficialTrailers(videos: any[]): any[] {
  return videos.filter((v) => {
    const title = v.snippet.title.toLowerCase();
    const channel = v.snippet.channelTitle.toLowerCase();

    const isTrailer =
      title.includes("official trailer") ||
      title.includes("trailer") ||
      title.includes("teaser");

    const isOfficial = OFFICIAL_STUDIOS.some((studio) =>
      channel.includes(studio.toLowerCase())
    );

    return isTrailer || isOfficial;
  });
}

// Smart YouTube Trailer Search with multiple query strategies
async function searchYouTubeTrailer(movieTitle: string, year?: string): Promise<string | null> {
  try {
    console.log(`🔍 YouTube search for: "${movieTitle} (${year || 'N/A'})"`);

    // Multiple query variations for better results
    const queries = [
      `${movieTitle} ${year || ''} official trailer`,
      `${movieTitle} ${year || ''} trailer`,
      `${movieTitle} ${year || ''} teaser trailer`,
      `${movieTitle} official trailer`,
    ];

    // Try each query until we find an embeddable video
    for (const query of queries) {
      const videos = await youtubeSearch(query.trim());
      
      // First try: Filter for official trailers
      const filtered = filterOfficialTrailers(videos);
      if (filtered.length > 0) {
        const videoId = filtered[0].id.videoId;
        console.log(`✅ Found embeddable official trailer via "${query}":`, videoId);
        return videoId;
      }

      // Second try: Use any video found (already filtered by videoEmbeddable=true)
      if (videos.length > 0) {
        const videoId = videos[0].id.videoId;
        console.log(`✅ Found embeddable trailer via "${query}":`, videoId);
        return videoId;
      }
    }

    console.log("❌ No embeddable trailer found on YouTube");
    return null;
  } catch (error) {
    console.error("YouTube trailer search error:", error);
    return null;
  }
}

// Fungsi utama: coba TMDB dulu, fallback ke YouTube
export async function getTrailerVideoId(movieId: string, movieTitle: string, releaseYear?: string): Promise<string | null> {
  try {
    console.log(`🔍 Searching trailer for: ${movieTitle} (${releaseYear || 'N/A'})`);
    
    // 1. Coba ambil dari TMDB
    const tmdbVideos = await getMovieVideos(movieId);
    console.log(`📺 TMDB videos found:`, tmdbVideos?.results?.length || 0);
    
    const tmdbTrailer = tmdbVideos?.results?.find(
      (video: any) => video.type === "Trailer" && video.site === "YouTube"
    );

    if (tmdbTrailer?.key) {
      console.log("✅ Trailer found in TMDB:", tmdbTrailer.key);
      return tmdbTrailer.key;
    }

    // 2. Fallback ke YouTube API
    console.log("⚠️ TMDB trailer not found, searching YouTube API...");
    const youtubeVideoId = await searchYouTubeTrailer(movieTitle, releaseYear);
    
    if (youtubeVideoId) {
      console.log("✅ Trailer found in YouTube:", youtubeVideoId);
      return youtubeVideoId;
    }

    console.log("❌ No trailer found anywhere");
    return null;
  } catch (error) {
    console.error("Error getting trailer:", error);
    return null;
  }
}
