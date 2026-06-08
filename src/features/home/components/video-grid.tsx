"use client"

import { Film } from "lucide-react"

import { useVideos, useVideosByCategory } from "@/features/home/queries"
import { useUiStore } from "@/stores/ui"
import { VideoCard } from "@/components/shared/video-card"
import { VideoGridLayout } from "@/components/shared/video-grid-layout"
import { VideoGridSkeleton } from "@/components/shared/video-card-skeleton"
import { ErrorState } from "@/components/shared/error-state"
import { EmptyState } from "@/components/shared/empty-state"

export function VideoGrid() {
  const activeCategory = useUiStore((s) => s.activeCategory)
  const isAll = activeCategory === "all"
  const allVideos = useVideos()
  const filteredVideos = useVideosByCategory(activeCategory)

  const { data: videos, isLoading, error } = isAll ? allVideos : filteredVideos

  if (isLoading) return <VideoGridSkeleton />
  if (error) return <ErrorState title="Failed to load videos" message="Please try again." />
  if (!videos || videos.length === 0)
    return <EmptyState icon={Film} title="No videos found" message="Try a different category." />

  return (
    <VideoGridLayout>
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </VideoGridLayout>
  )
}
