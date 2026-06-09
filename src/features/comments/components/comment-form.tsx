"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { LogIn } from "lucide-react"

import { useAddComment } from "@/features/comments/queries"
import { useAuth } from "@/features/auth/queries"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(5000, "Comment is too long"),
})

type CommentFormData = z.infer<typeof commentSchema>

interface CommentFormProps {
  videoId: string
}

export function CommentForm({ videoId }: CommentFormProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { user, isLoggedIn, login } = useAuth()
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
    if (!user) return
    addComment.mutate(
      {
        content: data.content,
        userName: user.name,
        userAvatarUrl: user.avatarUrl,
        userId: user.id,
      },
      { onSuccess: () => reset() },
    )
  }

  if (!isLoggedIn || !user) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <div className="flex items-center gap-3 rounded-lg border p-3 text-sm text-muted-foreground">
          <Avatar size="sm" className="shrink-0">
            <AvatarFallback>
              <LogIn className="size-3" />
            </AvatarFallback>
          </Avatar>
          <span>
            <DialogTrigger asChild>
              <button
                type="button"
                className="font-medium text-foreground underline underline-offset-2 hover:text-blue-500"
              >
                Sign in
              </button>
            </DialogTrigger>{" "}
            to add a comment
          </span>
        </div>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Sign in</DialogTitle>
            <DialogDescription>Continue with Google to post comments and get personalized recommendations.</DialogDescription>
          </DialogHeader>
          <Button onClick={() => { login(); setDialogOpen(false) }} className="w-full">
            <LogIn className="mr-2 size-4" />
            Sign in with Google
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
      <Avatar size="sm" className="mt-0.5 shrink-0">
        <AvatarImage src={user.avatarUrl} alt={user.name} />
        <AvatarFallback>{user.name[0]}</AvatarFallback>
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
