"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTheme } from "next-themes"
import { Menu, Search, Bell, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useSidebar } from "@/components/ui/sidebar"
import Link from "next/link"

const searchSchema = z.object({
  q: z.string().min(1, "Enter a search term"),
})

type SearchFormData = z.infer<typeof searchSchema>

export function Header() {
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const { toggleSidebar, setOpenMobile } = useSidebar()

  const { register, handleSubmit } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
  })

  function onSubmit(data: SearchFormData) {
    router.push(`/search?q=${encodeURIComponent(data.q)}`)
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="hidden md:inline-flex"
        aria-label="Toggle sidebar"
      >
        <Menu />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpenMobile(true)}
        className="md:hidden"
        aria-label="Open sidebar"
      >
        <Menu />
      </Button>

      <Link
        href="/"
        className="flex items-center gap-1 font-heading text-xl font-bold tracking-tight shrink-0"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-6 fill-current text-red-600"
          aria-hidden
        >
          <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12z" />
        </svg>
        <span className="hidden sm:inline">YouTube</span>
      </Link>

      <div className="flex flex-1 items-center justify-center px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full max-w-[600px] items-center"
        >
          <div className="relative flex-1">
            <Input
              {...register("q")}
              placeholder="Search"
              className="rounded-r-none border-r-0"
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            size="icon"
            className="rounded-l-none border-border"
            aria-label="Search"
          >
            <Search />
          </Button>
        </form>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Toggle dark mode"
        >
          {resolvedTheme === "dark" ? <Sun /> : <Moon />}
        </Button>

        <Button variant="ghost" size="icon-sm" aria-label="Notifications">
          <Bell />
        </Button>

        <Avatar size="sm">
          <AvatarImage
            src="https://api.dicebear.com/9.x/avataaars/svg?seed=you"
            alt="Your avatar"
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
