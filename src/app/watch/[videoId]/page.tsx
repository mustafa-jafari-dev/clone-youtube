"use client"

import { useParams } from "next/navigation"
import { lazy, Suspense } from "react"

import { useVideo } from "@/features/watch/queries"
import { VideoPlayer } from "@/features/watch/components/video-player"
import { VideoMeta } from "@/features/watch/components/video-meta"
import { ErrorState } from "@/components/shared/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

const RecommendedVideos = lazy(() =>
  import("@/features/watch/components/recommended-videos").then((m) => ({
    default: m.RecommendedVideos,
  })),
)

const CommentList = lazy(() =>
  import("@/features/comments/components/comment-list").then((m) => ({
    default: m.CommentList,
  })),
)

function WatchSkeleton() {
  return (
    <div className="mx-auto flex max-w-[1800px] flex-col gap-4 p-4 lg:flex-row">
      <div className="min-w-0 flex-1 space-y-4">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Separator />
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full shrink-0 lg:w-[400px]">
        <div className="space-y-3">
          <Skeleton className="h-5 w-24" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-2">
              <Skeleton className="aspect-video h-[94px] w-[168px] shrink-0 rounded-lg" />
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function WatchPage() {
  const params = useParams<{ videoId: string }>()
  const { data: video, isLoading, error } = useVideo(params.videoId)

  if (isLoading) return <WatchSkeleton />
  if (error || !video)
    return <ErrorState title="Video not found" message="This video may not exist or has been removed." />

  return (
    <div className="mx-auto flex max-w-[1800px] flex-col gap-4 p-4 lg:flex-row">
      <article className="min-w-0 flex-1 space-y-4">
        <VideoPlayer
          thumbnailUrl={video.thumbnailUrl}
          title={video.title}
          duration={video.duration}
        />
        <VideoMeta video={video} />
        <Separator />
        <Suspense fallback={<div className="py-8 text-center text-sm text-muted-foreground">Loading comments...</div>}>
          <CommentList videoId={video.id} />
        </Suspense>
      </article>
      <aside className="w-full shrink-0 lg:w-[400px]">
        <Suspense
          fallback={
            <div className="py-8 text-center text-sm text-muted-foreground">
              Loading recommendations...
            </div>
          }
        >
          <RecommendedVideos currentVideoId={video.id} />
        </Suspense>
      </aside>
    </div>
  )
}
