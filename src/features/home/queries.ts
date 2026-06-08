import { useQuery } from "@tanstack/react-query"
import { getVideos, getVideosByCategory, getCategories } from "@/services/api"

export function useVideos() {
  return useQuery({
    queryKey: ["videos"],
    queryFn: getVideos,
  })
}

export function useVideosByCategory(categoryId: string) {
  return useQuery({
    queryKey: ["videos", "category", categoryId],
    queryFn: () => getVideosByCategory(categoryId),
    enabled: categoryId !== "all",
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: Infinity,
  })
}
