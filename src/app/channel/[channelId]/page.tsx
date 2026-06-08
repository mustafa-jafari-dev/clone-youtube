"use client"

import { useParams } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { AlertCircle, Loader2 } from "lucide-react"

import { useChannel, useChannelVideos } from "@/features/channel/queries"
import { formatViews } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { VideoCard } from "@/components/shared/video-card"

export default function ChannelPage() {
  const params = useParams<{ channelId: string }>()
  const { data: channel, isLoading: loadingChannel, error: channelError } = useChannel(params.channelId)
  const { data: videos, isLoading: loadingVideos } = useChannelVideos(params.channelId)

  if (loadingChannel) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (channelError || !channel) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
        <AlertCircle className="size-12" />
        <p className="text-lg font-medium">Channel not found</p>
      </div>
    )
  }

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

      <div className="border-t px-4 py-4 sm:px-6">
        <h2 className="mb-4 text-lg font-semibold">Videos</h2>
        {loadingVideos ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : !videos || videos.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No videos yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
