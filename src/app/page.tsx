import { getPopularMovies } from "@/lib/tmdb";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const data = await getPopularMovies();
  const movies = data?.results || []; // memastikan tidak undefined

  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[50vh] md:h-[70vh] flex flex-col justify-center px-4 md:px-10 bg-cover bg-center bg-[url('/banner.jpg')]">
        {/* Overlay hitam gelap */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold max-w-xl mb-3 md:mb-5 drop-shadow-lg" style={{ fontFamily: 'Netflix Sans, Arial, Helvetica, sans-serif' }}>
            Mbah Mur Trailer
          </h2>
          <p className="text-base md:text-xl max-w-lg mb-4 md:mb-8 drop-shadow-lg">
            Jelajahi trailer film terbaru dan terlengkap, hanya di sini!
          </p>
          <button className="bg-red-600 px-4 md:px-6 py-2 md:py-3 text-base md:text-xl rounded hover:bg-red-700 w-fit">
            Lihat Trailer
          </button>
        </div>
      </section>

      {/* Movies Section */}
      <section className="px-4 md:px-10 mt-8 md:mt-14 pb-10">
        <h3 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-5">Popular Movies</h3>

        {movies.length === 0 ? (
          <p className="text-gray-400 text-base md:text-lg">Loading movies...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
            {movies.map((movie: any) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:scale-105 transition cursor-pointer"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-72 object-cover"
                />
                <div className="p-3">
                  <h2 className="text-sm font-semibold truncate">{movie.title}</h2>
                  <p className="text-yellow-400 text-xs mt-1">
                    ⭐ {movie.vote_average?.toFixed(1)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}
