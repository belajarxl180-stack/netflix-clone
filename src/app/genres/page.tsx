import { getGenres } from "@/lib/tmdb";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function GenresPage() {
  const data = await getGenres();
  const genres = data?.genres || [];

  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />

      <div className="px-4 md:px-10 py-6 md:py-10">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">Browse by Genre</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {genres.map((genre: any) => (
            <Link
              key={genre.id}
              href={`/genres/${genre.id}`}
              className="bg-gradient-to-br from-red-600 to-red-800 p-4 md:p-8 rounded-lg hover:scale-105 transition cursor-pointer shadow-lg"
            >
              <h2 className="text-lg md:text-2xl font-bold text-center">{genre.name}</h2>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
