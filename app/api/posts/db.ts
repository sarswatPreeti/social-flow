import type { Post, Comment } from "@/types/social"

let POSTS: Post[] = [
  {
    id: "p1",
    author: { address: "0xabc12345", name: "Boby matter", avatarUrl: "/diverse-avatars.png" },
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
    text: "Which car do you prefered?",
    media: [
      { type: "image", url: "/car-option-1.png" },
      { type: "image", url: "/car-option-2.png" },
    ],
    upvotes: 2100,
    downvotes: 120,
    comments: 32,
    following: false,
  },
  {
    id: "p2",
    author: { address: "0xdef67890", name: "Ola Dealova", avatarUrl: "/avatar-b.png" },
    createdAt: new Date(Date.now() - 5 * 60_000).toISOString(),
    text: "How do you define UX with an example?",
    media: [],
    upvotes: 1200,
    downvotes: 40,
    comments: 18,
    following: true,
  },
]

const COMMENTS: Comment[] = []

export function getAllPosts() {
  return POSTS
}

export function addPost(p: Post) {
  POSTS = [p, ...POSTS]
  return p
}

export function vote(postId: string, dir: "up" | "down") {
  const p = POSTS.find((x) => x.id === postId)
  if (!p) return null
  if (dir === "up") p.upvotes += 1
  else p.downvotes += 1
  return p
}

export function addComment(c: Comment) {
  COMMENTS.push(c)
  const p = POSTS.find((x) => x.id === c.postId)
  if (p) p.comments += 1
  return c
}

export function getComments(postId: string) {
  return COMMENTS.filter((c) => c.postId === postId)
}
