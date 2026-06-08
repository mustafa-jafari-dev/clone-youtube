import { delay } from "@/lib/utils"
import { USE_REAL_API, youtubeFetch } from "@/lib/youtube-api"
import type { YouTubeCommentItem } from "@/lib/youtube-api"
import { mapYouTubeComment } from "@/services/mappers"
import type { Comment } from "@/types/comment"
import { comments as mockComments } from "./mock-data"

let commentIdCounter = mockComments.length

export async function getCommentsByVideoId(videoId: string): Promise<Comment[]> {
  if (USE_REAL_API) {
    try {
      const data = await youtubeFetch<YouTubeCommentItem>("commentThreads", {
        part: "snippet",
        videoId,
        maxResults: "20",
        order: "relevance",
      })
      return (data.items ?? []).map(mapYouTubeComment)
    } catch {}
  }
  await delay(250)
  return mockComments.filter((c) => c.videoId === videoId)
}

export async function addComment(
  videoId: string,
  content: string,
  userName: string,
): Promise<Comment> {
  if (USE_REAL_API) {
    try {
      throw new Error("Adding comments requires OAuth authentication")
    } catch {}
  }
  await delay(400)
  commentIdCounter++

  const comment: Comment = {
    id: `cmt-${commentIdCounter}`,
    content,
    userId: "u-current",
    videoId,
    likes: 0,
    repliesCount: 0,
    createdAt: new Date().toISOString(),
    user: {
      name: userName,
      avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=current-user",
    },
  }

  return comment
}
