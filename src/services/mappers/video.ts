import type { Video } from "@/types/video"
import type { Channel } from "@/types/channel"
import type { VideoWithChannel } from "@/services/api/videos"
import { parseDuration, type YouTubeVideoItem, type YouTubeChannelItem } from "@/lib/youtube-api"

export function mapYouTubeVideo(item: YouTubeVideoItem): Video {
  return {
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl: item.snippet.thumbnails.high?.url ?? item.snippet.thumbnails.medium?.url ?? "",
    duration: parseDuration(item.contentDetails.duration),
    views: Number.parseInt(item.statistics.viewCount, 10) || 0,
    createdAt: item.snippet.publishedAt,
    channelId: item.snippet.channelId,
    categoryId: item.snippet.categoryId,
    tags: item.snippet.tags ?? [],
    likes: Number.parseInt(item.statistics.likeCount, 10) || 0,
    commentsCount: Number.parseInt(item.statistics.commentCount, 10) || 0,
  }
}

export function mapYouTubeChannel(item: YouTubeChannelItem): Channel {
  return {
    id: item.id,
    name: item.snippet.title,
    handle: item.snippet.customUrl ? `@${item.snippet.customUrl}` : `@${item.snippet.title.toLowerCase().replace(/\s+/g, "")}`,
    avatarUrl: item.snippet.thumbnails.default?.url ?? "",
    bannerUrl: item.brandingSettings?.image?.bannerExternalUrl,
    description: item.snippet.description,
    subscribers: Number.parseInt(item.statistics.subscriberCount, 10) || 0,
    videoCount: Number.parseInt(item.statistics.videoCount, 10) || 0,
    joinedAt: item.snippet.publishedAt,
  }
}

export function enrichWithChannel(video: Video, channelMap: Map<string, Channel>): VideoWithChannel {
  const channel = channelMap.get(video.channelId) ?? {
    id: video.channelId,
    name: "Unknown",
    handle: "@unknown",
    avatarUrl: "",
    description: "",
    subscribers: 0,
    videoCount: 0,
    joinedAt: new Date().toISOString(),
  }
  return { ...video, channel }
}
