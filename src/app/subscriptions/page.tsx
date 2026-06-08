"use client"

import Link from "next/link"
import { AlertCircle, Loader2, LogIn, Tv } from "lucide-react"

import { useAuth } from "@/features/auth/queries"
import { useSubscriptionsFeed } from "@/features/subscriptions/queries"
import { VideoCard } from "@/components/shared/video-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LoginForm } from "@/features/auth/components/login-dialog"

export default function SubscriptionsPage() {
  const { isLoggedIn } = useAuth()
  const { data: videos, isLoading, error } = useSubscriptionsFeed()

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-muted-foreground">
        <Tv className="size-16" />
        <h1 className="text-xl font-semibold text-foreground">Don&apos;t miss new videos</h1>
        <p className="text-sm">Sign in to see updates from your subscriptions.</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-2">
              <LogIn className="mr-2 size-4" />
              Sign in
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Sign in</DialogTitle>
              <DialogDescription>Enter your name to get started (mock auth).</DialogDescription>
            </DialogHeader>
            <LoginForm />
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-lg font-semibold">Latest from subscriptions</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
          <AlertCircle className="size-12" />
          <p className="text-lg font-medium">Something went wrong</p>
        </div>
      ) : !videos || videos.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
          <Tv className="size-12" />
          <p className="text-lg font-medium">No videos yet</p>
          <p className="text-sm">Subscribe to channels to see their latest videos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  )
}
