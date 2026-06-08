"use client"

import { useCategories } from "@/features/home/queries"
import { useUiStore } from "@/stores/ui"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function CategoryFilterBar() {
  const { data: categories, isLoading } = useCategories()
  const activeCategory = useUiStore((s) => s.activeCategory)
  const setActiveCategory = useUiStore((s) => s.setActiveCategory)

  return (
    <div className="sticky top-14 z-20 border-b bg-background">
      <div className="flex gap-2 overflow-x-auto px-4 py-2 [&::-webkit-scrollbar]:hidden flex-wrap">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 shrink-0 rounded-full" />
            ))
          : categories?.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "secondary"}
                size="sm"
                className={cn(
                  "shrink-0 rounded-full px-3 text-sm",
                  activeCategory === category.id && "bg-foreground text-background hover:bg-foreground/90",
                )}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
      </div>
    </div>
  )
}
