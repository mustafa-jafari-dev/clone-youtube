"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useRef, useCallback } from "react"
import { useAuthStore } from "@/stores/auth"
import { mapSessionToUser } from "@/lib/auth"

export function useAuth() {
  const { data: session, status } = useSession()
  const user = useAuthStore((s) => s.user)
  const isLoginLoading = useAuthStore((s) => s.isLoginLoading)
  const loginError = useAuthStore((s) => s.loginError)
  const hydrate = useAuthStore((s) => s.hydrate)
  const setLoginLoading = useAuthStore((s) => s.setLoginLoading)
  const setLoginError = useAuthStore((s) => s.setLoginError)
  const logoutStore = useAuthStore((s) => s.logout)
  const lastUserId = useRef<string | null>(null)

  useEffect(() => {
    if (status === "authenticated") {
      const mapped = mapSessionToUser(session)
      if (mapped?.id !== lastUserId.current) {
        lastUserId.current = mapped?.id ?? null
        hydrate(mapped)
        setLoginLoading(false)
      }
    } else if (status === "unauthenticated") {
      if (lastUserId.current !== null) {
        lastUserId.current = null
        hydrate(null)
      }
      setLoginLoading(false)
    }
  }, [session, status, hydrate, setLoginLoading])

  const login = useCallback(async (credentials?: Record<string, unknown>) => {
    try {
      setLoginLoading(true)
      setLoginError(null)
      const provider = process.env.NEXT_PUBLIC_AUTH_PROVIDER === "demo" ? "demo" : "google"
      await signIn(provider, { ...credentials, callbackUrl: window.location.href })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Sign in failed. Please try again."
      console.error("[auth] sign-in failed:", error)
      setLoginError(message)
    }
  }, [setLoginLoading, setLoginError])

  const logout = useCallback(async () => {
    try {
      await signOut({ callbackUrl: window.location.href })
    } finally {
      logoutStore()
    }
  }, [logoutStore])

  return {
    user,
    isLoggedIn: status === "authenticated",
    isLoading: status === "loading",
    isLoginLoading,
    loginError,
    login,
    logout,
  }
}
