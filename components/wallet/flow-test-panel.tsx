"use client";

import { useState } from "react";
import { useFlowAuth } from "@/hooks/use-flow-auth";
import { useFlowTransaction } from "@/hooks/use-flow-transaction";
import { Button } from "@/components/ui/button";

export default function FlowTestPanel() {
  const { isLoggedIn, address } = useFlowAuth();
  const { executeTransaction, isLoading, status, error } = useFlowTransaction();
  const [testResult, setTestResult] = useState<string>("");

  const runConnectionTest = async () => {
    if (!isLoggedIn) {
      setTestResult("❌ Please connect your wallet first");
      return;
    }

    setTestResult("🔄 Testing Flow connection...");

    try {
      const txId = await executeTransaction(
        `
          transaction {
            prepare(signer: &Account) {
              log("Flow connection test successful!")
              log("Signer address: ".concat(signer.address.toString()))
            }
            
            execute {
              log("Test transaction completed successfully")
            }
          }
        `,
        () => [],
        {
          onSuccess: (txId) => {
            setTestResult(
              `✅ Connection test successful! TxID: ${txId.slice(0, 16)}...`
            );
          },
          onError: (error) => {
            setTestResult(`❌ Connection test failed: ${error}`);
          },
          onStatusUpdate: (txStatus) => {
            if (txStatus.status === 4) {
              setTestResult(`🎉 Test transaction sealed successfully!`);
            }
          },
        }
      );
    } catch (err) {
      setTestResult(
        `❌ Test failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-lg p-4">
        <div className="text-yellow-400 font-medium mb-2">
          Flow Connection Test
        </div>
        <div className="text-yellow-300/80 text-sm mb-3">
          Connect your wallet to test the Flow blockchain connection
        </div>
        <Button disabled className="text-sm">
          Connect Wallet First
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <div className="text-white font-medium mb-2">Flow Connection Test</div>
      <div className="text-white/60 text-sm mb-3">
        Test your connection to the Flow testnet blockchain
      </div>

      <div className="space-y-3">
        <Button
          onClick={runConnectionTest}
          disabled={isLoading}
          className="w-full"
          variant="outline"
        >
          {isLoading ? "Running Test..." : "Test Flow Connection"}
        </Button>

        {testResult && (
          <div className="text-sm p-3 bg-black/20 rounded border border-white/10">
            {testResult}
          </div>
        )}

        {isLoading && status && (
          <div className="text-xs text-blue-400 flex items-center gap-2">
            <div className="animate-spin rounded-full h-3 w-3 border border-blue-300 border-t-blue-600"></div>
            Status: {status.statusString}
          </div>
        )}

        {error && (
          <div className="text-xs text-red-400 p-2 bg-red-500/10 rounded border border-red-500/20">
            Error: {error}
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-white/40">Connected to: {address}</div>
    </div>
  );
}
