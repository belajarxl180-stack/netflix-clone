"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const url = `/api/search?q=${encodeURIComponent(query)}`;
      console.log('Fetching:', url);
      
      const res = await fetch(url);
      const data = await res.json();
      
      console.log('Search response:', data);
      console.log('Results count:', data.results?.length || 0);
      
      setMovies(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />

      <div className="px-10 py-10">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies..."
              className="flex-1 px-6 py-4 rounded-lg bg-gray-900 text-white text-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-red-600 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {/* Results */}
        {loading ? (
          <p className="text-center text-gray-400 text-xl">Searching...</p>
        ) : movies.length > 0 ? (
          <>
            <h2 className="text-2xl font-semibold mb-6">
              Found {movies.length} results for &quot;{query}&quot;
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {movies.map((movie: any) => (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:scale-105 transition cursor-pointer"
                >
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-72 object-cover"
                    />
                  ) : (
                    <div className="w-full h-72 bg-gray-800 flex items-center justify-center">
                      No Image
                    </div>
                  )}
                  <div className="p-3">
                    <h2 className="text-sm font-semibold truncate">{movie.title}</h2>
                    <p className="text-yellow-400 text-xs mt-1">
                      ⭐ {movie.vote_average?.toFixed(1)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : query ? (
          <p className="text-center text-gray-400 text-xl">
            No results found for &quot;{query}&quot;
          </p>
        ) : (
          <p className="text-center text-gray-400 text-xl">
            Enter a movie title to search
          </p>
        )}
      </div>
    </main>
  );
}
