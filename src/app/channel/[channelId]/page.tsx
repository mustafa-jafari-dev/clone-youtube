"use client"

import { useParams } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

import { useChannel, useChannelVideos } from "@/features/channel/queries"
import { formatViews } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { VideoCard } from "@/components/shared/video-card"
import { VideoGridLayout } from "@/components/shared/video-grid-layout"
import { VideoGridSkeleton } from "@/components/shared/video-card-skeleton"
import { ErrorState } from "@/components/shared/error-state"
import { EmptyState } from "@/components/shared/empty-state"
import { Film } from "lucide-react"

function ChannelSkeleton() {
  return (
    <div>
      <Skeleton className="h-48 w-full sm:h-64" />
      <div className="flex flex-col gap-4 px-4 pb-6 sm:flex-row sm:items-start sm:gap-6 sm:px-6">
        <Skeleton className="-mt-10 size-24 rounded-full border-4 border-background sm:-mt-14 sm:size-32" />
        <div className="mt-4 flex-1 space-y-3 sm:mt-10">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
    </div>
  )
}

export default function ChannelPage() {
  const params = useParams<{ channelId: string }>()
  const { data: channel, isLoading: loadingChannel, error: channelError } = useChannel(params.channelId)
  const { data: videos, isLoading: loadingVideos } = useChannelVideos(params.channelId)

  if (loadingChannel) return <ChannelSkeleton />
  if (channelError || !channel) return <ErrorState title="Channel not found" />

  return (
    <div>
      <div className="h-48 bg-muted sm:h-64">
        {channel.bannerUrl && (
          <img
            src={channel.bannerUrl}
            alt={`${channel.name} banner`}
            className="size-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-col gap-4 px-4 pb-6 sm:flex-row sm:items-start sm:gap-6 sm:px-6">
        <Avatar className="-mt-10 size-24 border-4 border-background sm:-mt-14 sm:size-32">
          <AvatarImage src={channel.avatarUrl} alt={channel.name} />
          <AvatarFallback className="text-4xl">{channel.name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex flex-1 flex-col gap-2 sm:pt-2">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            <div>
              <h1 className="text-xl font-bold sm:text-2xl">{channel.name}</h1>
              <p className="text-sm text-muted-foreground">
                {channel.handle} &middot; {formatViews(channel.subscribers)} subscribers &middot;{" "}
                {channel.videoCount} videos
              </p>
            </div>
            <Button className="mt-2 self-start rounded-full sm:ml-auto sm:mt-0">
              Subscribe
            </Button>
          </div>
          <p className="line-clamp-3 max-w-2xl text-sm text-muted-foreground">
            {channel.description}
          </p>
          <p className="text-xs text-muted-foreground">
            Joined {formatDistanceToNow(new Date(channel.joinedAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      <section className="border-t px-4 py-4 sm:px-6" aria-label="Videos">
        <h2 className="mb-4 text-lg font-semibold">Videos</h2>
        {loadingVideos ? (
          <VideoGridSkeleton count={4} />
        ) : !videos || videos.length === 0 ? (
          <EmptyState icon={Film} title="No videos yet" />
        ) : (
          <VideoGridLayout>
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </VideoGridLayout>
        )}
      </section>
    </div>
  )
}
