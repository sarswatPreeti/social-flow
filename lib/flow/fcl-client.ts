"use client";

import * as fcl from "@onflow/fcl";

let configured = false;

export function initFlow() {
  if (configured) return;

  const network = process.env.NEXT_PUBLIC_FLOW_NETWORK || "testnet";
  const accessNodeUrl =
    process.env.NEXT_PUBLIC_ACCESS_NODE_URL ||
    "https://rest-testnet.onflow.org";
  const discoveryWallet =
    process.env.NEXT_PUBLIC_DISCOVERY_WALLET ||
    "https://fcl-discovery.onflow.org/testnet/authn";
  const appTitle = process.env.NEXT_PUBLIC_APP_TITLE || "Flow Social DApp";
  const walletConnectProjectId =
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
    "your-walletconnect-project-id";

  fcl
    .config()
    .put("app.detail.title", appTitle)
    .put("app.detail.icon", "https://placekitten.com/210/210")
    .put("flow.network", network)
    .put("accessNode.api", accessNodeUrl)
    .put("discovery.wallet", discoveryWallet)
    .put("discovery.authn.endpoint", discoveryWallet)
    .put("walletconnect.projectId", walletConnectProjectId)
    // Testnet contract addresses
    .put("0xFungibleToken", "0x9a0766d93b6608b7")
    .put("0xFlowToken", "0x7e60df042a9c0868")
    .put("0xNonFungibleToken", "0x631e88ae7f1d7c20")
    .put("0xMetadataViews", "0x631e88ae7f1d7c20")
    // Enable FCL dev tools in development
    .put("fcl.limit", 9999);

  configured = true;
}

export { fcl };
