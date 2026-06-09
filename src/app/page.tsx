import { CategoryFilterBar } from "@/components/shared/category-filter-bar"
import { VideoGrid } from "@/features/home/components/video-grid"
import { RecommendedSection } from "@/features/home/components/recommended-section"

export default function HomePage() {
  return (
    <>
      <CategoryFilterBar />
      <div className="space-y-6 p-4">
        <RecommendedSection />
        <VideoGrid />
      </div>
    </>
  )
}
