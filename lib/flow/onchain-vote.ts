"use server"

export const USE_MOCK_ONCHAIN = true

export async function castVoteOnchain(params: {
  postId: string
  direction: "up" | "down"
  amountFLOW: number
  voter: string
}) {
  if (USE_MOCK_ONCHAIN) {
    await new Promise((r) => setTimeout(r, 450))
    return { txId: "MOCK_TX_" + Math.random().toString(36).slice(2) }
  }

  // Skeleton for future Cadence + FCL integration.
  // throw new Error("On-chain voting not implemented")
  return { txId: "UNIMPLEMENTED" }
}
