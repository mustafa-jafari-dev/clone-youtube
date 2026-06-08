import { comments } from "./mock-data"
import type { Comment } from "@/types/comment"

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let commentIdCounter = comments.length

export async function getCommentsByVideoId(videoId: string): Promise<Comment[]> {
  await delay(250)
  return comments.filter((c) => c.videoId === videoId)
}

export async function addComment(
  videoId: string,
  content: string,
  userName: string,
): Promise<Comment> {
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
