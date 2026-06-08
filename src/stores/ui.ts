import { create } from "zustand"

interface UiState {
  searchQuery: string
  activeCategory: string
  setSearchQuery: (query: string) => void
  setActiveCategory: (category: string) => void
}

export const useUiStore = create<UiState>((set) => ({
  searchQuery: "",
  activeCategory: "all",
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveCategory: (category) => set({ activeCategory: category }),
}))
