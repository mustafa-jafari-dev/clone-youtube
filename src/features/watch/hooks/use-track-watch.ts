"use client"

import { useEffect } from "react"
import { db } from "@/lib/db"
import type { WatchHistoryEntry } from "@/lib/db"
import type { VideoWithChannel } from "@/services/api"
import { useAuth } from "@/features/auth/queries"

export function useTrackWatch(video: VideoWithChannel | null | undefined) {
  const { user, isLoggedIn } = useAuth()

  useEffect(() => {
    if (!video || !isLoggedIn || !user) return

    const entry: WatchHistoryEntry = {
      id: `wh-${user.id}-${video.id}-${Date.now()}`,
      userId: user.id,
      videoId: video.id,
      title: video.title,
      thumbnailUrl: video.thumbnailUrl,
      channelName: video.channel.name,
      channelId: video.channelId,
      duration: video.duration,
      watchedAt: new Date().toISOString(),
    }

    db.watchHistory.add(entry).catch(() => {})
  }, [video?.id, isLoggedIn, user?.id])
}
