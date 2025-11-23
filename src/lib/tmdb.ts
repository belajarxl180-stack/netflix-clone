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
