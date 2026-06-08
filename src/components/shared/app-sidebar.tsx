"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Flame, Folders, Library, User, History, Clock, ThumbsUp } from "lucide-react"

import { TooltipProvider } from "@/components/ui/tooltip"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const mainNavItems = [
  { id: "home", label: "Home", icon: Home, href: "/" },
  { id: "trending", label: "Trending", icon: Flame, href: "/trending" },
  { id: "subscriptions", label: "Subscriptions", icon: Folders, href: "/subscriptions" },
  { id: "library", label: "Library", icon: Library, href: "/library" },
] as const

const secondaryNavItems = [
  { id: "channel", label: "Your channel", icon: User, href: "/channel" },
  { id: "history", label: "History", icon: History, href: "/history" },
  { id: "watch-later", label: "Watch later", icon: Clock, href: "/playlist?list=WL" },
  { id: "liked", label: "Liked videos", icon: ThumbsUp, href: "/playlist?list=LL" },
] as const

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <TooltipProvider delayDuration={0}>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 px-2 py-1">
          <svg viewBox="0 0 24 24" className="size-6 shrink-0 fill-current text-red-600" aria-hidden>
            <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12z" />
          </svg>
          <span className="truncate text-base font-semibold group-data-[collapsible=icon]:hidden">
            YouTube
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <nav aria-label="Main navigation">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        </nav>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>You</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      </TooltipProvider>
    </Sidebar>
  )
}
