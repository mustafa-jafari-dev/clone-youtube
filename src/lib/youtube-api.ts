const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
const BASE_URL = "https://www.googleapis.com/youtube/v3"

export const USE_REAL_API = !!API_KEY

interface YouTubeListResponse<T> {
  items: T[]
  nextPageToken?: string
  prevPageToken?: string
  pageInfo: { totalResults: number; resultsPerPage: number }
}

export async function youtubeFetch<T>(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<YouTubeListResponse<T>> {
  if (!API_KEY) throw new Error("YouTube API key is not configured")

  const url = new URL(`${BASE_URL}/${endpoint}`)
  url.searchParams.set("key", API_KEY)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const res = await fetch(url.toString())
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`YouTube API ${res.status}: ${body}`)
  }

  return res.json()
}

export async function getVideoDetails(ids: string[]) {
  if (ids.length === 0) return []
  const data = await youtubeFetch<YouTubeVideoItem>("videos", {
    part: "snippet,statistics,contentDetails",
    id: ids.join(","),
    maxResults: "50",
  })
  return data.items ?? []
}

export async function getChannelDetails(ids: string[]) {
  if (ids.length === 0) return []
  const data = await youtubeFetch<YouTubeChannelItem>("channels", {
    part: "snippet,statistics,brandingSettings",
    id: ids.join(","),
  })
  return data.items ?? []
}

export interface YouTubeVideoItem {
  id: string
  snippet: {
    title: string
    description: string
    thumbnails: { medium?: { url: string }; high?: { url: string }; default?: { url: string } }
    channelId: string
    channelTitle: string
    tags?: string[]
    categoryId: string
    publishedAt: string
  }
  statistics: {
    viewCount: string
    likeCount: string
    commentCount: string
  }
  contentDetails: {
    duration: string
  }
}

export interface YouTubeChannelItem {
  id: string
  snippet: {
    title: string
    description: string
    thumbnails: { default?: { url: string } }
    customUrl?: string
    publishedAt: string
  }
  statistics: {
    subscriberCount: string
    videoCount: string
  }
  brandingSettings?: {
    image?: { bannerExternalUrl?: string }
  }
}

export interface YouTubeSearchItem {
  id: { videoId: string }
  snippet: {
    title: string
    description: string
    thumbnails: { medium?: { url: string }; high?: { url: string } }
    channelId: string
    channelTitle: string
    publishedAt: string
  }
}

export interface YouTubeCommentItem {
  id: string
  snippet: {
    videoId: string
    topLevelComment: {
      snippet: {
        textDisplay: string
        authorDisplayName: string
        authorProfileImageUrl: string
        likeCount: number
        publishedAt: string
      }
    }
    totalReplyCount: number
  }
}

export interface YouTubeCategoryItem {
  id: string
  snippet: {
    title: string
    assignable: boolean
  }
}

export function parseDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  if (!match) return "0:00"
  const hours = (match[1] || "").replace("H", "")
  const minutes = (match[2] || "").replace("M", "")
  const seconds = (match[3] || "").replace("S", "")
  if (hours) {
    return `${hours}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`
  }
  return `${minutes || "0"}:${seconds.padStart(2, "0")}`
}

export async function searchAndEnrich(query: string, maxResults = 12): Promise<string[]> {
  const data = await youtubeFetch<YouTubeSearchItem>("search", {
    part: "snippet",
    type: "video",
    q: query,
    maxResults: String(maxResults),
  })
  return (data.items ?? []).map((item) => item.id.videoId)
}
