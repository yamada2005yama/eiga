'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="mb-6 px-4 py-2 bg-primary text-foreground font-semibold rounded-lg hover:bg-secondary transition-colors duration-200"
    >
      &larr; 戻る
    </button>
  );
}
