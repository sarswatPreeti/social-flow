import { NextResponse } from "next/server"
import { apiClient } from "@/lib/api-client"
import { castVoteOnchain } from "@/lib/flow/onchain-vote"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { direction, amountFLOW = 0.01, voter = "0x0" } = await req.json()
  
  try {
    // Cast vote on blockchain
    const tx = await castVoteOnchain({
      postId: params.id,
      direction,
      amountFLOW,
      voter,
    })
    
    // Update vote in database
    const response = await apiClient.votePost(params.id, voter, direction)
    
    if (response.error) {
      return NextResponse.json({ error: response.error }, { status: 500 })
    }
    
    return NextResponse.json({ 
      tx, 
      post: response.data?.post 
    })
  } catch (error) {
    console.error('Error processing vote:', error)
    return NextResponse.json({ 
      error: 'Failed to process vote' 
    }, { status: 500 })
  }
}
