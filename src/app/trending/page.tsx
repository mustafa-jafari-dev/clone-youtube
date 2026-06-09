"use client"

import { Flame } from "lucide-react"

import { useTrendingVideos } from "@/features/trending/queries"
import { VideoCard } from "@/components/shared/video-card"
import { VideoGridLayout } from "@/components/shared/video-grid-layout"
import { VideoGridSkeleton } from "@/components/shared/video-card-skeleton"
import { ErrorState } from "@/components/shared/error-state"
import { EmptyState } from "@/components/shared/empty-state"

export default function TrendingPage() {
  const { data: videos, isLoading, error } = useTrendingVideos()

  return (
    <section className="p-4">
      <h1 className="mb-4 text-lg font-semibold">Trending</h1>

      {isLoading ? (
        <VideoGridSkeleton />
      ) : error ? (
        <ErrorState title="Failed to load trending videos" message="Please try again." />
      ) : !videos || videos.length === 0 ? (
        <EmptyState icon={Flame} title="No trending videos" message="Check back later for trending content." />
      ) : (
        <VideoGridLayout>
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </VideoGridLayout>
      )}
    </section>
  )
}
