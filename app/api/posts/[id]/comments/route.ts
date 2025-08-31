import { NextResponse } from "next/server"
import { apiClient } from "@/lib/api-client"
import type { Comment } from "@/types/social"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const response = await apiClient.getComments(params.id)
  if (response.error) {
    return NextResponse.json({ error: response.error }, { status: 500 })
  }
  return NextResponse.json(response.data)
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = (await req.json()) as Pick<Comment, "text" | "author">
  
  if (!body.author?.address) {
    return NextResponse.json({ error: "Author address is required" }, { status: 400 })
  }
  
  if (!body.text) {
    return NextResponse.json({ error: "Comment text is required" }, { status: 400 })
  }
  
  const response = await apiClient.createComment(params.id, {
    author: body.author,
    text: body.text
  })
  
  if (response.error) {
    return NextResponse.json({ error: response.error }, { status: 500 })
  }
  
  return NextResponse.json(response.data)
}
