const CarouselSkeleton = () => (
  <section className="mb-12">
    {/* Title Skeleton */}
    <div className="h-9 bg-secondary/50 rounded w-1/3 mb-4"></div>
    <div className="flex overflow-x-auto gap-4 pb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-48">
          {/* Card Skeleton */}
          <div className="w-full h-[270px] bg-secondary/50 rounded-lg"></div>
          <div className="mt-2 h-4 bg-secondary/50 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  </section>
);

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <CarouselSkeleton />
      <CarouselSkeleton />
      <CarouselSkeleton />
    </div>
  );
}