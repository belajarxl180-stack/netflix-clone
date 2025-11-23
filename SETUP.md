# Netflix Clone - Setup Guide

## Prerequisites
- Node.js 18+ installed
- TMDB API Key (from https://www.themoviedb.org/)

## Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment variables:**
   Create a `.env.local` file in the root directory with:
   ```
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_access_token_here
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_generated_secret_here
   ```

3. **Initialize database:**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to http://localhost:3000

## Features

### 1. **Movie Browsing**
   - Browse popular movies on the homepage
   - Click on any movie to view detailed information

### 2. **Search Functionality**
   - Search for movies by title
   - Real-time search results

### 3. **Genre Filter**
   - Browse movies by genre
   - Filter movies by category

### 4. **User Authentication**
   - Register new account
   - Login/Logout functionality
   - Session management with NextAuth.js

### 5. **Watchlist (Database-backed)**
   - Add movies to your personal watchlist
   - Remove movies from watchlist
   - Watchlist data stored in SQLite database
   - Protected route (requires authentication)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Authentication:** NextAuth.js
- **Database:** Prisma + SQLite
- **Styling:** Tailwind CSS
- **API:** TMDB (The Movie Database)

## Database Schema

- **User** - User accounts with email/password
- **Watchlist** - User's saved movies
- **Session** - User sessions
- **Account** - OAuth accounts (if needed)

## API Routes

- `GET /api/auth/[...nextauth]` - Authentication endpoints
- `POST /api/auth/register` - User registration
- `GET /api/search` - Movie search
- `GET /api/watchlist` - Fetch user's watchlist
- `POST /api/watchlist` - Add movie to watchlist
- `DELETE /api/watchlist` - Remove movie from watchlist

## Folder Structure

```
src/
├── app/
│   ├── api/          # API routes
│   ├── genres/       # Genre pages
│   ├── login/        # Login page
│   ├── movie/        # Movie detail page
│   ├── register/     # Register page
│   ├── search/       # Search page
│   └── watchlist/    # Watchlist page
├── components/       # Reusable components
├── lib/             # Utility functions
└── types/           # TypeScript types

prisma/
└── schema.prisma    # Database schema
```

## Notes

- SQLite database file is created at `prisma/dev.db`
- Database is excluded from git via .gitignore
- All sensitive data in .env.local is ignored by git
