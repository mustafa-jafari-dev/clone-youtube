"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { useAddComment } from "@/features/comments/queries"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(5000, "Comment is too long"),
})

type CommentFormData = z.infer<typeof commentSchema>

interface CommentFormProps {
  videoId: string
}

export function CommentForm({ videoId }: CommentFormProps) {
  const addComment = useAddComment(videoId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  })

  function onSubmit(data: CommentFormData) {
    addComment.mutate(
      { content: data.content, userName: "You" },
      { onSuccess: () => reset() },
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
      <Avatar size="sm" className="mt-0.5 shrink-0">
        <AvatarImage
          src="https://api.dicebear.com/9.x/avataaars/svg?seed=current-user"
          alt="Your avatar"
        />
        <AvatarFallback>Y</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Textarea
          {...register("content")}
          placeholder="Add a comment..."
          className="min-h-0 resize-none border-0 border-b border-border px-0 py-1 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
          rows={1}
        />
        {errors.content && (
          <p className="mt-1 text-xs text-destructive">{errors.content.message}</p>
        )}
        <div className="mt-2 flex justify-end gap-2">
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || addComment.isPending}
            className="rounded-full"
          >
            {addComment.isPending ? "Posting..." : "Comment"}
          </Button>
        </div>
      </div>
    </form>
  )
}
