"use client";

import { useFlowAuth } from "@/hooks/use-flow-auth";
import { useFlowBalance } from "@/hooks/use-flow-balance";

export default function WalletStatus() {
  const { user, address, isLoggedIn, loading } = useFlowAuth();
  const {
    balance,
    loading: balanceLoading,
    error: balanceError,
    hasEnoughForVote,
  } = useFlowBalance();

  if (loading) {
    return (
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="text-white/60">Loading wallet status...</div>
      </div>
    );
  }

  if (!isLoggedIn || !address) {
    return (
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="text-white/60">Wallet not connected</div>
        <div className="text-xs text-white/40 mt-1">
          Connect your Flow wallet to see account details
        </div>
      </div>
    );
  }

  const votingStatus = hasEnoughForVote()
    ? "✓ Ready to vote"
    : "⚠ Insufficient balance for voting";
  const votingStatusColor = hasEnoughForVote()
    ? "text-green-400"
    : "text-yellow-400";

  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <div className="text-white font-medium mb-2">Wallet Connected</div>
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-white/60">Address: </span>
          <span className="text-white font-mono text-xs">{address}</span>
        </div>
        <div>
          <span className="text-white/60">Network: </span>
          <span className="text-white">Flow Testnet</span>
        </div>
        <div>
          <span className="text-white/60">Balance: </span>
          <span className="text-white">
            {balanceLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : balanceError ? (
              <span className="text-red-400">Error</span>
            ) : (
              `${parseFloat(balance || "0").toFixed(4)} FLOW`
            )}
          </span>
        </div>
        <div>
          <span className="text-white/60">Vote Cost: </span>
          <span className="text-white">0.001 FLOW per vote</span>
        </div>
        {user?.profile?.name && (
          <div>
            <span className="text-white/60">Profile: </span>
            <span className="text-white">{user.profile.name}</span>
          </div>
        )}
      </div>
      <div className={`mt-3 text-xs ${votingStatusColor}`}>{votingStatus}</div>
      {!hasEnoughForVote() && (
        <div className="mt-2 text-xs text-white/40">
          Get testnet FLOW from the{" "}
          <a
            href="https://testnet-faucet.onflow.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Flow Faucet
          </a>
        </div>
      )}
    </div>
  );
}
