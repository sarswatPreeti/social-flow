"use client";

import { useEffect, useState, useCallback } from "react";
import { initFlow, fcl } from "@/lib/flow/fcl-client";

type FlowUser = {
  addr?: string | null;
  loggedIn?: boolean | null;
  profile?: { name?: string; avatar?: string };
  services?: any[];
};

export function useFlowAuth() {
  const [user, setUser] = useState<FlowUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Flow configuration
    initFlow();

    let unsubscribe: (() => void) | undefined;

    // Subscribe to current user changes
    const setupSubscription = async () => {
      try {
        unsubscribe = fcl.currentUser().subscribe((currentUser: any) => {
          console.log("FCL Current User:", currentUser);
          setUser(currentUser);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error setting up FCL subscription:", error);
        setLoading(false);
      }
    };

    setupSubscription();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const connect = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Attempting to authenticate with FCL...");
      await fcl.authenticate();
    } catch (error) {
      console.error("Error during authentication:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Attempting to unauthenticate with FCL...");
      await fcl.unauthenticate();
    } catch (error) {
      console.error("Error during unauthentication:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    address: user?.addr ?? null,
    loading,
    connect,
    disconnect,
    isLoggedIn: user?.loggedIn ?? false,
  };
}

export function shortAddr(addr?: string | null) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
