"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { getRecommendedVideos } from "@/services/api"
import type { VideoWithChannel } from "@/services/api"
import { db } from "@/lib/db"
import { useAuth } from "@/features/auth/queries"

export function useRecommended() {
  const { user, isLoggedIn } = useAuth()
  const [lastWatchedId, setLastWatchedId] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return

    db.watchHistory
      .where("userId")
      .equals(user.id)
      .reverse()
      .sortBy("watchedAt")
      .then((entries) => {
        if (entries.length > 0) {
          setLastWatchedId(entries[0].videoId)
        }
      })
      .catch(() => {})
  }, [user?.id])

  const query = useQuery({
    queryKey: ["videos", "recommended", "home", lastWatchedId],
    queryFn: () => getRecommendedVideos(lastWatchedId!, 8),
    enabled: isLoggedIn && !!lastWatchedId,
    staleTime: 5 * 60 * 1000,
  })

  return {
    videos: query.data ?? [],
    isLoading: query.isLoading,
    isEnabled: isLoggedIn && !!lastWatchedId,
  }
}
