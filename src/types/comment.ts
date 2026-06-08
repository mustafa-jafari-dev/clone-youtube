export interface Comment {
  id: string
  content: string
  userId: string
  videoId: string
  likes: number
  repliesCount: number
  createdAt: string
  user: {
    name: string
    avatarUrl: string
  }
}
