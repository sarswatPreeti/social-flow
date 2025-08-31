"use client";
import BottomNav from "@/components/nav/bottom-nav";
import { useState } from "react";
import useSWR from "swr";
import type { Post } from "@/types/social";
import PostCard from "@/components/feed/post-card";
import { UserProfileCard } from "@/components/user-profile-card";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const { data } = useSWR("/api/posts", fetcher);
  const posts: Post[] = data?.posts ?? [];

  // Trending posts: sort by upvotes desc
  const trendingPosts = [...posts].sort((a, b) => b.upvotes - a.upvotes);

  // User profiles: filter unique authors by name/address matching query
  const userProfiles = Array.from(
    new Map(
      posts
        .filter(
          (p) =>
            p.author.name?.toLowerCase().includes(query.toLowerCase()) ||
            p.author.address.toLowerCase().includes(query.toLowerCase())
        )
        .map((p) => [p.author.address, p.author])
    ).values()
  );

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-xl px-4 pb-32">
        <header className="py-4">
          <h1 className="text-lg font-semibold">Search</h1>
        </header>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full rounded-[28px] bg-neutral-900 border border-white/10 px-4 py-4 text-white/80 mb-6 outline-none"
        />
        {query.trim() === "" ? (
          <div className="space-y-4">
            {trendingPosts.length === 0 ? (
              <div className="rounded-[28px] border border-white/10 bg-neutral-900 px-4 py-6 text-white/70">
                No trending posts found.
              </div>
            ) : (
              trendingPosts.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  onVote={async (dir) => {
                    await fetch(`/api/posts/${p.id}/vote`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ direction: dir, amountFLOW: 0.1 }),
                    });
                  }}
                />
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {userProfiles.length === 0 ? (
              <div className="rounded-[28px] border border-white/10 bg-neutral-900 px-4 py-6 text-white/70">
                No users found.
              </div>
            ) : (
              userProfiles.map((u) => (
                <UserProfileCard
                  key={u.address}
                  address={u.address}
                  name={u.name}
                  avatarUrl={u.avatarUrl}
                />
              ))
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
