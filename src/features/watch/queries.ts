import { useQuery } from "@tanstack/react-query"
import { getVideoById, getRecommendedVideos } from "@/services/api"

export function useVideo(id: string) {
  return useQuery({
    queryKey: ["video", id],
    queryFn: () => getVideoById(id),
    enabled: !!id,
  })
}

export function useRecommendedVideos(currentVideoId: string, limit = 8) {
  return useQuery({
    queryKey: ["videos", "recommended", currentVideoId],
    queryFn: () => getRecommendedVideos(currentVideoId, limit),
    enabled: !!currentVideoId,
  })
}
