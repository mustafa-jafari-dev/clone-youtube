import { formatDistanceToNow } from "date-fns"
import { ThumbsUp, ThumbsDown } from "lucide-react"

import type { Comment } from "@/types/comment"
import { formatViews } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface CommentItemProps {
  comment: Comment
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="flex gap-3">
      <Avatar size="sm" className="mt-0.5 shrink-0">
        <AvatarImage src={comment.user.avatarUrl} alt={comment.user.name} />
        <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-foreground">{comment.user.name}</span>
          <span className="text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="mt-0.5 text-sm">{comment.content}</p>
        <div className="mt-1 flex items-center gap-2">
          <Button variant="ghost" size="icon-xs" aria-label="Like">
            <ThumbsUp className="size-3.5" />
          </Button>
          <span className="text-xs text-muted-foreground">{formatViews(comment.likes)}</span>
          <Button variant="ghost" size="icon-xs" aria-label="Dislike">
            <ThumbsDown className="size-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs font-medium">
            Reply
          </Button>
        </div>
      </div>
    </div>
  )
}
