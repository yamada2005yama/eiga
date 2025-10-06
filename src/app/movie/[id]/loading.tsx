export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Main Details Skeleton */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/3">
          <div className="w-full h-[750px] bg-secondary/50 rounded-lg"></div>
        </div>
        <div className="md:w-2/3">
          <div className="h-10 bg-secondary/50 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-secondary/50 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-secondary/50 rounded w-1/3 mb-6"></div>
          
          <div className="h-8 bg-secondary/50 rounded w-1/4 mb-2"></div>
          <div className="space-y-3 mb-8">
            <div className="h-4 bg-secondary/50 rounded"></div>
            <div className="h-4 bg-secondary/50 rounded w-5/6"></div>
          </div>

          <div className="mb-8">
            <div className="h-8 bg-secondary/50 rounded w-1/3 mb-4"></div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-secondary/50 rounded-lg"></div>
              <div className="w-12 h-12 bg-secondary/50 rounded-lg"></div>
            </div>
          </div>

          <div className="mt-8">
            <div className="h-8 bg-secondary/50 rounded w-1/3 mb-4"></div>
            <div className="flex overflow-x-auto gap-4 pb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-primary rounded-lg text-center w-36 flex-shrink-0 p-2">
                  <div className="w-24 h-24 mx-auto rounded-full bg-secondary/50 mb-2"></div>
                  <div className="h-4 bg-secondary/50 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies Skeleton */}
      <div className="mt-8">
        <div className="h-9 bg-secondary/50 rounded w-1/2 mb-4"></div>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48">
              <div className="w-full h-[270px] bg-secondary/50 rounded-lg"></div>
              <div className="mt-2 h-4 bg-secondary/50 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
