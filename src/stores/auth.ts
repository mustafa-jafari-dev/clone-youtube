import { create } from "zustand"
import type { User } from "@/types/user"

interface AuthState {
  user: User | null
  isLoginLoading: boolean
  loginError: string | null
  setLoginLoading: (loading: boolean) => void
  setLoginError: (error: string | null) => void
  login: (user: User) => void
  logout: () => void
  hydrate: (user: User | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoginLoading: false,
  loginError: null,
  setLoginLoading: (loading) => set({ isLoginLoading: loading }),
  setLoginError: (error) => set({ loginError: error, isLoginLoading: false }),
  login: (user) => set({ user, isLoginLoading: false, loginError: null }),
  logout: () => set({ user: null }),
  hydrate: (user) => set({ user }),
}))
