"use client"

import { useState } from "react"
import { Play } from "lucide-react"

interface VideoPlayerProps {
  thumbnailUrl: string
  title: string
  duration: string
}

export function VideoPlayer({ thumbnailUrl, title, duration }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <div className="aspect-video flex items-center justify-center bg-black">
        <p className="text-sm text-muted-foreground">🎬 Video player placeholder</p>
      </div>
    )
  }

  return (
    <div className="group relative aspect-video cursor-pointer overflow-hidden bg-black">
      <img
        src={thumbnailUrl}
        alt={title}
        className="size-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={() => setPlaying(true)}
          className="flex size-16 items-center justify-center rounded-full bg-black/70 text-white transition-transform hover:scale-110 active:scale-95"
          aria-label="Play video"
        >
          <Play className="ml-0.5 size-8 fill-current" />
        </button>
      </div>
      <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 text-xs font-medium text-white">
        {duration}
      </span>
    </div>
  )
}
