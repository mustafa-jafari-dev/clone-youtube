"use client"

import { useParams } from "next/navigation"
import { AlertCircle, Loader2 } from "lucide-react"

import { useVideo } from "@/features/watch/queries"
import { VideoPlayer } from "@/features/watch/components/video-player"
import { VideoMeta } from "@/features/watch/components/video-meta"
import { RecommendedVideos } from "@/features/watch/components/recommended-videos"
import { CommentList } from "@/features/comments/components/comment-list"
import { Separator } from "@/components/ui/separator"

export default function WatchPage() {
  const params = useParams<{ videoId: string }>()
  const { data: video, isLoading, error } = useVideo(params.videoId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
        <AlertCircle className="size-12" />
        <p className="text-lg font-medium">Video not found</p>
        <p className="text-sm">This video may not exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-[1800px] flex-col gap-4 p-4 lg:flex-row">
      <div className="min-w-0 flex-1 space-y-4">
        <VideoPlayer
          thumbnailUrl={video.thumbnailUrl}
          title={video.title}
          duration={video.duration}
        />
        <VideoMeta video={video} />
        <Separator />
        <CommentList videoId={video.id} />
      </div>
      <div className="w-full shrink-0 lg:w-[400px]">
        <RecommendedVideos currentVideoId={video.id} />
      </div>
    </div>
  )
}
