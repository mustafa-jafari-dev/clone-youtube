"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AlertCircle, Search } from "lucide-react"

import { useSearchVideos } from "@/features/search/queries"
import { VideoCard } from "@/components/shared/video-card"
import { Skeleton } from "@/components/ui/skeleton"

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <div className="flex gap-3">
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") ?? ""

  const { data: videos, isLoading, error } = useSearchVideos(query)

  return (
    <>
      <h1 className="mb-4 text-lg font-semibold">
        Results for &ldquo;{query}&rdquo;
      </h1>

      {isLoading ? (
        <SearchSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
          <AlertCircle className="size-12" />
          <p className="text-lg font-medium">Search failed</p>
          <p className="text-sm">Please try again.</p>
        </div>
      ) : !videos || videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
          <Search className="size-12" />
          <p className="text-lg font-medium">No results found</p>
          <p className="text-sm">Try different keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </>
  )
}

export default function SearchPage() {
  return (
    <div className="p-4">
      <Suspense fallback={<SearchSkeleton />}>
        <SearchResults />
      </Suspense>
    </div>
  )
}
