import { youtubeFetch, getVideoDetails, searchAndEnrich, getChannelDetails } from "@/lib/youtube-api"
import type { YouTubeSearchItem } from "@/lib/youtube-api"
import { mapYouTubeVideo, mapYouTubeChannel, enrichWithChannel } from "@/services/mappers"
import type { Video } from "@/types/video"
import type { Channel } from "@/types/channel"

export interface VideoWithChannel extends Video {
  channel: Channel
}

async function fetchAndEnrichVideos(videoIds: string[]): Promise<VideoWithChannel[]> {
  if (videoIds.length === 0) return []

  const videoItems = await getVideoDetails(videoIds)
  const videos = videoItems.map(mapYouTubeVideo)
  const channelIds = [...new Set(videos.map((v) => v.channelId))]
  const channels = await getChannelDetails(channelIds)
  const channelMap = new Map<string, Channel>(channels.map((c) => [c.id, mapYouTubeChannel(c)]))

  return videos.map((v) => enrichWithChannel(v, channelMap))
}

export async function getVideos(): Promise<VideoWithChannel[]> {
  const data = await youtubeFetch<YouTubeSearchItem>("search", {
    part: "snippet",
    type: "video",
    order: "date",
    maxResults: "12",
    regionCode: "US",
  })
  const videoIds = (data.items ?? []).map((item) => item.id.videoId)
  return fetchAndEnrichVideos(videoIds)
}

export async function getVideoById(id: string): Promise<VideoWithChannel | null> {
  const data = await getVideoDetails([id])
  if (data.length === 0) return null
  const video = mapYouTubeVideo(data[0])
  const channels = await getChannelDetails([video.channelId])
  const channelMap = new Map<string, Channel>(channels.map((c) => [c.id, mapYouTubeChannel(c)]))
  return enrichWithChannel(video, channelMap)
}

export async function getRecommendedVideos(
  currentVideoId: string,
  limit = 8,
): Promise<VideoWithChannel[]> {
  const data = await youtubeFetch<YouTubeSearchItem>("search", {
    part: "snippet",
    type: "video",
    relatedToVideoId: currentVideoId,
    maxResults: String(limit),
  })
  const videoIds = (data.items ?? []).map((item) => item.id.videoId)
  return fetchAndEnrichVideos(videoIds)
}

export async function getVideosByCategory(
  categoryId: string,
): Promise<VideoWithChannel[]> {
  const videoIds = await searchAndEnrich("", 12)
  return fetchAndEnrichVideos(videoIds)
}

export async function searchVideos(query: string): Promise<VideoWithChannel[]> {
  const videoIds = await searchAndEnrich(query, 12)
  return fetchAndEnrichVideos(videoIds)
}
