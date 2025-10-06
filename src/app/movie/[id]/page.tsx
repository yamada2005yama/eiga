import Image from 'next/image';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

// --- TYPE DEFINITIONS ---
interface MovieDetails { title: string; overview: string; poster_path: string; release_date: string; vote_average: number; genres: { id: number; name: string }[]; runtime: number; }
interface CastMember { name: string; character: string; profile_path: string | null; }
interface Credits { cast: CastMember[]; }
interface WatchProvider { provider_id: number; provider_name: string; logo_path: string; }
interface WatchProviderCountryResults { link: string; flatrate?: WatchProvider[]; }
interface WatchProviderResults { results: { [countryCode: string]: WatchProviderCountryResults }; }
interface SimilarMovie { id: number; title: string; poster_path: string; }
interface SimilarMoviesResults { results: SimilarMovie[]; }

// --- DATA FETCHING FUNCTIONS ---
async function getMovieDetails(id: string): Promise<MovieDetails> {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=ja-JP`);
  if (!res.ok) throw new Error('Failed to fetch movie details');
  return res.json();
}

async function getMovieCredits(id: string): Promise<Credits> {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.TMDB_API_KEY}&language=ja-JP`);
  if (!res.ok) throw new Error('Failed to fetch movie credits');
  return res.json();
}

async function getWatchProviders(id: string): Promise<WatchProviderResults> {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${process.env.TMDB_API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch watch providers');
  return res.json();
}

async function getSimilarMovies(id: string): Promise<SimilarMoviesResults> {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${process.env.TMDB_API_KEY}&language=ja-JP`);
  if (!res.ok) throw new Error('Failed to fetch similar movies');
  return res.json();
}

// --- PAGE COMPONENT ---
export default async function MovieDetailPage({ params }: { params: { id: string } }) {
  const [movie, credits, providers, similar] = await Promise.all([
    getMovieDetails(params.id),
    getMovieCredits(params.id),
    getWatchProviders(params.id),
    getSimilarMovies(params.id),
  ]);

  const streamingServices = providers.results.JP?.flatrate || [];

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}時間${mins}分`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Left Column: Poster */}
        <div className="md:w-1/3">
          {movie.poster_path ? (
            <Image src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} width={500} height={750} className="rounded-lg w-full shadow-lg" />
          ) : (
            <div className="w-full h-[750px] bg-background flex items-center justify-center rounded-lg border border-primary"><span className="text-secondary">画像なし</span></div>
          )}
        </div>

        {/* Right Column: Details */}
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-2 text-foreground">{movie.title}</h1>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mb-4 text-secondary">
            <span>{movie.release_date}</span>
            <span>|</span>
            <span>{movie.genres.map(g => g.name).join(', ')}</span>
            <span>|</span>
            <span>{formatRuntime(movie.runtime)}</span>
          </div>
          <div className="flex items-center mb-4">
            <span className="text-accent text-2xl">★</span>
            <span className="text-2xl font-bold ml-2 text-foreground">{movie.vote_average.toFixed(1)}</span>
            <span className="text-secondary ml-1">/ 10</span>
          </div>

          <h2 className="text-2xl font-semibold mb-2 text-foreground">あらすじ</h2>
          <p className="text-foreground leading-relaxed mb-8">{movie.overview || 'あらすじ情報がありません。'}</p>

          <h2 className="text-2xl font-semibold mb-4 text-foreground">配信中のサービス</h2>
          {streamingServices.length > 0 ? (
            <div className="flex flex-wrap gap-4 mb-8">
              {streamingServices.map(service => (
                <a key={service.provider_id} href={providers.results.JP.link} target="_blank" rel="noopener noreferrer" className="transition-transform duration-200 hover:scale-110">
                  <Image src={`https://image.tmdb.org/t/p/original${service.logo_path}`} alt={service.provider_name} width={50} height={50} className="rounded-lg" />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-secondary mb-8">現在、配信中のサブスクリプションサービスはありません。</p>
          )}

          <h2 className="text-2xl font-semibold mb-4 text-foreground">主な出演者</h2>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {credits.cast.slice(0, 15).map((member, index) => (
              <div key={index} className="bg-primary rounded-lg text-center w-36 flex-shrink-0 p-2">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-2 border-2 border-secondary">
                  {member.profile_path ? (
                    <Image src={`https://image.tmdb.org/t/p/w185${member.profile_path}`} alt={member.name} width={96} height={96} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full bg-background flex items-center justify-center"><span className="text-xs text-secondary">写真なし</span></div>
                  )}
                </div>
                <p className="font-bold text-sm text-foreground">{member.name}</p>
                <p className="text-xs text-secondary">({member.character})</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Similar Movies Section */}
      <div>
        <h2 className="text-3xl font-bold mb-4 text-foreground">この作品が好きなあなたへのおすすめ</h2>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {similar.results.map(movie => (
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
      </div>
    </div>
  );
}
