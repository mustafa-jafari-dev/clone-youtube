import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getCommentsByVideoId, addComment } from "@/services/api"
import type { Comment } from "@/types/comment"

export function useComments(videoId: string) {
  return useQuery({
    queryKey: ["comments", videoId],
    queryFn: () => getCommentsByVideoId(videoId),
    enabled: !!videoId,
  })
}

export function useAddComment(videoId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      content,
      userName,
      userAvatarUrl,
      userId,
    }: {
      content: string
      userName: string
      userAvatarUrl: string
      userId: string
    }) => addComment(videoId, content, userName, userAvatarUrl, userId),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["comments", videoId] })
      const previous = queryClient.getQueryData<Comment[]>(["comments", videoId])

      const optimistic: Comment = {
        id: "optimistic",
        content: payload.content,
        userId: payload.userId,
        videoId,
        likes: 0,
        repliesCount: 0,
        createdAt: new Date().toISOString(),
        user: {
          name: payload.userName,
          avatarUrl: payload.userAvatarUrl,
        },
      }

      queryClient.setQueryData<Comment[]>(["comments", videoId], (old) =>
        old ? [optimistic, ...old] : [optimistic],
      )

      return { previous }
    },
    onError: (_err, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["comments", videoId], context.previous)
      }
      toast.error("Failed to post comment. Please try again.")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] })
    },
  })
}
