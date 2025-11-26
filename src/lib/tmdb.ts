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

// YouTube API fallback
const YOUTUBE_API_KEY = "AIzaSyBZL7dc2iZrjcbcj_XwIXfqcFqpnyz0yLU";

async function searchYouTubeTrailer(movieTitle: string, year?: string): Promise<string | null> {
  try {
    const searchQuery = `${movieTitle} ${year || ''} official trailer`.trim();
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(searchQuery)}&type=video&key=${YOUTUBE_API_KEY}`;
    
    const res = await fetch(url, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      console.error("YouTube API Error:", res.status);
      return null;
    }

    const data = await res.json();
    
    if (data.items && data.items.length > 0) {
      return data.items[0].id.videoId;
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
    // 1. Coba ambil dari TMDB
    const tmdbVideos = await getMovieVideos(movieId);
    const tmdbTrailer = tmdbVideos?.results?.find(
      (video: any) => video.type === "Trailer" && video.site === "YouTube"
    );

    if (tmdbTrailer?.key) {
      console.log("✅ Trailer found in TMDB");
      return tmdbTrailer.key;
    }

    // 2. Fallback ke YouTube API
    console.log("⚠️ TMDB trailer not found, searching YouTube...");
    const youtubeVideoId = await searchYouTubeTrailer(movieTitle, releaseYear);
    
    if (youtubeVideoId) {
      console.log("✅ Trailer found in YouTube");
      return youtubeVideoId;
    }

    console.log("❌ No trailer found");
    return null;
  } catch (error) {
    console.error("Error getting trailer:", error);
    return null;
  }
}
