import { getMovieDetail, getMovieVideos } from "@/lib/tmdb";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import MobileMovieDetail from "@/components/MobileMovieDetail";

export default async function MovieDetail({ params }: { params: Promise<{ id: string }> }) {
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
    <>
      {/* MOBILE VERSION */}
      <MobileMovieDetail movie={movie} trailer={trailer} />

      {/* DESKTOP VERSION - CINEMATIC LAYOUT */}
      <main className="hidden md:block bg-black text-white min-h-screen">
        <Navbar />

        {/* Full-Width Hero Section with Backdrop (75vh) */}
        <section 
          className="relative h-[75vh] flex items-end"
          style={{
            backgroundImage: `url(${backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
          
          <div className="relative z-10 w-full px-12 pb-16">
            <h1 className="text-6xl font-bold mb-4">{movie.title}</h1>
            <div className="flex items-center gap-6 mb-4">
              <span className="text-green-400 font-semibold text-2xl">
                ⭐ {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-300 text-xl">{movie.release_date?.split('-')[0]}</span>
              <span className="text-gray-300 text-xl">{movie.runtime} min</span>
            </div>
            <div className="flex gap-3">
              {movie.genres?.slice(0, 3).map((genre: any) => (
                <span 
                  key={genre.id}
                  className="px-5 py-2 bg-red-600 rounded-full text-base font-medium"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Content Section: 2-Column Layout */}
        <div className="max-w-[1600px] mx-auto px-12 py-16">
          <div className="grid grid-cols-12 gap-12">
            {/* LEFT COLUMN: Synopsis & Details (8 columns) */}
            <div className="col-span-8 space-y-10">
              {/* Synopsis */}
              <div>
                <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-3">Synopsis</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {movie.overview || "No overview available."}
                </p>
              </div>

              {/* Movie Details Grid */}
              <div>
                <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-3">Details</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider">Status</h3>
                    <p className="text-white text-lg font-semibold">{movie.status}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider">Original Language</h3>
                    <p className="text-white text-lg font-semibold uppercase">{movie.original_language}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider">Budget</h3>
                    <p className="text-white text-lg font-semibold">
                      {movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider">Revenue</h3>
                    <p className="text-white text-lg font-semibold">
                      {movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider">Release Date</h3>
                    <p className="text-white text-lg font-semibold">{movie.release_date}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider">Popularity</h3>
                    <p className="text-white text-lg font-semibold">{movie.popularity.toFixed(0)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Poster & Rating (4 columns) */}
            <div className="col-span-4 space-y-8">
              {/* Poster */}
              <div className="sticky top-24">
                {movie.poster_path ? (
                  <Image
                    src={`${imageBaseUrl}${movie.poster_path}`}
                    alt={movie.title}
                    width={400}
                    height={600}
                    className="rounded-xl shadow-2xl w-full"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-gray-800 rounded-xl flex items-center justify-center">
                    <span className="text-gray-600 text-xl">No Image</span>
                  </div>
                )}
                
                {/* Rating Card */}
                <div className="mt-6 bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-xl text-center">
                  <div className="text-5xl font-bold mb-2">{movie.vote_average.toFixed(1)}</div>
                  <div className="text-sm text-red-100">
                    {movie.vote_count.toLocaleString()} votes
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Large Trailer Section (16:9) */}
          {trailer && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-3">Official Trailer</h2>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-xl"
                  src={`https://www.youtube.com/embed/${trailer.key}?rel=0`}
                  title={movie.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>

        {/* Professional Footer */}
        <footer className="bg-zinc-900 border-t border-gray-800 mt-20 py-12">
          <div className="max-w-[1600px] mx-auto px-12 grid grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-bold text-red-600 mb-4">NETFLIX CLONE</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your ultimate destination for discovering movies and TV shows. Browse, search, and explore thousands of titles.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Navigation</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/genres" className="hover:text-white transition-colors">Genres</a></li>
                <li><a href="/search" className="hover:text-white transition-colors">Search</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Categories</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>Action</li>
                <li>Drama</li>
                <li>Comedy</li>
                <li>Sci-Fi</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Information</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="max-w-[1600px] mx-auto px-12 mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm text-center">
              © 2024 Netflix Clone. All rights reserved. Movie data provided by TMDB.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
