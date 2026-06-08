import { delay } from "@/lib/utils"
import { USE_REAL_API, youtubeFetch, getVideoDetails, getChannelDetails } from "@/lib/youtube-api"
import type { YouTubeSearchItem } from "@/lib/youtube-api"
import { mapYouTubeChannel, mapYouTubeVideo, enrichWithChannel } from "@/services/mappers"
import type { Channel } from "@/types/channel"
import type { VideoWithChannel } from "./videos"
import { enrichVideo } from "./videos"
import { channels as mockChannels, videos as mockVideos } from "./mock-data"

export async function getChannelById(id: string): Promise<Channel | null> {
  if (USE_REAL_API) {
    try {
      const items = await getChannelDetails([id])
      if (items.length === 0) return null
      return mapYouTubeChannel(items[0])
    } catch {}
  }
  await delay(200)
  return mockChannels.find((c) => c.id === id) ?? null
}

export async function getChannelVideos(channelId: string): Promise<VideoWithChannel[]> {
  if (USE_REAL_API) {
    try {
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
    } catch {}
  }
  await delay(300)
  return mockVideos.filter((v) => v.channelId === channelId).map(enrichVideo)
}

export async function getSubscribedChannels(): Promise<Channel[]> {
  if (USE_REAL_API) {
    try {
      return []
    } catch {}
  }
  await delay(300)
  return mockChannels
}

export async function getChannelByHandle(handle: string): Promise<Channel | null> {
  if (USE_REAL_API) {
    try {
      const data = await youtubeFetch<YouTubeSearchItem>("search", {
        part: "snippet",
        type: "channel",
        q: handle,
        maxResults: "1",
      })
      const item = data.items?.[0]
      if (!item) return null
      return getChannelById(item.snippet.channelId)
    } catch {}
  }
  await delay(200)
  return mockChannels.find((c) => c.handle === handle) ?? null
}
