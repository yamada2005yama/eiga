export default function Loading() {
  const CardSkeleton = () => (
    <div className="bg-primary rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="w-full h-[450px] bg-secondary/50"></div>
      <div className="p-4">
        <div className="h-6 bg-secondary/50 rounded w-3/4"></div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-9 bg-secondary/50 rounded w-1/2 mb-8"></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
