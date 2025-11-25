'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface MobileMovieDetailProps {
  movie: any;
  trailer: any;
}

export default function MobileMovieDetail({ movie, trailer }: MobileMovieDetailProps) {
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
            <p className="text-gray-400 text-sm mb-4">Coming soon - Cast information will be available here</p>
            {/* Horizontal scroll cast list - to be implemented with TMDB credits API */}
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
                  src={`https://www.youtube.com/embed/${trailer.key}?rel=0`}
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
            <p className="text-gray-400 text-sm mb-4">Coming soon - Similar movie recommendations will appear here</p>
            {/* Horizontal scroll similar movies - to be implemented */}
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
