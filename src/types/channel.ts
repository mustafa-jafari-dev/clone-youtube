export interface Channel {
  id: string
  name: string
  handle: string
  avatarUrl: string
  bannerUrl?: string
  description: string
  subscribers: number
  videoCount: number
  joinedAt: string
}
