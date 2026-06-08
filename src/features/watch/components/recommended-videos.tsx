"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Film } from "lucide-react"

import type { VideoWithChannel } from "@/services/api"
import { useRecommendedVideos } from "@/features/watch/queries"
import { formatViews } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

function RecommendedCard({ video }: { video: VideoWithChannel }) {
  return (
    <Link href={`/watch/${video.id}`} className="group flex gap-2">
      <div className="relative aspect-video h-[94px] w-[168px] shrink-0 overflow-hidden rounded-lg bg-muted">
        <img
          src={video.thumbnailUrl}
          alt=""
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute bottom-0.5 right-0.5 rounded bg-black/80 px-0.5 text-[10px] font-medium text-white">
          {video.duration}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <h4 className="line-clamp-2 text-sm font-medium leading-5">
          {video.title}
        </h4>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {video.channel.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatViews(video.views)} views &middot;{" "}
          {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
        </p>
      </div>
    </Link>
  )
}

function RecommendedCardSkeleton() {
  return (
    <div className="flex gap-2">
      <Skeleton className="aspect-video h-[94px] w-[168px] shrink-0 rounded-lg" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

interface RecommendedVideosProps {
  currentVideoId: string
}

export function RecommendedVideos({ currentVideoId }: RecommendedVideosProps) {
  const { data: videos, isLoading } = useRecommendedVideos(currentVideoId)

  return (
    <aside className="space-y-3">
      <h2 className="text-lg font-semibold">Recommended</h2>
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <RecommendedCardSkeleton key={i} />)
        ) : !videos || videos.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
            <Film className="size-8" />
            <p className="text-sm">No recommendations.</p>
          </div>
        ) : (
          videos.map((video) => <RecommendedCard key={video.id} video={video} />)
        )}
      </div>
    </aside>
  )
}
