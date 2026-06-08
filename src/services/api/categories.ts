import { delay } from "@/lib/utils"
import { USE_REAL_API, youtubeFetch } from "@/lib/youtube-api"
import type { YouTubeCategoryItem } from "@/lib/youtube-api"
import { mapYouTubeCategory } from "@/services/mappers"
import type { Category } from "@/types/category"
import { categories as mockCategories } from "./mock-data"

export async function getCategories(): Promise<Category[]> {
  if (USE_REAL_API) {
    try {
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
    } catch {}
  }
  await delay(100)
  return mockCategories
}
