import { NextResponse } from "next/server"
import { addPost, getAllPosts } from "./db"
import type { Post } from "@/types/social"

export async function GET() {
  return NextResponse.json({ posts: getAllPosts() })
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Post>
  const id = "p_" + Math.random().toString(36).slice(2)
  const post: Post = {
    id,
    author: body.author!,
    createdAt: new Date().toISOString(),
    text: body.text,
    media: body.media || [],
    upvotes: 0,
    downvotes: 0,
    comments: 0,
    following: false,
  }
  addPost(post)
  return NextResponse.json({ post })
}
