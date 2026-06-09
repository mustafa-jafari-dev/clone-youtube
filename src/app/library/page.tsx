"use client"

import Link from "next/link"
import { History, Clock, ThumbsUp, ListVideo, LogIn } from "lucide-react"

import { useAuth } from "@/features/auth/queries"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const libraryItems = [
  {
    id: "history",
    label: "History",
    description: "Videos you've watched",
    icon: History,
    href: "/history",
  },
  {
    id: "watch-later",
    label: "Watch later",
    description: "Videos you've saved to watch later",
    icon: Clock,
    href: "/playlist?list=WL",
  },
  {
    id: "liked",
    label: "Liked videos",
    description: "Videos you've liked",
    icon: ThumbsUp,
    href: "/playlist?list=LL",
  },
] as const

export default function LibraryPage() {
  const { isLoggedIn, isLoading: isAuthLoading, login } = useAuth()

  if (isAuthLoading) {
    return (
      <div className="p-4">
        <h1 className="mb-6 text-lg font-semibold">Library</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-4 p-6">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="mb-6 text-lg font-semibold">Library</h1>

      {!isLoggedIn ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-muted-foreground">
          <ListVideo className="size-16" />
          <h2 className="text-xl font-semibold text-foreground">Your library</h2>
          <p className="text-sm">Sign in to see your saved videos and history.</p>
          <Button className="mt-2" onClick={() => login()}>
            <LogIn className="mr-2 size-4" />
            Sign in
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {libraryItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.id} href={item.href}>
                <Card className="transition-colors hover:bg-accent/50">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.label}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
