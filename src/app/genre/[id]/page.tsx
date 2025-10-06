import Image from 'next/image';
import Link from 'next/link';
import PaginationControls from '@/components/PaginationControls';

// --- TYPE DEFINITIONS ---
interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface Genre {
  id: number;
  name: string;
}

// --- DATA FETCHING ---
async function getMoviesByGenre(genreId: string, page: number): Promise<{ movies: Movie[]; totalPages: number; }> {
  const apiKey = process.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=ja-JP&sort_by=popularity.desc&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch movies by genre');
  const data = await res.json();
  return { movies: data.results, totalPages: data.total_pages };
}

async function getGenres(): Promise<Genre[]> {
  const apiKey = process.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=ja-JP`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch genres');
  const data = await res.json();
  return data.genres || [];
}

// --- PAGE COMPONENT ---
export default async function GenrePage(props: any) {
  const { params, searchParams } = props;
  const genreId = params.id;
  const page = Number(searchParams?.page ?? '1');

  // Fetch movies and the genre list in parallel
  const [{ movies, totalPages }, allGenres] = await Promise.all([
    getMoviesByGenre(genreId, page),
    getGenres(),
  ]);

  // Find the current genre's name from the full list
  const genreName = allGenres.find(g => g.id.toString() === genreId)?.name || '';

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        ジャンル: {genreName}
      </h1>

      {movies.length === 0 && (
        <p>{genreName}に属する映画は見つかりませんでした。</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <Link href={`/movie/${movie.id}`} key={movie.id}>
            <div className="bg-primary rounded-lg shadow-lg overflow-hidden transition-transform duration-200 hover:scale-105 border border-transparent hover:border-accent">
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="w-full h-auto"
                />
              ) : (
                <div className="w-full h-[750px] bg-background flex items-center justify-center">
                  <span className="text-secondary">画像なし</span>
                </div>
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-foreground">{movie.title}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {movies.length > 0 && (
        <PaginationControls 
          basePath={`/genre/${genreId}`}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}