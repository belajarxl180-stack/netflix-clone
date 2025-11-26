'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface MobileMovieDetailProps {
  movie: any;
  trailer: any;
  cast: any[];
  similarMovies: any[];
}

export default function MobileMovieDetail({ movie, trailer, cast, similarMovies }: MobileMovieDetailProps) {
  const [activeTab, setActiveTab] = useState('detail');
  
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

  return (
    <div className="md:hidden bg-black text-white min-h-screen">
      {/* MOBILE HEADER */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="text-white hover:text-red-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-red-600">NETFLIX</h1>
      </header>

      {/* TOP SECTION - Poster + Info */}
      <section className="px-4 py-6 flex gap-4">
        {/* Poster Small */}
        <div className="flex-shrink-0">
          {movie.poster_path ? (
            <Image
              src={`${imageBaseUrl}${movie.poster_path}`}
              alt={movie.title}
              width={100}
              height={150}
              className="rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-[100px] h-[150px] bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-500">No Poster</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-2 leading-tight">{movie.title}</h2>
          <div className="flex items-center gap-2 mb-3 text-sm">
            <span className="text-yellow-400 font-bold">⭐ {movie.vote_average.toFixed(1)}</span>
            <span className="text-gray-400">•</span>
            <span>{movie.release_date?.split('-')[0]}</span>
            <span className="text-gray-400">•</span>
            <span>{movie.runtime}m</span>
          </div>
          
          {/* Genres */}
          <div className="flex flex-wrap gap-1 mb-3">
            {movie.genres?.slice(0, 2).map((genre: any) => (
              <span 
                key={genre.id}
                className="px-2 py-1 bg-red-600/80 rounded text-xs"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Watch Trailer Button */}
          {trailer && (
            <button
              onClick={() => setActiveTab('trailer')}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-sm transition-colors"
            >
              ▶ Watch Trailer
            </button>
          )}
        </div>
      </section>

      {/* TABS NAVIGATION */}
      <nav className="sticky top-[57px] z-40 bg-black border-b border-gray-800 px-4 flex gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('detail')}
          className={`px-4 py-3 font-semibold text-sm whitespace-nowrap transition-colors ${
            activeTab === 'detail' 
              ? 'text-red-600 border-b-2 border-red-600' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Detail
        </button>
        <button
          onClick={() => setActiveTab('cast')}
          className={`px-4 py-3 font-semibold text-sm whitespace-nowrap transition-colors ${
            activeTab === 'cast' 
              ? 'text-red-600 border-b-2 border-red-600' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Cast
        </button>
        <button
          onClick={() => setActiveTab('trailer')}
          className={`px-4 py-3 font-semibold text-sm whitespace-nowrap transition-colors ${
            activeTab === 'trailer' 
              ? 'text-red-600 border-b-2 border-red-600' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Trailer
        </button>
        <button
          onClick={() => setActiveTab('similar')}
          className={`px-4 py-3 font-semibold text-sm whitespace-nowrap transition-colors ${
            activeTab === 'similar' 
              ? 'text-red-600 border-b-2 border-red-600' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Similar
        </button>
      </nav>

      {/* TAB CONTENT */}
      <div className="px-4 py-6">
        
        {/* DETAIL TAB */}
        {activeTab === 'detail' && (
          <div>
            <h3 className="text-2xl font-bold mb-4">Synopsis</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              {movie.overview || "No overview available."}
            </p>

            <h4 className="text-xl font-bold mb-3">Film Information</h4>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Status</span>
                <span className="font-semibold">{movie.status}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Release Date</span>
                <span className="font-semibold">{movie.release_date}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Duration</span>
                <span className="font-semibold">{movie.runtime} minutes</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Language</span>
                <span className="font-semibold uppercase">{movie.original_language}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Budget</span>
                <span className="font-semibold">
                  {movie.budget ? `$${(movie.budget / 1000000).toFixed(0)}M` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-400">Revenue</span>
                <span className="font-semibold">
                  {movie.revenue ? `$${(movie.revenue / 1000000).toFixed(0)}M` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* CAST TAB */}
        {activeTab === 'cast' && (
          <div>
            <h3 className="text-2xl font-bold mb-4">Cast & Crew</h3>
            {cast && cast.length > 0 ? (
              <div className="space-y-4">
                {cast.slice(0, 10).map((person: any) => (
                  <div key={person.id} className="flex gap-4 items-start">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                      {person.profile_path ? (
                        <Image
                          src={`${imageBaseUrl}${person.profile_path}`}
                          alt={person.name}
                          width={60}
                          height={90}
                          className="rounded-lg"
                        />
                      ) : (
                        <div className="w-[60px] h-[90px] bg-gray-800 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{person.name}</h4>
                      <p className="text-sm text-gray-400">{person.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No cast information available</p>
            )}
          </div>
        )}

        {/* TRAILER TAB */}
        {activeTab === 'trailer' && (
          <div>
            <h3 className="text-2xl font-bold mb-4">Trailer</h3>
            {trailer ? (
              <div className="relative w-full rounded-lg overflow-hidden shadow-xl" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${trailer.key}?rel=0&modestbranding=1&showinfo=0`}
                  title="Movie Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <p className="text-gray-400">No trailer available</p>
            )}
          </div>
        )}

        {/* SIMILAR TAB */}
        {activeTab === 'similar' && (
          <div>
            <h3 className="text-2xl font-bold mb-4">Similar Movies</h3>
            {similarMovies && similarMovies.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {similarMovies.slice(0, 10).map((similarMovie: any) => (
                  <Link key={similarMovie.id} href={`/movie/${similarMovie.id}`} className="group">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 mb-2">
                      {similarMovie.poster_path ? (
                        <Image
                          src={`${imageBaseUrl}${similarMovie.poster_path}`}
                          alt={similarMovie.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-gray-600 text-xs text-center px-2">No Image</span>
                        </div>
                      )}
                      
                      {/* Rating Badge */}
                      {similarMovie.vote_average > 0 && (
                        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md">
                          <span className="text-yellow-400 text-xs font-bold">⭐ {similarMovie.vote_average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    
                    <h4 className="font-medium text-sm line-clamp-2 group-hover:text-red-500 transition-colors">
                      {similarMovie.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {similarMovie.release_date?.split('-')[0] || 'N/A'}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No similar movies found</p>
            )}
          </div>
        )}
      </div>

      {/* MOBILE FOOTER */}
      <footer className="bg-gray-900 border-t border-gray-800 py-6 mt-8">
        <div className="px-4 text-center text-sm text-gray-400">
          <p className="mb-2">
            <a href="#" className="hover:text-red-500">About</a>
            <span className="mx-2">•</span>
            <a href="#" className="hover:text-red-500">Contact</a>
            <span className="mx-2">•</span>
            <a href="#" className="hover:text-red-500">Privacy</a>
          </p>
          <p className="text-xs">&copy; 2025 Netflix Clone</p>
        </div>
      </footer>
    </div>
  );
}
