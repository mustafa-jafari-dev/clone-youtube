import Dexie, { type EntityTable } from "dexie"

export interface LocalComment {
  id: string
  videoId: string
  content: string
  userId: string
  userName: string
  userAvatarUrl: string
  likes: number
  repliesCount: number
  createdAt: string
}

export interface WatchHistoryEntry {
  id: string
  userId: string
  videoId: string
  title: string
  thumbnailUrl: string
  channelName: string
  channelId: string
  duration: string
  watchedAt: string
}

export interface WatchLaterEntry {
  id: string
  userId: string
  videoId: string
  savedAt: string
}

export interface LikedVideoEntry {
  id: string
  userId: string
  videoId: string
  likedAt: string
}

const db = new Dexie("YouTubeCloneDB") as Dexie & {
  comments: EntityTable<LocalComment, "id">
  watchHistory: EntityTable<WatchHistoryEntry, "id">
  watchLater: EntityTable<WatchLaterEntry, "id">
  likedVideos: EntityTable<LikedVideoEntry, "id">
}

db.version(2).stores({
  comments: "id, videoId, createdAt",
  watchHistory: "id, userId, videoId, watchedAt",
  watchLater: "id, userId, videoId, savedAt",
  likedVideos: "id, userId, videoId, likedAt",
})

export { db }
