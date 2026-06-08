import { Skeleton } from "@/components/ui/skeleton"

export function CommentSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}
