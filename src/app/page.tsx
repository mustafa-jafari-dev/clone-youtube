import { CategoryFilterBar } from "@/components/shared/category-filter-bar"
import { VideoGrid } from "@/features/home/components/video-grid"

export default function HomePage() {
  return (
    <>
      <CategoryFilterBar />
      <div className="p-4">
        <VideoGrid />
      </div>
    </>
  )
}
