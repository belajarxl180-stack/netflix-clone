'use client';

interface ShareButtonProps {
  movieId: number;
  movieTitle: string;
}

export default function ShareButton({ movieId, movieTitle }: ShareButtonProps) {
  const handleShare = () => {
    const url = `https://netflix-clone-khaki-two-35.vercel.app/movie/${movieId}`;
    
    if (navigator.share) {
      navigator.share({
        title: movieTitle,
        text: `Watch ${movieTitle} trailer`,
        url: url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      <span className="text-sm font-medium">Share</span>
    </button>
  );
}
