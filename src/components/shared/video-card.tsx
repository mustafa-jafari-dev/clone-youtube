import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { VideoWithChannel } from "@/services/api"
import { formatDistanceToNow } from "date-fns"
import { formatViews } from "@/lib/utils"
import Link from "next/link"

interface VideoCardProps {
  video: VideoWithChannel
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/watch/${video.id}`} className="group block space-y-2">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[11px] font-medium text-white">
          {video.duration}
        </span>
      </div>
      <div className="flex gap-3">
        <Avatar size="sm" className="mt-0.5 shrink-0">
          <AvatarImage src={video.channel.avatarUrl} alt={video.channel.name} />
          <AvatarFallback>{video.channel.name[0]}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-medium leading-5">
            {video.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {video.channel.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatViews(video.views)} views &middot;{" "}
            {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
    </Link>
  )
}
