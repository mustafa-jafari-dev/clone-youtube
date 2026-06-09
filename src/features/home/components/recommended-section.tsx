"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Sparkles } from "lucide-react"

import { useRecommended } from "@/features/home/hooks/use-recommended"
import { formatViews } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

function RecommendedCard({ video }: { video: { id: string; title: string; thumbnailUrl: string; duration: string; views: number; createdAt: string; channel: { name: string; avatarUrl: string } } }) {
  return (
    <Link href={`/watch/${video.id}`} className="group w-[200px] shrink-0 snap-start sm:w-[220px]">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium text-white">
          {video.duration}
        </span>
      </div>
      <div className="mt-2 flex gap-2">
        <img
          src={video.channel.avatarUrl}
          alt=""
          className="mt-0.5 size-8 shrink-0 rounded-full bg-muted"
          loading="lazy"
        />
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-medium leading-5">{video.title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{video.channel.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatViews(video.views)} views &middot;{" "}
            {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
    </Link>
  )
}

function RecommendedCardSkeleton() {
  return (
    <div className="w-[200px] shrink-0 sm:w-[220px]">
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="mt-2 flex gap-2">
        <Skeleton className="size-8 shrink-0 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  )
}

export function RecommendedSection() {
  const { videos, isLoading, isEnabled } = useRecommended()

  if (!isEnabled) return null

  if (isLoading) {
    return (
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-blue-500" />
          <h2 className="text-lg font-semibold">Recommended for you</h2>
        </div>
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <RecommendedCardSkeleton key={i} />
          ))}
        </div>
      </section>
    )
  }

  if (videos.length === 0) return null

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="size-5 text-blue-500" />
        <h2 className="text-lg font-semibold">Recommended for you</h2>
      </div>
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-2">
          {videos.map((video) => (
            <RecommendedCard key={video.id} video={video} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  )
}
