import { NextResponse } from "next/server"
import { apiClient } from "@/lib/api-client"
import type { Post } from "@/types/social"

export async function GET() {
  const response = await apiClient.getAllPosts()
  if (response.error) {
    return NextResponse.json({ error: response.error }, { status: 500 })
  }
  return NextResponse.json(response.data)
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Post>
  
  if (!body.author?.address) {
    return NextResponse.json({ error: "Author address is required" }, { status: 400 })
  }
  
  const response = await apiClient.createPost({
    author: body.author,
    text: body.text,
    media: body.media || []
  })
  
  if (response.error) {
    return NextResponse.json({ error: response.error }, { status: 500 })
  }
  
  return NextResponse.json(response.data)
}
