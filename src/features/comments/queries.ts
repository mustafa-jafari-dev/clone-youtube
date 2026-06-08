import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
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
    mutationFn: ({ content, userName }: { content: string; userName: string }) =>
      addComment(videoId, content, userName),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["comments", videoId] })
      const previous = queryClient.getQueryData<Comment[]>(["comments", videoId])

      const optimistic: Comment = {
        id: "optimistic",
        content: payload.content,
        userId: "u-current",
        videoId,
        likes: 0,
        repliesCount: 0,
        createdAt: new Date().toISOString(),
        user: { name: payload.userName, avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=current-user" },
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
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] })
    },
  })
}
