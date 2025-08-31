"use client";

import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { VoteIcon } from "../icons/vote-icon";
import { useState, useEffect } from "react";
import { useFlowAuth } from "@/hooks/use-flow-auth";
import { useFlowTransaction } from "@/hooks/use-flow-transaction";
import { useFlowBalance } from "@/hooks/use-flow-balance";
import VoteConfirmation from "@/components/ui/vote-confirmation";

type Props = {
  postId: number;
  upvotes: number;
  downvotes: number;
  comments: number;
  onVoteSuccess?: (voteType: "up" | "down") => void;
};

const VOTE_COST = "0.001"; // Cost in FLOW tokens per vote

export default function PostActions({
  postId,
  upvotes,
  downvotes,
  comments,
  onVoteSuccess,
}: Props) {
  const { isLoggedIn, address } = useFlowAuth();
  const { executeTransaction, isLoading, status } = useFlowTransaction();
  const { hasEnoughForVote, refetch: refetchBalance } = useFlowBalance();
  const [userVote, setUserVote] = useState<boolean | null>(null);
  const [localVotes, setLocalVotes] = useState({ upvotes, downvotes });
  const [votePending, setVotePending] = useState<"up" | "down" | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingVoteType, setPendingVoteType] = useState<boolean | null>(null);

  // Update local votes when props change
  useEffect(() => {
    setLocalVotes({ upvotes, downvotes });
  }, [upvotes, downvotes]);

  const handleVoteClick = (isUpvote: boolean) => {
    if (!isLoggedIn || !address) {
      alert("Please connect your wallet to vote!");
      return;
    }

    setPendingVoteType(isUpvote);
    setShowConfirmation(true);
  };

  const handleConfirmVote = async () => {
    if (pendingVoteType === null) return;

    setShowConfirmation(false);
    await handleVote(pendingVoteType);
  };

  const handleVote = async (isUpvote: boolean) => {
    const voteType = isUpvote ? "up" : "down";
    setVotePending(voteType);

    try {
      await executeTransaction(
        `
          import FlowToken from 0x7e60df042a9c0868
          import FungibleToken from 0x9a0766d93b6608b7

          transaction(postId: UInt64, isUpvote: Bool, voteCost: UFix64) {
            let paymentVault: @FlowToken.Vault
            let signer: &Account

            prepare(account: auth(Storage, BorrowValue) &Account) {
              self.signer = account
              
              // Withdraw FLOW tokens for the vote
              let vaultRef = account.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
                ?? panic("Could not borrow reference to the owner's vault")
              
              self.paymentVault <- vaultRef.withdraw(amount: voteCost) as! @FlowToken.Vault
              
              let voteType = isUpvote ? "upvote" : "downvote"
              log("User ".concat(account.address.toString())
                  .concat(" paying ").concat(voteCost.toString())
                  .concat(" FLOW to ").concat(voteType)
                  .concat(" post ").concat(postId.toString()))
            }

            execute {
              // In a real implementation, this would interact with your contract
              // For now, we'll just burn the tokens as payment
              destroy self.paymentVault
              
              let voteType = isUpvote ? "upvote" : "downvote"
              log("Vote payment successful: ".concat(voteCost.toString())
                  .concat(" FLOW paid for ").concat(voteType)
                  .concat(" on post ").concat(postId.toString()))
            }
          }
        `,
        (arg: any, t: any) => [
          arg(postId.toString(), t.UInt64),
          arg(isUpvote, t.Bool),
          arg(VOTE_COST, t.UFix64),
        ],
        {
          onSuccess: (txId) => {
            console.log(
              `Vote transaction submitted: ${txId} - Cost: ${VOTE_COST} FLOW`
            );
            setUserVote(isUpvote);

            // Optimistically update the vote count
            setLocalVotes((prev) => ({
              ...prev,
              [isUpvote ? "upvotes" : "downvotes"]:
                prev[isUpvote ? "upvotes" : "downvotes"] + 1,
            }));
          },
          onError: (error) => {
            console.error("Vote failed:", error);
            setVotePending(null);

            // Show user-friendly error messages
            if (error.includes("insufficient balance")) {
              alert(
                `Insufficient FLOW balance. You need at least ${VOTE_COST} FLOW to vote.`
              );
            } else if (error.includes("Could not borrow reference")) {
              alert(
                "Vault access error. Please ensure your wallet is properly set up."
              );
            } else {
              alert(`Vote failed: ${error}`);
            }
          },
          onStatusUpdate: (txStatus) => {
            if (txStatus.status === 4) {
              // Transaction sealed successfully
              setVotePending(null);
              refetchBalance(); // Refresh balance after successful vote
              if (onVoteSuccess) {
                onVoteSuccess(voteType);
              }
              console.log(
                `Vote payment of ${VOTE_COST} FLOW completed successfully!`
              );
            }
          },
        }
      );
    } catch (error) {
      console.error("Error voting:", error);
      setVotePending(null);
    }
  };

  const handleUpvote = () => handleVoteClick(true);
  const handleDownvote = () => handleVoteClick(false);

  const isVoteLoading = isLoading || votePending !== null;

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <button
            disabled={isVoteLoading}
            onClick={handleUpvote}
            className={`h-12 w-12 rounded-full grid place-items-center shadow-sm transition-colors ${
              userVote === true
                ? "bg-[#2563eb] text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            } ${isVoteLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label="Upvote"
            title={
              isLoggedIn
                ? `Upvote (${VOTE_COST} FLOW)`
                : "Connect wallet to vote"
            }
          >
            {votePending === "up" ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white"></div>
            ) : (
              <VoteIcon type="up" active={userVote === true} size={28} />
            )}
          </button>
          <button
            disabled={isVoteLoading}
            onClick={handleDownvote}
            className={`h-12 w-12 rounded-full grid place-items-center shadow-sm transition-colors ${
              userVote === false
                ? "bg-red-500 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            } ${isVoteLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label="Downvote"
            title={
              isLoggedIn
                ? `Downvote (${VOTE_COST} FLOW)`
                : "Connect wallet to vote"
            }
          >
            {votePending === "down" ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white"></div>
            ) : (
              <VoteIcon type="down" active={userVote === false} size={28} />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 text-white/80">
          <span className="text-sm font-medium">{localVotes.upvotes}</span>
          <span className="text-xs opacity-70">↑</span>
        </div>

        <div className="flex items-center gap-2 text-white/60">
          <span className="text-sm font-medium">{localVotes.downvotes}</span>
          <span className="text-xs opacity-70">↓</span>
        </div>

        {isVoteLoading && (
          <div className="flex items-center gap-1 text-white/60 text-xs">
            <div className="animate-spin rounded-full h-3 w-3 border border-white/30 border-t-white/80"></div>
            <span>{status?.statusString || "Processing payment..."}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-white/70 ml-auto">
          <MessageCircle size={20} />
          <span className="text-sm">{comments}</span>
        </div>

        <button
          className="text-white/60 hover:text-white rounded-full h-10 w-10 grid place-items-center"
          aria-label="More"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      <VoteConfirmation
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setPendingVoteType(null);
        }}
        onConfirm={handleConfirmVote}
        voteType={pendingVoteType === true ? "up" : "down"}
        postId={postId}
        voteCost={VOTE_COST}
        isLoading={isVoteLoading}
      />
    </>
  );
}
