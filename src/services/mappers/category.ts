import type { Category } from "@/types/category"
import type { YouTubeCategoryItem } from "@/lib/youtube-api"

export function mapYouTubeCategory(item: YouTubeCategoryItem): Category {
  return {
    id: item.id,
    name: item.snippet.title,
  }
}
