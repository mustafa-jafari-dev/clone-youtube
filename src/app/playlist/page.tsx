"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Clock, ThumbsUp, ListVideo, LogIn } from "lucide-react"

import { db, type WatchLaterEntry, type LikedVideoEntry } from "@/lib/db"
import { useAuth } from "@/features/auth/queries"
import { useVideo } from "@/features/watch/queries"
import { VideoCard } from "@/components/shared/video-card"
import { VideoGridLayout } from "@/components/shared/video-grid-layout"
import { VideoGridSkeleton } from "@/components/shared/video-card-skeleton"
import { ErrorState } from "@/components/shared/error-state"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"

const playlistConfig: Record<string, { title: string; description: string; icon: typeof Clock }> = {
  WL: {
    title: "Watch later",
    description: "Videos you've saved to watch later",
    icon: Clock,
  },
  LL: {
    title: "Liked videos",
    description: "Videos you've liked",
    icon: ThumbsUp,
  },
} as const

function PlaylistContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const list = searchParams.get("list") ?? ""
  const { user, isLoggedIn, isLoading: isAuthLoading, login } = useAuth()

  const config = playlistConfig[list]

  // Handle invalid or missing list param
  useEffect(() => {
    if (list && !config) {
      router.replace("/library")
    }
  }, [list, config, router])

  const [videoIds, setVideoIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch saved video IDs from Dexie
  useEffect(() => {
    let cancelled = false

    async function fetchEntries() {
      if (!isLoggedIn || !user?.id || !config) {
        setVideoIds([])
        setLoading(false)
        return
      }

      let ids: string[] = []

      if (list === "WL") {
        const entries = await db.watchLater
          .where("userId")
          .equals(user.id)
          .reverse()
          .sortBy("savedAt")
        ids = entries.map((e) => e.videoId)
      } else if (list === "LL") {
        const entries = await db.likedVideos
          .where("userId")
          .equals(user.id)
          .reverse()
          .sortBy("likedAt")
        ids = entries.map((e) => e.videoId)
      }

      if (!cancelled) {
        setVideoIds(ids)
        setLoading(false)
      }
    }

    setLoading(true)
    fetchEntries()

    return () => {
      cancelled = true
    }
  }, [isLoggedIn, user?.id, list, config])

  if (isAuthLoading) {
    return (
      <div className="p-4">
        <div className="mb-6 space-y-1">
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="h-4 w-72 rounded bg-muted" />
        </div>
        <VideoGridSkeleton />
      </div>
    )
  }

  if (!list || !config) {
    return (
      <div className="p-4">
        <EmptyState icon={ListVideo} title="Select a playlist" message="Choose a playlist from your library." />
      </div>
    )
  }

  const Icon = config.icon

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-muted-foreground">
        <Icon className="size-16" />
        <h1 className="text-xl font-semibold text-foreground">{config.title}</h1>
        <p className="text-sm">Sign in to see your {config.title.toLowerCase()}.</p>
        <Button className="mt-2" onClick={() => login()}>
          <LogIn className="mr-2 size-4" />
          Sign in
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="mb-6 text-lg font-semibold">{config.title}</h1>
        <VideoGridSkeleton />
      </div>
    )
  }

  if (videoIds.length === 0) {
    return (
      <div className="p-4">
        <h1 className="mb-6 text-lg font-semibold">{config.title}</h1>
        <EmptyState
          icon={Icon}
          title={`No ${config.title.toLowerCase()} yet`}
          message={list === "WL" ? "Videos you save to watch later will appear here." : "Videos you like will appear here."}
        />
      </div>
    )
  }

  return (
    <section className="p-4">
      <div className="mb-6">
        <h1 className="text-lg font-semibold">{config.title}</h1>
        <p className="text-sm text-muted-foreground">{videoIds.length} videos</p>
      </div>
      <VideoGridLayout>
        {videoIds.map((videoId) => (
          <PlaylistVideoCard key={videoId} videoId={videoId} />
        ))}
      </VideoGridLayout>
    </section>
  )
}

function PlaylistVideoCard({ videoId }: { videoId: string }) {
  const { data: video, isLoading, error } = useVideo(videoId)

  if (isLoading) return <VideoGridSkeleton count={1} />
  if (error || !video) return null

  return <VideoCard video={video} />
}

export default function PlaylistPage() {
  return (
    <Suspense fallback={<VideoGridSkeleton />}>
      <PlaylistContent />
    </Suspense>
  )
}
