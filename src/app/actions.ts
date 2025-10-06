'use server';

// --- TYPE DEFINITIONS ---
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

// --- SERVER ACTIONS ---

/**
 * Searches for movies by name using the TMDb API.
 * @param query The search query.
 * @returns A promise that resolves to an array of movies.
 */
export async function searchMoviesByName(query: string): Promise<Movie[]> {
  if (!query) return [];

  const apiKey = process.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=ja-JP&query=${encodeURIComponent(query)}`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Failed to fetch movie search results');
      return [];
    }
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error('Error in searchMoviesByName:', error);
    return [];
  }
}

/**
 * Gets a list of similar movies for a given movie ID.
 * @param movieId The ID of the movie to get recommendations for.
 * @returns A promise that resolves to an array of similar movies.
 */
export async function getSimilarMovies(movieId: number): Promise<Movie[]> {
  const apiKey = process.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apiKey}&language=ja-JP`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Failed to fetch similar movies');
      return [];
    }
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error('Error in getSimilarMovies:', error);
    return [];
  }
}
