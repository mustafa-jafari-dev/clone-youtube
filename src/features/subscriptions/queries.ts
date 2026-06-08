import { useQuery } from "@tanstack/react-query"
import { getSubscribedChannels, getVideos } from "@/services/api"

export function useSubscribedChannels() {
  return useQuery({
    queryKey: ["subscribed-channels"],
    queryFn: getSubscribedChannels,
  })
}

export function useSubscriptionsFeed() {
  return useQuery({
    queryKey: ["subscriptions-feed"],
    queryFn: getVideos,
  })
}
