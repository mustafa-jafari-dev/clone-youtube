import { AlertCircle } from "lucide-react"

interface ErrorStateProps {
  title?: string
  message?: string
}

export function ErrorState({
  title = "Something went wrong",
  message = "Please try again.",
}: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground"
      role="alert"
    >
      <AlertCircle className="size-12" aria-hidden />
      <p className="text-lg font-medium">{title}</p>
      <p className="text-sm">{message}</p>
    </div>
  )
}
