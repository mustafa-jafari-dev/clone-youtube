"use client"

import { useVideos, useVideosByCategory } from "@/features/home/queries"
import { useUiStore } from "@/stores/ui"
import { VideoCard } from "@/components/shared/video-card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Film } from "lucide-react"

function VideoCardSkeleton() {
  return (
    <div className="space-y-2">
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
  )
}

export function VideoGrid() {
  const activeCategory = useUiStore((s) => s.activeCategory)
  const isAll = activeCategory === "all"
  const allVideos = useVideos()
  const filteredVideos = useVideosByCategory(activeCategory)

  const { data: videos, isLoading, error } = isAll ? allVideos : filteredVideos

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
        <AlertCircle className="size-12" />
        <p className="text-lg font-medium">Something went wrong</p>
        <p className="text-sm">Failed to load videos. Please try again.</p>
      </div>
    )
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
        <Film className="size-12" />
        <p className="text-lg font-medium">No videos found</p>
        <p className="text-sm">Try a different category.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}
