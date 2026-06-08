import { delay } from "@/lib/utils"
import { USE_REAL_API, youtubeFetch, getVideoDetails, searchAndEnrich, getChannelDetails } from "@/lib/youtube-api"
import type { YouTubeSearchItem } from "@/lib/youtube-api"
import { mapYouTubeVideo, mapYouTubeChannel, enrichWithChannel } from "@/services/mappers"
import type { Video } from "@/types/video"
import type { Channel } from "@/types/channel"
import { videos as mockVideos, channels as mockChannels } from "./mock-data"

export interface VideoWithChannel extends Video {
  channel: Channel
}

export function enrichVideo(video: Video): VideoWithChannel {
  const channel = mockChannels.find((c) => c.id === video.channelId) ?? {
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

async function fetchAndEnrichVideos(videoIds: string[]): Promise<VideoWithChannel[]> {
  if (videoIds.length === 0) return []

  const [videoItems, channelItems] = await Promise.all([
    getVideoDetails(videoIds),
    getChannelDetails([]),
  ])

  const videos = videoItems.map(mapYouTubeVideo)
  const channelIds = [...new Set(videos.map((v) => v.channelId))]
  const channels = await getChannelDetails(channelIds)
  const channelMap = new Map<string, Channel>(channels.map((c) => [c.id, mapYouTubeChannel(c)]))

  return videos.map((v) => enrichWithChannel(v, channelMap))
}

export async function getVideos(): Promise<VideoWithChannel[]> {
  if (USE_REAL_API) {
    try {
      const data = await youtubeFetch<YouTubeSearchItem>("search", {
        part: "snippet",
        type: "video",
        order: "date",
        maxResults: "12",
        regionCode: "US",
      })
      const videoIds = (data.items ?? []).map((item) => item.id.videoId)
      return fetchAndEnrichVideos(videoIds)
    } catch {}
  }
  await delay(300)
  return mockVideos.map(enrichVideo)
}

export async function getVideoById(id: string): Promise<VideoWithChannel | null> {
  if (USE_REAL_API) {
    try {
      const data = await getVideoDetails([id])
      if (data.length === 0) return null
      const video = mapYouTubeVideo(data[0])
      const channels = await getChannelDetails([video.channelId])
      const channelMap = new Map<string, Channel>(channels.map((c) => [c.id, mapYouTubeChannel(c)]))
      return enrichWithChannel(video, channelMap)
    } catch {}
  }
  await delay(200)
  const video = mockVideos.find((v) => v.id === id)
  if (!video) return null
  return enrichVideo(video)
}

export async function getRecommendedVideos(
  currentVideoId: string,
  limit = 8,
): Promise<VideoWithChannel[]> {
  if (USE_REAL_API) {
    try {
      const data = await youtubeFetch<YouTubeSearchItem>("search", {
        part: "snippet",
        type: "video",
        relatedToVideoId: currentVideoId,
        maxResults: String(limit),
      })
      const videoIds = (data.items ?? []).map((item) => item.id.videoId)
      return fetchAndEnrichVideos(videoIds)
    } catch {}
  }
  await delay(250)
  return mockVideos
    .filter((v) => v.id !== currentVideoId)
    .slice(0, limit)
    .map(enrichVideo)
}

export async function getVideosByCategory(
  categoryId: string,
): Promise<VideoWithChannel[]> {
  if (USE_REAL_API) {
    try {
      const videoIds = await searchAndEnrich("", 12)
      return fetchAndEnrichVideos(videoIds)
    } catch {}
  }
  await delay(300)
  const filtered =
    categoryId === "all"
      ? mockVideos
      : mockVideos.filter((v) => v.categoryId === categoryId)
  return filtered.map(enrichVideo)
}

export async function searchVideos(query: string): Promise<VideoWithChannel[]> {
  if (USE_REAL_API) {
    try {
      const videoIds = await searchAndEnrich(query, 12)
      return fetchAndEnrichVideos(videoIds)
    } catch {}
  }
  await delay(300)
  const q = query.toLowerCase()
  return mockVideos
    .filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q)),
    )
    .map(enrichVideo)
}
