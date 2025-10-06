'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface PaginationControlsProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
  basePath: string;
}

export default function PaginationControls({ 
  hasNextPage, 
  hasPrevPage, 
  totalPages,
  basePath
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ?? '1';
  const per_page = searchParams.get('per_page') ?? '20'; // Not used in API call, just for URL

  const getPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${basePath}?${params.toString()}`;
  }

  return (
    <div className="flex gap-4 items-center justify-center mt-8">
      <Link
        href={getPageUrl(Number(page) - 1)}
        className={`px-4 py-2 bg-primary text-foreground font-semibold rounded-lg transition-colors duration-200 ${!hasPrevPage ? 'pointer-events-none opacity-50' : 'hover:bg-secondary'}`}
      >
        &larr; 前へ
      </Link>

      <div className="text-secondary">
        {page} / {totalPages}
      </div>

      <Link
        href={getPageUrl(Number(page) + 1)}
        className={`px-4 py-2 bg-primary text-foreground font-semibold rounded-lg transition-colors duration-200 ${!hasNextPage ? 'pointer-events-none opacity-50' : 'hover:bg-secondary'}`}
      >
        次へ &rarr;
      </Link>
    </div>
  )
}
