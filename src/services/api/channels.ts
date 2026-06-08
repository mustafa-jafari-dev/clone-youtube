import { channels, videos } from "./mock-data"
import type { Channel } from "@/types/channel"
import type { VideoWithChannel } from "./videos"
import { enrichVideo } from "./videos"

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getChannelById(id: string): Promise<Channel | null> {
  await delay(200)
  return channels.find((c) => c.id === id) ?? null
}

export async function getChannelVideos(channelId: string): Promise<VideoWithChannel[]> {
  await delay(300)
  return videos.filter((v) => v.channelId === channelId).map(enrichVideo)
}

export async function getSubscribedChannels(): Promise<Channel[]> {
  await delay(300)
  return channels
}

export async function getChannelByHandle(handle: string): Promise<Channel | null> {
  await delay(200)
  return channels.find((c) => c.handle === handle) ?? null
}

export { enrichVideo }
