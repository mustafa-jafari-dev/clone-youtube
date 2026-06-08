"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

import { useSearchVideos } from "@/features/search/queries"
import { VideoCard } from "@/components/shared/video-card"
import { VideoGridLayout } from "@/components/shared/video-grid-layout"
import { VideoGridSkeleton } from "@/components/shared/video-card-skeleton"
import { ErrorState } from "@/components/shared/error-state"
import { EmptyState } from "@/components/shared/empty-state"

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
        <VideoGridSkeleton />
      ) : error ? (
        <ErrorState title="Search failed" message="Please try again." />
      ) : !videos || videos.length === 0 ? (
        <EmptyState icon={Search} title="No results found" message="Try different keywords." />
      ) : (
        <VideoGridLayout>
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </VideoGridLayout>
      )}
    </>
  )
}

export default function SearchPage() {
  return (
    <div className="p-4">
      <Suspense fallback={<VideoGridSkeleton />}>
        <SearchResults />
      </Suspense>
    </div>
  )
}
