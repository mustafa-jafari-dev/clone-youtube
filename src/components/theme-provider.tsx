"use client"

import * as React from "react"

type Theme = "dark" | "light" | "system"

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: "dark" | "light"
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

/* ─── Helpers ─── */

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem("theme")
    if (stored === "dark" || stored === "light" || stored === "system") {
      return stored as Theme
    }
  } catch {}
  return null
}

function applyTheme(resolved: "dark" | "light") {
  const root = document.documentElement
  root.classList.remove("light", "dark")
  root.classList.add(resolved)
}

/* ─── Subscriptions (React 19‑friendly) ─── */

function useSystemTheme(): "dark" | "light" {
  const subscribe = React.useCallback((onChange: () => void) => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const getSnapshot = React.useCallback(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  }, [])

  const getServerSnapshot = React.useCallback((): "dark" | "light" => "light", [])

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/* ─── Provider ─── */

export function ThemeProvider({
  children,
  defaultTheme = "system",
  disableTransitionOnChange = false,
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  disableTransitionOnChange?: boolean
}) {
  const [theme, setThemeState] = React.useState<Theme>(
    () => getStoredTheme() ?? defaultTheme,
  )
  const systemTheme = useSystemTheme()

  // Derive resolved theme – no extra state needed
  const resolvedTheme: "dark" | "light" =
    theme === "system" ? systemTheme : theme

  // Sync DOM class and localStorage whenever resolved theme changes
  React.useEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  // Persist the raw preference
  React.useEffect(() => {
    try {
      localStorage.setItem("theme", theme)
    } catch {}
  }, [theme])

  // Disable CSS transitions during the very first paint to avoid flash
  React.useEffect(() => {
    if (!disableTransitionOnChange) return
    const css = document.createElement("style")
    css.appendChild(
      document.createTextNode(
        "*,*::before,*::after{transition:none!important}",
      ),
    )
    document.head.appendChild(css)
    setTimeout(() => document.head.removeChild(css), 0)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
  }, [])

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  )

  return (
    <ThemeContext.Provider value={value}>
      <ThemeHotkey />
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

/* ─── Hotkey: press D to toggle dark/light ─── */

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key?.toLowerCase() !== "d") return
      if (isTypingTarget(event.target)) return

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [resolvedTheme, setTheme])

  return null
}
