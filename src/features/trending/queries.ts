import { useQuery } from "@tanstack/react-query"
import { getTrendingVideos } from "@/services/api"

export function useTrendingVideos() {
  return useQuery({
    queryKey: ["videos", "trending"],
    queryFn: getTrendingVideos,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
