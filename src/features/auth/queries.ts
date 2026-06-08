import { useAuthStore } from "@/stores/auth"
import type { User } from "@/types/user"

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const login = useAuthStore((s) => s.login)
  const logout = useAuthStore((s) => s.logout)

  return { user, isLoggedIn: !!user, login, logout }
}

export function createMockUser(name: string): User {
  const id = `u-${Date.now()}`
  return {
    id,
    name,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    subscribedChannelIds: [],
  }
}
