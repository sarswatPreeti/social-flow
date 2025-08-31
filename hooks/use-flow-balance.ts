"use client";

import { useFlowAuth } from "@/hooks/use-flow-auth";
import { useEffect, useState } from "react";
import { fcl } from "@/lib/flow/fcl-client";

export function useFlowBalance() {
  const { address, isLoggedIn } = useFlowAuth();
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (!address || !isLoggedIn) {
      setBalance(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const balanceResult = await fcl.query({
        cadence: `
          import FlowToken from 0x7e60df042a9c0868
          import FungibleToken from 0x9a0766d93b6608b7

          access(all) fun main(account: Address): UFix64 {
            let vaultRef = getAccount(account)
              .capabilities.borrow<&FlowToken.Vault>(/public/flowTokenBalance)
              ?? panic("Could not borrow Balance reference to the Vault")

            return vaultRef.balance
          }
        `,
        args: (arg: any, t: any) => [arg(address, t.Address)],
      });

      setBalance(balanceResult);
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch balance");
      setBalance("0.0");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [address, isLoggedIn]);

  const refetch = () => {
    fetchBalance();
  };

  const hasEnoughForVote = (votePrice: string = "0.001"): boolean => {
    if (!balance) return false;
    return parseFloat(balance) >= parseFloat(votePrice);
  };

  return {
    balance,
    loading,
    error,
    refetch,
    hasEnoughForVote,
    balanceNumber: balance ? parseFloat(balance) : 0,
  };
}
