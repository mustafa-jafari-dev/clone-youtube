import { youtubeFetch } from "@/lib/youtube-api"
import type { YouTubeCategoryItem } from "@/lib/youtube-api"
import { mapYouTubeCategory } from "@/services/mappers"
import type { Category } from "@/types/category"

export async function getCategories(): Promise<Category[]> {
  const data = await youtubeFetch<YouTubeCategoryItem>("videoCategories", {
    part: "snippet",
    regionCode: "US",
  })
  const all: Category[] = [{ id: "all", name: "All" }]
  all.push(
    ...(data.items ?? [])
      .filter((item) => item.snippet.assignable)
      .map(mapYouTubeCategory),
  )
  return all
}
