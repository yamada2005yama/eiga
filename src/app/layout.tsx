import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Search from "@/components/Search";
import Link from "next/link";
import GenreNav from "@/components/GenreNav";

// Define types
interface Genre {
  id: number;
  name: string;
}

// Fetch genres on the server
async function getGenres(): Promise<Genre[]> {
  const apiKey = process.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=ja-JP`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error('Failed to fetch genres in layout');
    return [];
  }
  const data = await res.json();
  return data.genres || [];
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie Info Site",
  description: "映画情報を検索するためのサイトです。",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const genres = await getGenres();

  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="flex flex-col min-h-screen">
          <header className="bg-primary shadow-md sticky top-0 z-20">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <div className="flex items-center gap-8">
                <Link href="/" className="text-2xl font-bold text-accent">
                  MovieHub
                </Link>
                <nav className="flex items-center gap-6">
                  <GenreNav genres={genres} />
                  <Link href="/recommend" className="text-foreground hover:text-accent transition-colors duration-200 font-semibold">
                    おすすめを探す
                  </Link>
                </nav>
              </div>
              <div className="w-1/2 max-w-md">
                <Search />
              </div>
            </div>
          </header>

          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>

          <footer className="bg-primary mt-auto py-4">
            <div className="container mx-auto px-4 text-center text-secondary">
              &copy; {new Date().getFullYear()} MovieHub. All Rights Reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
