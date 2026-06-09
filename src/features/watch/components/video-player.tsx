interface VideoPlayerProps {
  videoId: string
  title: string
}

export function VideoPlayer({ videoId, title }: VideoPlayerProps) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?controls=1`

  return (
      <iframe
        src={embedUrl}
        title={title}
        width="100%"
        height="auto"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="border-0 aspect-video rounded-xl"
      />
  )
}
