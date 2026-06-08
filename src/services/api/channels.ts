import { youtubeFetch, getVideoDetails, getChannelDetails } from "@/lib/youtube-api"
import type { YouTubeSearchItem } from "@/lib/youtube-api"
import { mapYouTubeChannel, mapYouTubeVideo, enrichWithChannel } from "@/services/mappers"
import type { Channel } from "@/types/channel"
import type { VideoWithChannel } from "./videos"

export async function getChannelById(id: string): Promise<Channel | null> {
  const items = await getChannelDetails([id])
  if (items.length === 0) return null
  return mapYouTubeChannel(items[0])
}

export async function getChannelVideos(channelId: string): Promise<VideoWithChannel[]> {
  const data = await youtubeFetch<YouTubeSearchItem>("search", {
    part: "snippet",
    type: "video",
    channelId,
    order: "date",
    maxResults: "12",
  })
  const videoIds = (data.items ?? []).map((item) => item.id.videoId)
  if (videoIds.length === 0) return []

  const [videoItems, channelItems] = await Promise.all([
    getVideoDetails(videoIds),
    getChannelDetails([channelId]),
  ])
  const channelMap = new Map(channelItems.map((c) => [c.id, mapYouTubeChannel(c)]))
  return videoItems.map((v) => enrichWithChannel(mapYouTubeVideo(v), channelMap))
}

export async function getSubscribedChannels(): Promise<Channel[]> {
  return []
}

export async function getChannelByHandle(handle: string): Promise<Channel | null> {
  const data = await youtubeFetch<YouTubeSearchItem>("search", {
    part: "snippet",
    type: "channel",
    q: handle,
    maxResults: "1",
  })
  const item = data.items?.[0]
  if (!item) return null
  return getChannelById(item.snippet.channelId)
}
