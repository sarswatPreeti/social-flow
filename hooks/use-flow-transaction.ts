"use client";

import { useState, useCallback } from "react";
import { fcl } from "@/lib/flow/fcl-client";

export interface TransactionStatus {
  status: number;
  statusString: string;
  errorMessage?: string;
}

export function useFlowTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [status, setStatus] = useState<TransactionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeTransaction = useCallback(
    async (
      cadence: string,
      args: (arg: any, t: any) => any[] = () => [],
      options: {
        onSuccess?: (txId: string) => void;
        onError?: (error: string) => void;
        onStatusUpdate?: (status: TransactionStatus) => void;
      } = {}
    ) => {
      setIsLoading(true);
      setError(null);
      setTransactionId(null);
      setStatus(null);

      try {
        console.log("Executing transaction with Cadence:", cadence);

        const txId = await fcl.mutate({
          cadence,
          args,
          limit: 9999,
        });

        console.log("Transaction ID:", txId);
        setTransactionId(txId);

        if (options.onSuccess) {
          options.onSuccess(txId);
        }

        // Subscribe to transaction status
        const unsubscribe = fcl.tx(txId).subscribe((txStatus: any) => {
          console.log("Transaction status update:", txStatus);

          const status: TransactionStatus = {
            status: txStatus.status,
            statusString:
              txStatus.statusString || getStatusString(txStatus.status),
            errorMessage: txStatus.errorMessage,
          };

          setStatus(status);

          if (options.onStatusUpdate) {
            options.onStatusUpdate(status);
          }

          // If transaction is sealed or errored, stop loading
          if (txStatus.status >= 4 || txStatus.status < 0) {
            setIsLoading(false);
            unsubscribe();
          }

          // Handle errors
          if (txStatus.errorMessage) {
            setError(txStatus.errorMessage);
            if (options.onError) {
              options.onError(txStatus.errorMessage);
            }
          }
        });

        return txId;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Transaction failed";
        console.error("Transaction error:", err);
        setError(errorMessage);
        setIsLoading(false);

        if (options.onError) {
          options.onError(errorMessage);
        }

        throw err;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setTransactionId(null);
    setStatus(null);
    setError(null);
  }, []);

  return {
    executeTransaction,
    isLoading,
    transactionId,
    status,
    error,
    reset,
    isSuccess: status?.status === 4,
    isPending: isLoading && status?.status !== 4,
  };
}

function getStatusString(statusCode: number): string {
  switch (statusCode) {
    case 0:
      return "Unknown";
    case 1:
      return "Pending";
    case 2:
      return "Finalized";
    case 3:
      return "Executed";
    case 4:
      return "Sealed";
    case 5:
      return "Expired";
    default:
      return statusCode < 0 ? "Error" : "Unknown";
  }
}
