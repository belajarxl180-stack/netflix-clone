import { getMovieDetail, getTrailerVideoId, getMovieCredits, getSimilarMovies } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import MobileMovieDetail from "@/components/MobileMovieDetail";

// Force dynamic rendering to always fetch fresh trailer data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MovieDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await getMovieDetail(id);

  if (!movie) {
    notFound();
  }

  // Get trailer with fallback to YouTube
  const releaseYear = movie.release_date?.split('-')[0];
  const trailerVideoId = await getTrailerVideoId(id, movie.title, releaseYear);
  const trailer = trailerVideoId ? { key: trailerVideoId } : null;

  // Get cast & crew
  const credits = await getMovieCredits(id);
  
  // Get similar movies
  const similarMovies = await getSimilarMovies(id);

  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "/banner.jpg";

  return (
    <>
      {/* MOBILE VERSION */}
      <MobileMovieDetail movie={movie} trailer={trailer} cast={credits.cast} similarMovies={similarMovies.results} />

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
                  src={`https://www.youtube.com/embed/${trailer.key}?rel=0&modestbranding=1&showinfo=0`}
                  title={movie.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Cast & Crew Section */}
          {credits.cast && credits.cast.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-3">Cast & Crew</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {credits.cast.slice(0, 10).map((person: any) => (
                  <div key={person.id} className="group">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 mb-3">
                      {person.profile_path ? (
                        <Image
                          src={`${imageBaseUrl}${person.profile_path}`}
                          alt={person.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold text-white group-hover:text-red-500 transition-colors">
                      {person.name}
                    </h4>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{person.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar Movies Section */}
          {similarMovies.results && similarMovies.results.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-3">Similar Movies</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {similarMovies.results.slice(0, 10).map((similarMovie: any) => (
                  <Link key={similarMovie.id} href={`/movie/${similarMovie.id}`} className="group">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 mb-3">
                      {similarMovie.poster_path ? (
                        <Image
                          src={`${imageBaseUrl}${similarMovie.poster_path}`}
                          alt={similarMovie.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-gray-600 text-sm text-center px-4">No Image</span>
                        </div>
                      )}
                      
                      {/* Rating Badge */}
                      {similarMovie.vote_average > 0 && (
                        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md">
                          <span className="text-yellow-400 text-xs font-bold">⭐ {similarMovie.vote_average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    
                    <h4 className="font-semibold text-white group-hover:text-red-500 transition-colors line-clamp-2">
                      {similarMovie.title}
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">
                      {similarMovie.release_date?.split('-')[0] || 'N/A'}
                    </p>
                  </Link>
                ))}
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
