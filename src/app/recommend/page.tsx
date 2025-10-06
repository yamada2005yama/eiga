'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { searchMoviesByName } from '../actions';

// --- TYPE DEFINITIONS ---
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

interface Recommendation extends Movie {
  reason: string; // AI-generated reason
}

// This is a mock function to simulate an AI call.
const getAiRecommendations = async (query: string): Promise<{ title: string; reason: string; }[]> => {
  console.log(`Simulating AI call for query: ${query}`);
  if (query.includes('泣ける') || query.includes('感動')) {
    return [
      { title: "ショーシャンクの空に", reason: "理不尽な運命に屈しない人間の尊厳と、深い友情が胸を打ちます。" },
      { title: "グリーンマイル", reason: "奇跡がもたらす光と、避けられない悲劇のコントラストに涙が止まりません。" },
      { title: "最強のふたり", reason: "立場も性格も違う二人が築く、笑いと涙の友情物語です。" },
      { title: "フォレスト・ガンプ", reason: "純粋な心で時代を駆け抜ける主人公の姿に、生きる勇気をもらえます。" },
    ];
  }
  if (query.includes('スカッと') || query.includes('アクション')) {
    return [
      { title: "トップガン マーヴェリック", reason: "リアルな飛行シーンと、胸が熱くなる王道のストーリーで爽快感抜群です。" },
      { title: "マッドマックス 怒りのデス・ロード", reason: "全編クライマックスのような、狂気と暴力のカーアクションに圧倒されます。" },
      { title: "ジョン・ウィック", reason: "伝説の殺し屋による、スタイリッシュで切れ味鋭い復讐劇です。" },
    ];
  }
   if (query.includes('笑える') || query.includes('コメディ')) {
    return [
      { title: "ハングオーバー!", reason: "結婚式前夜に起きた、記憶喪失の男たちのハチャメチャな騒動を描きます。" },
      { title: "テッド", reason: "命が宿ったテディベアと中年男の、下品で最高な友情コメディです。" },
      { title: "ミセス・ダウト", reason: "離婚した父親が家政婦になりすまし、家族との絆を取り戻そうと奮闘します。" },
    ];
  }
  return [
    { title: "インセプション", reason: "入力された内容が複雑なため、夢と現実が交錯するこのSFアクションをおすすめします。" },
    { title: "君の名は。", reason: "時空を超えた壮大な物語は、あらゆる要望に応えるかもしれません。" },
  ];
};


// --- PAGE COMPONENT ---
export default function RecommendPage() {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setIsLoading(true);
    setSearched(true);
    setRecommendations([]);
    setError(null);

    try {
      // 1. Get movie ideas from the mock AI function
      const aiMovies = await getAiRecommendations(query);

      // 2. Fetch details for each movie from TMDb
      const detailedMovies = await Promise.all(
        aiMovies.map(async (aiMovie) => {
          const searchResults = await searchMoviesByName(aiMovie.title);
          if (searchResults && searchResults.length > 0) {
            return { ...searchResults[0], reason: aiMovie.reason };
          }
          return null;
        })
      );

      setRecommendations(detailedMovies.filter((movie): movie is Recommendation => movie !== null));

    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2 text-center">AI映画ソムリエ</h1>
      <p className="text-secondary text-center mb-8">今の気分や見たい映画の要望を、自由な言葉で入力してください。</p>
      
      <form onSubmit={handleSearch} className="w-full max-w-lg mx-auto mb-12">
        <div className="flex items-center border-b-2 border-accent py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-foreground mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="例: 感動して泣ける映画"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" disabled={isLoading} className="flex-shrink-0 bg-accent hover:opacity-80 text-sm text-white py-2 px-4 rounded disabled:opacity-50">
            {isLoading ? 'AIが考え中...' : '提案してもらう'}
          </button>
        </div>
      </form>

      {isLoading && <p className="text-center">AIがあなたのための映画を選んでいます...</p>}
      {error && <p className="text-center text-red-500">エラー: {error}</p>}

      {!isLoading && searched && recommendations.length === 0 && !error && (
        <p className="text-center">すみません、ご要望に合う映画を見つけられませんでした。別の言葉で試してみてください。</p>
      )}

      {!isLoading && recommendations.length > 0 && (
        <div>
            <h2 className="text-3xl font-bold mb-6">AIからのおすすめ:</h2>
            <div className="space-y-6">
              {recommendations.map(movie => (
                <div key={movie.id} className="bg-primary rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
                  <div className="md:w-1/5 flex-shrink-0">
                    <Link href={`/movie/${movie.id}`}>
                      <Image src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} width={500} height={750} className="w-full h-auto object-cover" />
                    </Link>
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{movie.title} <span className="text-lg text-secondary">({movie.release_date?.substring(0,4)})</span></h3>
                    <p className="text-accent font-semibold mb-4">AIのおすすめ理由:</p>
                    <p className="text-foreground leading-relaxed">{movie.reason}</p>
                  </div>
                </div>
              ))}
            </div>
        </div>
      )}
    </div>
  );
}