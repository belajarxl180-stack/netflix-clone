import { getMovieDetail, getMovieVideos } from "@/lib/tmdb";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function MovieDetailDesktop({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await getMovieDetail(id);
  const videosData = await getMovieVideos(id);

  if (!movie) {
    notFound();
  }

  const trailer = videosData?.results?.find(
    (video: any) => video.type === "Trailer" && video.site === "YouTube"
  );

  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "/banner.jpg";

  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />

      {/* HERO SECTION - Full Width Backdrop */}
      <section 
        className="relative h-[70vh] flex items-end"
        style={{
          backgroundImage: `url(${backdropUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay 40-50% */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-16 pb-12 w-full">
          <h1 className="text-6xl md:text-7xl font-black mb-4 drop-shadow-2xl">
            {movie.title}
          </h1>
          
          <div className="flex items-center gap-6 mb-6 text-lg">
            <span className="text-yellow-400 font-bold text-2xl">
              ⭐ {movie.vote_average.toFixed(1)}
            </span>
            <span className="font-semibold">{movie.release_date?.split('-')[0]}</span>
            <span>{movie.runtime} min</span>
            <div className="flex gap-2">
              {movie.genres?.slice(0, 3).map((genre: any) => (
                <span 
                  key={genre.id}
                  className="px-3 py-1 bg-red-600/80 rounded text-sm font-medium"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-lg transition-all transform hover:scale-105">
              ▶ Watch Trailer
            </button>
            <button className="px-8 py-3 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg font-bold text-lg transition-all">
              + Add to Favorite
            </button>
            <button className="px-8 py-3 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg font-bold text-lg transition-all">
              🔗 Share
            </button>
          </div>
        </div>
      </section>

      {/* TRAILER SECTION - Large Iframe */}
      {trailer && (
        <section className="max-w-7xl mx-auto px-16 py-12">
          <h2 className="text-3xl font-bold mb-6">Official Trailer</h2>
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-xl"
              src={`https://www.youtube.com/embed/${trailer.key}?rel=0`}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      )}

      {/* MOVIE INFO - 2 Column Layout */}
      <section className="max-w-7xl mx-auto px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* LEFT COLUMN - Synopsis & Details */}
          <div className="md:col-span-2">
            <h2 className="text-4xl font-bold mb-6">Synopsis</h2>
            <p className="text-gray-300 text-xl leading-relaxed mb-12">
              {movie.overview || "No overview available."}
            </p>

            <h3 className="text-3xl font-bold mb-6">Details</h3>
            <div className="grid grid-cols-2 gap-6 text-lg">
              <div>
                <p className="text-gray-400 mb-2">Director</p>
                <p className="font-semibold">N/A</p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Duration</p>
                <p className="font-semibold">{movie.runtime} minutes</p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Release Date</p>
                <p className="font-semibold">{movie.release_date}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Country</p>
                <p className="font-semibold">{movie.production_countries?.[0]?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Studio</p>
                <p className="font-semibold">{movie.production_companies?.[0]?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Language</p>
                <p className="font-semibold uppercase">{movie.original_language}</p>
              </div>
            </div>

            <div className="mt-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-900 p-6 rounded-xl">
                  <p className="text-gray-400 mb-2">Budget</p>
                  <p className="text-2xl font-bold text-green-400">
                    {movie.budget ? `$${(movie.budget / 1000000).toFixed(0)}M` : 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-900 p-6 rounded-xl">
                  <p className="text-gray-400 mb-2">Revenue</p>
                  <p className="text-2xl font-bold text-green-400">
                    {movie.revenue ? `$${(movie.revenue / 1000000).toFixed(0)}M` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Poster & Rating */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              {/* Poster */}
              {movie.poster_path ? (
                <Image
                  src={`${imageBaseUrl}${movie.poster_path}`}
                  alt={movie.title}
                  width={400}
                  height={600}
                  className="rounded-2xl shadow-2xl w-full mb-6"
                />
              ) : (
                <div className="w-full h-[600px] bg-gray-800 rounded-2xl flex items-center justify-center mb-6">
                  No Poster
                </div>
              )}

              {/* Rating Card */}
              <div className="bg-gradient-to-br from-yellow-600 to-orange-600 p-6 rounded-xl text-center mb-6">
                <p className="text-sm font-medium mb-2">TMDB Rating</p>
                <p className="text-5xl font-black">{movie.vote_average.toFixed(1)}</p>
                <p className="text-sm mt-2">{movie.vote_count.toLocaleString()} votes</p>
              </div>

              {/* Status Badge */}
              <div className="bg-gray-900 p-4 rounded-xl text-center">
                <p className="text-gray-400 text-sm mb-1">Status</p>
                <p className="text-xl font-bold text-green-400">{movie.status}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-16 text-center text-gray-400">
          <p>&copy; 2025 NeO Film. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
