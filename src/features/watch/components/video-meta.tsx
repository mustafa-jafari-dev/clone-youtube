"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal } from "lucide-react"

import type { VideoWithChannel } from "@/services/api"
import { formatViews } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface VideoMetaProps {
  video: VideoWithChannel
}

export function VideoMeta({ video }: VideoMetaProps) {
  const [subscribed, setSubscribed] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  const isLong = video.description.length > 200

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold leading-tight">{video.title}</h1>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <Link href={`/channel/${video.channel.id}`}>
            <Avatar>
              <AvatarImage src={video.channel.avatarUrl} alt={video.channel.name} />
              <AvatarFallback>{video.channel.name[0]}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link
              href={`/channel/${video.channel.id}`}
              className="text-sm font-medium hover:underline"
            >
              {video.channel.name}
            </Link>
            <p className="text-xs text-muted-foreground">
              {formatViews(video.channel.subscribers)} subscribers
            </p>
          </div>
          <Button
            variant={subscribed ? "secondary" : "default"}
            size="sm"
            className="ml-2 rounded-full"
            onClick={() => setSubscribed(!subscribed)}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center overflow-hidden rounded-full border">
            <Button variant="ghost" size="sm" className="gap-1.5 rounded-none px-3">
              <ThumbsUp className="size-4" />
              <span className="text-xs">{formatViews(video.likes)}</span>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="icon-sm" className="rounded-none px-3">
              <ThumbsDown className="size-4" />
            </Button>
          </div>
          <Button variant="secondary" size="sm" className="gap-1.5 rounded-full">
            <Share2 className="size-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button variant="secondary" size="icon-sm" className="rounded-full">
            <Download className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-xl bg-muted p-3">
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            {formatViews(video.views)} views
          </span>
          <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
        </div>
        <div className={!showFullDescription && isLong ? "line-clamp-2" : ""}>
          <p className="mt-1 whitespace-pre-wrap text-sm">{video.description}</p>
        </div>
        {isLong && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="mt-1 text-xs font-medium hover:underline"
          >
            {showFullDescription ? "Show less" : "...more"}
          </button>
        )}
      </div>
    </div>
  )
}
