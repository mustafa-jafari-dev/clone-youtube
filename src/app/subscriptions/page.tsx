"use client"

import { LogIn, Tv } from "lucide-react"

import { useAuth } from "@/features/auth/queries"
import { useSubscriptionsFeed } from "@/features/subscriptions/queries"
import { VideoCard } from "@/components/shared/video-card"
import { VideoGridLayout } from "@/components/shared/video-grid-layout"
import { VideoGridSkeleton } from "@/components/shared/video-card-skeleton"
import { ErrorState } from "@/components/shared/error-state"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"

export default function SubscriptionsPage() {
  const { isLoggedIn, isLoading: isAuthLoading, login } = useAuth()
  const { data: videos, isLoading, error } = useSubscriptionsFeed()

  if (isAuthLoading) {
    return <VideoGridSkeleton />
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-muted-foreground">
        <Tv className="size-16" />
        <h1 className="text-xl font-semibold text-foreground">Don&apos;t miss new videos</h1>
        <p className="text-sm">Sign in to see updates from your subscriptions.</p>
        <Button className="mt-2" onClick={() => login()}>
          <LogIn className="mr-2 size-4" />
          Sign in with Google
        </Button>
      </div>
    )
  }

  return (
    <section className="p-4">
      <h1 className="mb-4 text-lg font-semibold">Latest from subscriptions</h1>

      {isLoading ? (
        <VideoGridSkeleton />
      ) : error ? (
        <ErrorState title="Something went wrong" />
      ) : !videos || videos.length === 0 ? (
        <EmptyState icon={Tv} title="No videos yet" message="Subscribe to channels to see their latest videos." />
      ) : (
        <VideoGridLayout>
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </VideoGridLayout>
      )}
    </section>
  )
}
