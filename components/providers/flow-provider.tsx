"use client";

import { createContext, useContext, useEffect } from "react";
import { initFlow } from "@/lib/flow/fcl-client";

const FlowContext = createContext<{}>({});

export function FlowProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Flow configuration when the app starts
    initFlow();
  }, []);

  return <FlowContext.Provider value={{}}>{children}</FlowContext.Provider>;
}

export const useFlow = () => useContext(FlowContext);
