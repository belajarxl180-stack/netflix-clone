import Link from "next/link";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-4 md:px-10 py-4 md:py-6 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
      <Link href="/">
        <h1 className="text-2xl md:text-3xl font-bold text-red-600 cursor-pointer">
          NETFLIX
        </h1>
      </Link>

      <nav className="flex items-center gap-3 md:gap-6 text-sm md:text-lg">
        <Link href="/" className="hover:text-red-500">
          Home
        </Link>
        <Link href="/search" className="hover:text-red-500">
          Search
        </Link>
        <Link href="/genres" className="hover:text-red-500">
          Genres
        </Link>
      </nav>
    </header>
  );
}
