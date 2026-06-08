import type { Comment } from "@/types/comment"
import type { YouTubeCommentItem } from "@/lib/youtube-api"

export function mapYouTubeComment(item: YouTubeCommentItem): Comment {
  const snippet = item.snippet.topLevelComment.snippet
  return {
    id: item.id,
    content: snippet.textDisplay,
    userId: snippet.authorDisplayName,
    videoId: item.snippet.videoId,
    likes: snippet.likeCount,
    repliesCount: item.snippet.totalReplyCount,
    createdAt: snippet.publishedAt,
    user: {
      name: snippet.authorDisplayName,
      avatarUrl: snippet.authorProfileImageUrl,
    },
  }
}
