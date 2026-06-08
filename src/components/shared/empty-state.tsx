import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  message?: string
}

export function EmptyState({
  icon: Icon,
  title,
  message,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
      {Icon && <Icon className="size-12" aria-hidden />}
      <p className="text-lg font-medium">{title}</p>
      {message && <p className="text-sm">{message}</p>}
    </div>
  )
}
