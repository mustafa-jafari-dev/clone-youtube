import { youtubeFetch } from "@/lib/youtube-api"
import type { YouTubeCommentItem } from "@/lib/youtube-api"
import { mapYouTubeComment } from "@/services/mappers"
import type { Comment } from "@/types/comment"
import { db } from "@/lib/db"
import type { LocalComment } from "@/lib/db"

function mapLocalToComment(local: LocalComment): Comment {
  return {
    id: local.id,
    content: local.content,
    userId: local.userId,
    videoId: local.videoId,
    likes: local.likes,
    repliesCount: local.repliesCount,
    createdAt: local.createdAt,
    user: {
      name: local.userName,
      avatarUrl: local.userAvatarUrl,
    },
  }
}

export async function getCommentsByVideoId(videoId: string): Promise<Comment[]> {
  const [apiComments, localComments] = await Promise.all([
    youtubeFetch<YouTubeCommentItem>("commentThreads", {
      part: "snippet",
      videoId,
      maxResults: "20",
      order: "relevance",
    }).then((data) => (data.items ?? []).map(mapYouTubeComment)),
    db.comments
      .where("videoId")
      .equals(videoId)
      .reverse()
      .sortBy("createdAt"),
  ])

  const mapped = localComments.map(mapLocalToComment)
  return [...mapped, ...apiComments]
}

export async function addComment(
  videoId: string,
  content: string,
  userName: string,
  userAvatarUrl: string,
  userId: string,
): Promise<Comment> {
  const local: LocalComment = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    videoId,
    content,
    userId,
    userName,
    userAvatarUrl,
    likes: 0,
    repliesCount: 0,
    createdAt: new Date().toISOString(),
  }

  await db.comments.add(local)
  return mapLocalToComment(local)
}
