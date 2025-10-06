import Image from 'next/image';
import Link from 'next/link';
import PaginationControls from '@/components/PaginationControls';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

async function searchMovies(query: string, page: number): Promise<{ movies: Movie[]; totalPages: number; }> {
  const apiKey = process.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=ja-JP&query=${encodeURIComponent(query)}&page=${page}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch search results');
  }
  const data = await res.json();
  return { movies: data.results, totalPages: data.total_pages };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = typeof searchParams?.query === 'string' ? searchParams.query : '';
  const page = Number(searchParams?.page ?? '1');
  
  let movies: Movie[] = [];
  let totalPages = 0;

  if (query) {
    const result = await searchMovies(query, page);
    movies = result.movies;
    totalPages = result.totalPages;
  }

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {query ? `検索結果: "${query}"` : '検索キーワードを入力してください'}
      </h1>

      {query && movies.length === 0 && (
        <p>検索結果が見つかりませんでした。</p>
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
          basePath='/search'
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
