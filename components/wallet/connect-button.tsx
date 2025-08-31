"use client";

import { useFlowAuth, shortAddr } from "@/hooks/use-flow-auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function ConnectWalletButton() {
  const { address, user, connect, disconnect, loading, isLoggedIn } =
    useFlowAuth();

  if (loading) {
    return (
      <div className="h-10 w-28 rounded-full bg-neutral-800/80 animate-pulse flex items-center justify-center">
        <span className="text-white/60 text-sm">Loading...</span>
      </div>
    );
  }

  if (!isLoggedIn || !address) {
    return (
      <Button
        onClick={connect}
        className="rounded-full bg-blue-600 hover:bg-blue-700 text-white border-0 px-6 h-10 font-medium transition-colors"
        disabled={loading}
      >
        {loading ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }

  const avatar = (user as any)?.profile?.avatar || "/generic-avatar.png";

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5">
        <Image
          src={avatar || "/placeholder.svg"}
          alt="Wallet avatar"
          width={24}
          height={24}
          className="rounded-full"
        />
        <span className="text-sm text-white/90 font-medium">
          {shortAddr(address)}
        </span>
      </div>
      <Button
        onClick={disconnect}
        variant="outline"
        size="sm"
        className="rounded-full border-white/20 text-white/80 hover:bg-white/10"
      >
        Disconnect
      </Button>
    </div>
  );
}
