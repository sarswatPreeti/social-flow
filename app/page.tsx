"use client";

import ConnectWalletButton from "@/components/wallet/connect-button";
import WalletStatus from "@/components/wallet/wallet-status";
import FlowTestPanel from "@/components/wallet/flow-test-panel";
import BottomNav from "@/components/nav/bottom-nav";
import CreatePost from "@/components/feed/create-post";
import PostCard from "@/components/feed/post-card";
import useSWR, { mutate } from "swr";
import type { Post } from "@/types/social";
import IconButton from "@/components/icons/icon-button";
import { useFlowAuth } from "@/hooks/use-flow-auth";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Page() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-xl px-4 pb-32">
        <HeaderBar />
        <div className="space-y-4">
          <FlowStatusSection />
          <CreatePost />
          <FeedList />
        </div>
      </div>
      <BottomNav />
    </main>
  );
}

function HeaderBar() {
  return (
    <header className="sticky top-0 z-10 bg-neutral-950/80 backdrop-blur flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 grid place-items-center rounded-full bg-blue-600 text-white font-semibold">
          F
        </div>
        <h1 className="text-lg font-semibold text-white">Flow Social</h1>
      </div>

      <div className="flex items-center gap-2">
        <IconButton ariaLabel="Create new">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </IconButton>
        <IconButton ariaLabel="Notifications">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
            <path d="M9 21h6" />
          </svg>
        </IconButton>
        <ConnectWalletButton />
      </div>
    </header>
  );
}

function FlowStatusSection() {
  const { isLoggedIn } = useFlowAuth();

  return (
    <div className="space-y-4">
      <WalletStatus />
      <FlowTestPanel />
      {!isLoggedIn && (
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
          <div className="text-blue-400 font-medium mb-1">
            Welcome to Flow Social!
          </div>
          <div className="text-blue-300/80 text-sm">
            Connect your Flow wallet to start posting and voting on the
            blockchain.
          </div>
        </div>
      )}
    </div>
  );
}

function FeedList() {
  const { data } = useSWR("/api/posts", fetcher);
  const posts: Post[] = data?.posts ?? [];

  const handleVoteSuccess = () => {
    // Refresh the posts when a vote transaction is successful
    mutate("/api/posts");
  };

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          <div className="text-lg font-medium mb-2">No posts yet</div>
          <div className="text-sm">Be the first to post something!</div>
        </div>
      ) : (
        posts.map((p) => (
          <PostCard key={p.id} post={p} onVoteSuccess={handleVoteSuccess} />
        ))
      )}
    </div>
  );
}
