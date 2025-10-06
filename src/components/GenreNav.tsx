'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Genre {
  id: number;
  name: string;
}

interface GenreNavProps {
  genres: Genre[];
}

export default function GenreNav({ genres }: GenreNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-foreground hover:text-accent transition-colors duration-200 font-semibold"
      >
        ジャンルから探す
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-primary ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1 grid grid-cols-2 gap-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {genres.map(genre => (
              <Link 
                key={genre.id} 
                href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
                className="block px-4 py-2 text-sm text-foreground hover:bg-background hover:text-accent"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
