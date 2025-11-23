import { getMoviesByGenre, getGenres } from "@/lib/tmdb";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function GenreMoviesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [moviesData, genresData] = await Promise.all([
    getMoviesByGenre(id),
    getGenres(),
  ]);

  const movies = moviesData?.results || [];
  const genres = genresData?.genres || [];
  const currentGenre = genres.find((g: any) => g.id === parseInt(id));

  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />

      <div className="px-10 py-10">
        <div className="mb-8">
          <Link href="/genres" className="text-gray-400 hover:text-white mb-4 inline-block">
            ← Back to Genres
          </Link>
          <h1 className="text-4xl font-bold">
            {currentGenre?.name || "Genre"} Movies
          </h1>
        </div>

        {movies.length > 0 ? (
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
        ) : (
          <p className="text-center text-gray-400 text-xl">No movies found in this genre.</p>
        )}
      </div>
    </main>
  );
}
