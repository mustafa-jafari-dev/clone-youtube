export const SIDEBAR_WIDTH = 240
export const SIDEBAR_WIDTH_COLLAPSED = 64
export const HEADER_HEIGHT = 56

export const CATEGORY_IDS = {
  ALL: "all",
  MUSIC: "music",
  GAMING: "gaming",
  NEWS: "news",
  SPORTS: "sports",
  EDUCATION: "education",
  TECHNOLOGY: "technology",
  ENTERTAINMENT: "entertainment",
} as const

export const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "Home" },
  { id: "trending", label: "Trending", icon: "Flame" },
  { id: "subscriptions", label: "Subscriptions", icon: "Folders" },
  { id: "library", label: "Library", icon: "Library" },
] as const
