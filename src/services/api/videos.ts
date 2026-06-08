import { videos, channels } from "./mock-data"
import type { Video } from "@/types/video"
import type { Channel } from "@/types/channel"

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface VideoWithChannel extends Video {
  channel: Channel
}

export function enrichVideo(video: Video): VideoWithChannel {
  const channel = channels.find((c) => c.id === video.channelId)!
  return { ...video, channel }
}

export async function getVideos(): Promise<VideoWithChannel[]> {
  await delay(300)
  return videos.map(enrichVideo)
}

export async function getVideoById(id: string): Promise<VideoWithChannel | null> {
  await delay(200)
  const video = videos.find((v) => v.id === id)
  if (!video) return null
  return enrichVideo(video)
}

export async function getRecommendedVideos(
  currentVideoId: string,
  limit = 8,
): Promise<VideoWithChannel[]> {
  await delay(250)
  return videos
    .filter((v) => v.id !== currentVideoId)
    .slice(0, limit)
    .map(enrichVideo)
}

export async function getVideosByCategory(
  categoryId: string,
): Promise<VideoWithChannel[]> {
  await delay(300)
  const filtered =
    categoryId === "all"
      ? videos
      : videos.filter((v) => v.categoryId === categoryId)
  return filtered.map(enrichVideo)
}

export async function searchVideos(query: string): Promise<VideoWithChannel[]> {
  await delay(300)
  const q = query.toLowerCase()
  return videos
    .filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q)),
    )
    .map(enrichVideo)
}
