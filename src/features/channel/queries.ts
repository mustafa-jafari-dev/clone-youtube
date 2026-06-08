import { useQuery } from "@tanstack/react-query"
import { getChannelById, getChannelVideos } from "@/services/api"

export function useChannel(id: string) {
  return useQuery({
    queryKey: ["channel", id],
    queryFn: () => getChannelById(id),
    enabled: !!id,
  })
}

export function useChannelVideos(channelId: string) {
  return useQuery({
    queryKey: ["channel-videos", channelId],
    queryFn: () => getChannelVideos(channelId),
    enabled: !!channelId,
  })
}
