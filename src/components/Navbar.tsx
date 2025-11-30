import Link from "next/link";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-4 md:px-16 py-4 md:py-5 bg-black/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800/50">
      {/* Logo */}
      <Link href="/">
        <h1 className="text-2xl md:text-4xl font-black text-red-600 cursor-pointer tracking-tight" style={{ fontFamily: 'Netflix Sans, Arial, Helvetica, sans-serif' }}>
          Mbah Mur Trailer Film
        </h1>
      </Link>

      {/* Desktop Navigation */}
      <nav className="flex items-center gap-3 md:gap-8 text-sm md:text-base font-medium">
        <Link href="/" className="hover:text-red-500 transition-colors duration-200">
          Home
        </Link>
        <Link href="/genres" className="hover:text-red-500 transition-colors duration-200">
          Genres
        </Link>
        <Link href="/search" className="hover:text-red-500 transition-colors duration-200">
          Search
        </Link>
      </nav>
    </header>
  );
}
