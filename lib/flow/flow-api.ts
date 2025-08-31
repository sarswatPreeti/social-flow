"use client";

import { fcl } from "@/lib/flow/fcl-client";

// Social contract interactions
export const flowSocial = {
  // Query all posts
  async getAllPosts() {
    try {
      const posts = await fcl.query({
        cadence: `
          // Get All Posts Script
          access(all) fun main(): [String] {
            // Temporary mock data until contract is deployed
            return ["Mock post 1", "Mock post 2"]
          }
        `,
      });
      return posts;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  },

  // Query posts by user
  async getPostsByUser(userAddress: string) {
    try {
      const posts = await fcl.query({
        cadence: `
          access(all) fun main(author: Address): [String] {
            // Temporary mock data until contract is deployed
            return ["Mock user post 1", "Mock user post 2"]
          }
        `,
        args: (arg: any, t: any) => [arg(userAddress, t.Address)],
      });
      return posts;
    } catch (error) {
      console.error("Error fetching user posts:", error);
      return [];
    }
  },

  // Create a new post
  async createPost(content: string, authorizer: any) {
    try {
      const transactionId = await fcl.mutate({
        cadence: `
          transaction(content: String) {
            prepare(signer: &Account) {
              log("Creating post with content: ".concat(content))
            }
            
            execute {
              log("Post created successfully")
            }
          }
        `,
        args: (arg: any, t: any) => [arg(content, t.String)],
        proposer: authorizer,
        authorizations: [authorizer],
        payer: authorizer,
      });

      return transactionId;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  // Vote on a post
  async voteOnPost(postId: number, isUpvote: boolean, authorizer: any) {
    try {
      const transactionId = await fcl.mutate({
        cadence: `
          transaction(postId: UInt64, isUpvote: Bool) {
            prepare(signer: &Account) {
              let voteType = isUpvote ? "upvote" : "downvote"
              log("Voting ".concat(voteType).concat(" on post ").concat(postId.toString()))
            }
            
            execute {
              log("Vote recorded successfully")
            }
          }
        `,
        args: (arg: any, t: any) => [
          arg(postId.toString(), t.UInt64),
          arg(isUpvote, t.Bool),
        ],
        proposer: authorizer,
        authorizations: [authorizer],
        payer: authorizer,
      });

      return transactionId;
    } catch (error) {
      console.error("Error voting on post:", error);
      throw error;
    }
  },

  // Add comment to a post
  async addComment(postId: number, content: string, authorizer: any) {
    try {
      const transactionId = await fcl.mutate({
        cadence: `
          transaction(postId: UInt64, content: String) {
            prepare(signer: &Account) {
              log("Adding comment to post ".concat(postId.toString()).concat(": ").concat(content))
            }
            
            execute {
              log("Comment added successfully")
            }
          }
        `,
        args: (arg: any, t: any) => [
          arg(postId.toString(), t.UInt64),
          arg(content, t.String),
        ],
        proposer: authorizer,
        authorizations: [authorizer],
        payer: authorizer,
      });

      return transactionId;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },

  // Get transaction status
  async getTransactionStatus(transactionId: string) {
    try {
      return await fcl.tx(transactionId).onceSealed();
    } catch (error) {
      console.error("Error getting transaction status:", error);
      throw error;
    }
  },
};

// Flow account utilities
export const flowAccount = {
  // Get account info
  async getAccount(address: string) {
    try {
      return await fcl.account(address);
    } catch (error) {
      console.error("Error fetching account:", error);
      return null;
    }
  },

  // Get Flow balance
  async getFlowBalance(address: string) {
    try {
      const balance = await fcl.query({
        cadence: `
          import FlowToken from 0x7e60df042a9c0868
          import FungibleToken from 0x9a0766d93b6608b7
          
          access(all) fun main(account: Address): UFix64 {
            let vaultRef = getAccount(account)
              .capabilities.get<&FlowToken.Vault>(/public/flowTokenBalance)
              .borrow()
              ?? panic("Could not borrow Balance reference to the Vault")
              
            return vaultRef.balance
          }
        `,
        args: (arg: any, t: any) => [arg(address, t.Address)],
      });

      return balance;
    } catch (error) {
      console.error("Error fetching Flow balance:", error);
      return "0.0";
    }
  },
};
