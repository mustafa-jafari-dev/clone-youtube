"use client"

import { MessageSquare } from "lucide-react"

import { useComments } from "@/features/comments/queries"
import { CommentItem } from "@/features/comments/components/comment-item"
import { CommentForm } from "@/features/comments/components/comment-form"
import { Skeleton } from "@/components/ui/skeleton"

function CommentSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

interface CommentListProps {
  videoId: string
}

export function CommentList({ videoId }: CommentListProps) {
  const { data: comments, isLoading, error } = useComments(videoId)

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">
          Comments{comments ? ` (${comments.length})` : ""}
        </h2>
      </div>

      <CommentForm videoId={videoId} />

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)
        ) : error ? (
          <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
            <MessageSquare className="size-8" />
            <p className="text-sm">Failed to load comments.</p>
          </div>
        ) : !comments || comments.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
            <MessageSquare className="size-8" />
            <p className="text-sm">No comments yet. Be the first!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </section>
  )
}
