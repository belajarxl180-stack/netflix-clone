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

// YouTube fallback menggunakan alternative method
async function searchYouTubeTrailer(movieTitle: string, year?: string): Promise<string | null> {
  try {
    // Method 1: Coba beberapa variasi search query
    const queries = [
      `${movieTitle} ${year || ''} official trailer`,
      `${movieTitle} ${year || ''} trailer`,
      `${movieTitle} movie trailer`,
    ];

    // Gunakan approach sederhana: generate kemungkinan video ID
    // Berdasarkan pattern umum YouTube video ID
    const searchQuery = queries[0].trim();
    
    // Alternative: Gunakan Invidious API (YouTube proxy tanpa API key)
    const invidiousInstances = [
      'https://invidious.io.lol',
      'https://iv.ggtyler.dev',
      'https://invidious.private.coffee',
    ];

    for (const instance of invidiousInstances) {
      try {
        const url = `${instance}/api/v1/search?q=${encodeURIComponent(searchQuery)}&type=video`;
        
        const res = await fetch(url, {
          cache: 'no-store',
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });

        if (!res.ok) continue;

        const data = await res.json();
        console.log(`YouTube Search via ${instance}:`, data.length > 0 ? 'Found' : 'Not found');
        
        if (data && data.length > 0 && data[0].videoId) {
          return data[0].videoId;
        }
      } catch (err) {
        console.log(`Failed with ${instance}, trying next...`);
        continue;
      }
    }
    
    return null;
  } catch (error) {
    console.error("YouTube search error:", error);
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
