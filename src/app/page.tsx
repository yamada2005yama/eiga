import Image from 'next/image';
import Link from 'next/link';

// --- TYPE DEFINITIONS ---
interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

// --- DATA FETCHING ---
async function getPopularMovies(): Promise<Movie[]> {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=ja-JP&page=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch popular movies');
  const data = await res.json();
  return data.results;
}

async function getMovieById(id: number): Promise<Movie> {
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=ja-JP`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch movie with id: ${id}`);
  return res.json();
}

// --- MOVIE LIST DEFINITIONS ---
const soloWatchIds = [335984, 278, 157336, 372058, 496243]; // Blade Runner 2049, Shawshank Redemption, Interstellar, Your Name, Parasite
const groupWatchIds = [361743, 105, 324857, 118340, 4935]; // Top Gun: Maverick, Back to the Future, Spider-Verse, Guardians of the Galaxy, Howl's Moving Castle

// --- MOVIE CAROUSEL COMPONENT ---
const MovieCarousel = ({ title, movies }: { title: string; movies: Movie[] }) => (
  <section className="mb-12">
    <h2 className="text-3xl font-bold mb-4 text-foreground">{title}</h2>
    <div className="flex overflow-x-auto gap-4 pb-4">
      {movies.map(movie => (
        <Link href={`/movie/${movie.id}`} key={movie.id} className="flex-shrink-0 w-48">
          <div className="bg-primary rounded-lg shadow-lg overflow-hidden transition-transform duration-200 hover:scale-105 border border-transparent hover:border-accent">
            {movie.poster_path ? (
              <Image src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} width={500} height={750} className="w-full h-auto" />
            ) : (
              <div className="w-full h-[270px] bg-background flex items-center justify-center"><span className="text-secondary">画像なし</span></div>
            )}
            <div className="p-2">
              <h3 className="text-sm font-semibold text-foreground truncate">{movie.title}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </section>
);

// --- HOME PAGE ---
export default async function Home() {
  const [popularMovies, soloWatchMovies, groupWatchMovies] = await Promise.all([
    getPopularMovies(),
    Promise.all(soloWatchIds.map(id => getMovieById(id))),
    Promise.all(groupWatchIds.map(id => getMovieById(id))),
  ]);

  return (
    <main className="container mx-auto px-4 py-8">
      <MovieCarousel title="人気の映画" movies={popularMovies} />
      <MovieCarousel title="一人でじっくり観たい夜に" movies={soloWatchMovies} />
      <MovieCarousel title="みんなでワイワイ楽しむ" movies={groupWatchMovies} />
    </main>
  );
}
