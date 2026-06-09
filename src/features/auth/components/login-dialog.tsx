"use client"

import { LogIn, Loader2, User } from "lucide-react"
import { toast } from "sonner"
import { useEffect, useRef } from "react"

import { useAuth } from "@/features/auth/queries"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AuthButton() {
  const { user, isLoggedIn, isLoading, isLoginLoading, loginError, login, logout } = useAuth()
  const prevLoginError = useRef<string | null>(null)

  useEffect(() => {
    if (loginError && loginError !== prevLoginError.current) {
      prevLoginError.current = loginError
      toast.error("Sign in failed", {
        description: loginError,
      })
    }
  }, [loginError])

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon-sm" className="rounded-full" aria-label="Loading" disabled>
        <Avatar size="sm">
          <AvatarFallback>
            <User className="size-4" />
          </AvatarFallback>
        </Avatar>
      </Button>
    )
  }

  if (isLoggedIn && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="rounded-full" aria-label="Your account">
            <Avatar size="sm">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex items-center gap-2">
              <Avatar size="sm">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogIn className="mr-2 size-4 rotate-180" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const isDemoProvider = process.env.NEXT_PUBLIC_AUTH_PROVIDER === "demo"

  if (isDemoProvider) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="rounded-full" aria-label="Sign in">
            <Avatar size="sm">
              <AvatarFallback>
                <User className="size-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Sign in</DialogTitle>
            <DialogDescription>
              Enter your name to try the demo. No account required.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const name = formData.get("name") as string
              if (name?.trim()) login({ name: name.trim() })
            }}
          >
            <div className="flex flex-col gap-4">
              <Input
                name="name"
                placeholder="Your display name"
                defaultValue="Demo User"
                className="w-full"
              />
              <Button type="submit" disabled={isLoginLoading} className="w-full gap-2">
                {isLoginLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="size-4" />
                    Sign in as Demo
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="rounded-full" aria-label="Sign in">
          <Avatar size="sm">
            <AvatarFallback>
              <User className="size-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Sign in</DialogTitle>
          <DialogDescription>
            Continue with Google to post comments and get personalized recommendations.
          </DialogDescription>
        </DialogHeader>
        <Button onClick={() => login()} disabled={isLoginLoading} className="w-full gap-2">
          {isLoginLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="size-4" />
              Sign in with Google
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
