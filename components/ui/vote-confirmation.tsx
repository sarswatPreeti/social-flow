"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFlowBalance } from "@/hooks/use-flow-balance";

interface VoteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  voteType: "up" | "down";
  postId: number;
  voteCost: string;
  isLoading?: boolean;
}

export default function VoteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  voteType,
  postId,
  voteCost,
  isLoading = false,
}: VoteConfirmationProps) {
  const { balance, hasEnoughForVote } = useFlowBalance();
  const canAfford = hasEnoughForVote(voteCost);
  const balanceAfterVote = balance
    ? (parseFloat(balance) - parseFloat(voteCost)).toFixed(4)
    : "0";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">
            Confirm {voteType === "up" ? "Upvote" : "Downvote"}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            You're about to {voteType === "up" ? "upvote" : "downvote"} post #
            {postId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Current Balance:</span>
              <span className="text-white font-mono">
                {balance
                  ? `${parseFloat(balance).toFixed(4)} FLOW`
                  : "Loading..."}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-white/70">Vote Cost:</span>
              <span className="text-white font-mono">-{voteCost} FLOW</span>
            </div>

            <div className="border-t border-white/10 pt-3">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-white/70">Balance After Vote:</span>
                <span
                  className={`font-mono ${
                    canAfford ? "text-white" : "text-red-400"
                  }`}
                >
                  {balanceAfterVote} FLOW
                </span>
              </div>
            </div>
          </div>

          {!canAfford && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="text-red-400 font-medium mb-1">
                Insufficient Balance
              </div>
              <div className="text-red-300/80 text-sm">
                You need at least {voteCost} FLOW to vote. Get testnet FLOW from
                the{" "}
                <a
                  href="https://testnet-faucet.onflow.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-300 hover:text-red-200 underline"
                >
                  Flow Faucet
                </a>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={!canAfford || isLoading}
              className={`flex-1 ${
                voteType === "up"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-red-600 hover:bg-red-700"
              } text-white`}
            >
              {isLoading
                ? "Processing..."
                : `Confirm ${voteType === "up" ? "Upvote" : "Downvote"}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
