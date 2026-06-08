import { useQuery } from "@tanstack/react-query"
import { searchVideos } from "@/services/api"

export function useSearchVideos(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchVideos(query),
    enabled: !!query,
  })
}
