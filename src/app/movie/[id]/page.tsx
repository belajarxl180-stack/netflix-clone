import { getMovieDetail } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import TrailerPlayer from "@/components/TrailerPlayer";

export default async function MovieDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await getMovieDetail(id);

  if (!movie) {
    notFound();
  }

  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "/banner.jpg";

  return (
    <main className="bg-black text-white min-h-screen">
      {/* Navbar */}
      <header className="flex items-center justify-between px-4 md:px-10 py-4 md:py-6 bg-black/80 backdrop-blur-sm fixed w-full z-50">
        <Link href="/">
          <h1 className="text-2xl md:text-3xl font-bold text-red-600 cursor-pointer">NETFLIX</h1>
        </Link>
        <nav className="flex gap-3 md:gap-6 text-sm md:text-lg">
          <Link href="/" className="hover:text-red-500">Home</Link>
          <Link href="/search" className="hover:text-red-500">Search</Link>
          <Link href="/genres" className="hover:text-red-500">Genres</Link>
        </nav>
      </header>

      {/* Hero Section with Backdrop */}
      <section 
        className="relative h-[40vh] md:h-[60vh] flex items-end pt-16 md:pt-20"
        style={{
          backgroundImage: `url(${backdropUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      </section>

      {/* Movie Details */}
      <div className="relative -mt-20 md:-mt-32 z-10 px-4 md:px-10 pb-10 md:pb-20">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Poster */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            {movie.poster_path ? (
              <Image
                src={`${imageBaseUrl}${movie.poster_path}`}
                alt={movie.title}
                width={200}
                height={300}
                className="rounded-lg shadow-2xl md:w-[300px] md:h-[450px]"
              />
            ) : (
              <div className="w-[200px] h-[300px] md:w-[300px] md:h-[450px] bg-gray-800 rounded-lg flex items-center justify-center">
                No Image
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 w-full">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">{movie.title}</h1>
            
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 flex-wrap">
              <span className="text-green-500 font-semibold text-lg md:text-xl">
                ⭐ {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-400 text-sm md:text-base">{movie.release_date?.split('-')[0]}</span>
              <span className="text-gray-400 text-sm md:text-base">{movie.runtime} min</span>
            </div>

            {/* Genres */}
            <div className="flex gap-2 mb-4 md:mb-6 flex-wrap">
              {movie.genres?.map((genre: any) => (
                <span 
                  key={genre.id}
                  className="px-3 md:px-4 py-1 bg-red-600 rounded-full text-xs md:text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 md:gap-4 mb-4 md:mb-6">
              <TrailerPlayer movieId={movie.id} />
            </div>

            {/* Overview */}
            <div className="mt-4 md:mt-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-2 md:mb-3">Overview</h2>
              <p className="text-gray-300 text-sm md:text-lg leading-relaxed">
                {movie.overview || "No overview available."}
              </p>
            </div>

            {/* Additional Info */}
            <div className="mt-6 md:mt-8 grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <h3 className="text-gray-400 text-xs md:text-sm mb-1">Status</h3>
                <p className="font-semibold text-sm md:text-base">{movie.status}</p>
              </div>
              <div>
                <h3 className="text-gray-400 text-xs md:text-sm mb-1">Language</h3>
                <p className="font-semibold text-sm md:text-base uppercase">{movie.original_language}</p>
              </div>
              <div>
                <h3 className="text-gray-400 text-xs md:text-sm mb-1">Budget</h3>
                <p className="font-semibold text-sm md:text-base">
                  {movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}
                </p>
              </div>
              <div>
                <h3 className="text-gray-400 text-xs md:text-sm mb-1">Revenue</h3>
                <p className="font-semibold text-sm md:text-base">
                  {movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
