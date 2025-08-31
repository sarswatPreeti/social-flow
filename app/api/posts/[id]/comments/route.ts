import { NextResponse } from "next/server"
import { addComment, getComments } from "@/app/api/posts/db"
import type { Comment } from "@/types/social"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ comments: getComments(params.id) })
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = (await req.json()) as Pick<Comment, "text" | "author">
  const comment: Comment = {
    id: "c_" + Math.random().toString(36).slice(2),
    postId: params.id,
    author: body.author,
    text: body.text,
    createdAt: new Date().toISOString(),
    likes: 0,
  }
  addComment(comment)
  return NextResponse.json({ comment })
}
