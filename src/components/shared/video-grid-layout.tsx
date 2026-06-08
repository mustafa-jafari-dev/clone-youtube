import type { ReactNode } from "react"

interface VideoGridLayoutProps {
  children: ReactNode
}

export function VideoGridLayout({ children }: VideoGridLayoutProps) {
  return (
    <section
      className="grid grid-cols-1 gap-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label="Video feed"
    >
      {children}
    </section>
  )
}
