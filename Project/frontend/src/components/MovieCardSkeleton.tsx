export default function MovieCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="flex gap-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-14" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-12" />
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  );
}
