import { youtubeFetch } from "@/lib/youtube-api"
import type { YouTubeCommentItem } from "@/lib/youtube-api"
import { mapYouTubeComment } from "@/services/mappers"
import type { Comment } from "@/types/comment"

export async function getCommentsByVideoId(videoId: string): Promise<Comment[]> {
  const data = await youtubeFetch<YouTubeCommentItem>("commentThreads", {
    part: "snippet",
    videoId,
    maxResults: "20",
    order: "relevance",
  })
  return (data.items ?? []).map(mapYouTubeComment)
}

export async function addComment(
  _videoId: string,
  _content: string,
  _userName: string,
): Promise<Comment> {
  throw new Error("Adding comments requires OAuth authentication")
}
