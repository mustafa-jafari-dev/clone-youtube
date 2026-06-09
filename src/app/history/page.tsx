"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Clock, History, Trash2, LogIn } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { db, type WatchHistoryEntry } from "@/lib/db"
import { useAuth } from "@/features/auth/queries"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { Skeleton } from "@/components/ui/skeleton"

export default function HistoryPage() {
  const { user, isLoggedIn, isLoading: isAuthLoading, login } = useAuth()
  const [entries, setEntries] = useState<WatchHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    db.watchHistory
      .where("userId")
      .equals(user.id)
      .reverse()
      .sortBy("watchedAt")
      .then((data) => {
        setEntries(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user?.id])

  async function clearHistory() {
    if (!user) return
    await db.watchHistory.where("userId").equals(user.id).delete()
    setEntries([])
  }

  if (isAuthLoading) {
    return (
      <div className="p-4">
        <h1 className="mb-6 text-lg font-semibold">Watch history</h1>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="aspect-video h-20 w-36 shrink-0 rounded-lg bg-muted" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/3 rounded bg-muted" />
                <div className="h-3 w-1/4 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-muted-foreground">
        <History className="size-16" />
        <h1 className="text-xl font-semibold text-foreground">Watch history</h1>
        <p className="text-sm">Sign in to see your watch history.</p>
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
        <h1 className="mb-6 text-lg font-semibold">Watch history</h1>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="aspect-video h-20 w-36 shrink-0 rounded-lg" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="p-4">
        <h1 className="mb-6 text-lg font-semibold">Watch history</h1>
        <EmptyState icon={History} title="No watch history yet" message="Videos you watch will appear here." />
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Watch history</h1>
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={clearHistory}>
          <Trash2 className="mr-2 size-4" />
          Clear all
        </Button>
      </div>

      <div className="space-y-2">
        {entries.map((entry) => (
          <Link
            key={entry.id}
            href={`/watch/${entry.videoId}`}
            className="group flex gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
          >
            <div className="relative aspect-video h-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:h-24">
              <img
                src={entry.thumbnailUrl}
                alt=""
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute bottom-0.5 right-0.5 rounded bg-black/80 px-0.5 text-[10px] font-medium text-white">
                {entry.duration}
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <h3 className="line-clamp-2 text-sm font-medium leading-5">{entry.title}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{entry.channelName}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {formatDistanceToNow(new Date(entry.watchedAt), { addSuffix: true })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
