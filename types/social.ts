export type MediaType = "image" | "video" | "gif"

export type Post = {
  id: string
  author: { address: string; name?: string; avatarUrl?: string }
  createdAt: string
  text?: string
  media?: { type: MediaType; url: string }[]
  upvotes: number
  downvotes: number
  comments: number
  following: boolean
}

export type Comment = {
  id: string
  postId: string
  author: { address: string; name?: string; avatarUrl?: string }
  text: string
  createdAt: string
  likes: number
}
