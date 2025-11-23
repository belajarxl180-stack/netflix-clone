"use client";

import { useState, useEffect } from "react";

export default function TrailerPlayer({ movieId }: { movieId: number }) {
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasTrailer, setHasTrailer] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if trailer exists when component loads
  useEffect(() => {
    checkTrailer();
  }, [movieId]);

  const checkTrailer = async () => {
    try {
      const res = await fetch(`/api/videos?movieId=${movieId}`);
      const data = await res.json();
      
      const trailer = data.results?.find(
        (video: any) =>
          video.type === "Trailer" && video.site === "YouTube"
      );

      if (trailer) {
        setTrailerKey(trailer.key);
        setHasTrailer(true);
      } else {
        setHasTrailer(false);
        setError("No trailer available");
      }
    } catch (error) {
      console.error("Failed to check trailer:", error);
      setHasTrailer(false);
    }
  };

  const loadTrailer = async () => {
    if (trailerKey) {
      setShowTrailer(true);
    } else {
      setLoading(true);
      await checkTrailer();
      if (trailerKey) {
        setShowTrailer(true);
      }
      setLoading(false);
    }
  };

  return (
    <>
      {hasTrailer ? (
        <button
          onClick={loadTrailer}
          disabled={loading}
          className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Loading..." : "▶ Play Trailer"}
        </button>
      ) : (
        <div className="px-8 py-3 bg-gray-700 text-gray-400 font-semibold text-lg rounded-lg">
          ⓘ No Trailer Available
        </div>
      )}

      {showTrailer && trailerKey && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="relative w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-red-500"
            >
              ✕ Close
            </button>
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
