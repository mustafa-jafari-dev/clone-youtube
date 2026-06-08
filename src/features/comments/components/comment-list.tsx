"use client"

import { MessageSquare } from "lucide-react"

import { useComments } from "@/features/comments/queries"
import { CommentItem } from "@/features/comments/components/comment-item"
import { CommentForm } from "@/features/comments/components/comment-form"
import { CommentSkeleton } from "@/components/shared/comment-skeleton"
import { ErrorState } from "@/components/shared/error-state"
import { EmptyState } from "@/components/shared/empty-state"

interface CommentListProps {
  videoId: string
}

export function CommentList({ videoId }: CommentListProps) {
  const { data: comments, isLoading, error } = useComments(videoId)

  return (
    <section className="space-y-4" aria-label="Comments">
      <h2 className="text-lg font-semibold">
        Comments{comments ? ` (${comments.length})` : ""}
      </h2>

      <CommentForm videoId={videoId} />

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)
        ) : error ? (
          <ErrorState title="Failed to load comments" />
        ) : !comments || comments.length === 0 ? (
          <EmptyState icon={MessageSquare} title="No comments yet" message="Be the first!" />
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </section>
  )
}
