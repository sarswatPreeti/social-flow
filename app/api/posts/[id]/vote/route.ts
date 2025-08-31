import { NextResponse } from "next/server"
import { vote } from "@/app/api/posts/db"
import { castVoteOnchain } from "@/lib/flow/onchain-vote"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { direction, amountFLOW = 0.01, voter = "0x0" } = await req.json()
  const tx = await castVoteOnchain({
    postId: params.id,
    direction,
    amountFLOW,
    voter,
  })
  const updated = vote(params.id, direction)
  return NextResponse.json({ tx, post: updated })
}
