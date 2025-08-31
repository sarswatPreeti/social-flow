"use client"

import BottomNav from "@/components/nav/bottom-nav"
import { useFlowAuth, shortAddr } from "@/hooks/use-flow-auth"
import Image from "next/image"
import useSWR from "swr"
import type { Post } from "@/types/social"
import PostCard from "@/components/feed/post-card"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ProfilePage() {
  const { address } = useFlowAuth()
  const { data } = useSWR("/api/posts", fetcher)
  const posts: Post[] = (data?.posts ?? []).filter((p: Post) => !address || p.author.address === address)
  const [tab, setTab] = useState<"posts" | "votes">("posts")

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-xl px-4 pb-32">
        <header className="flex items-center gap-3 py-4">
          <button className="h-10 w-10 rounded-full bg-white/10" aria-label="Back" />
          <h1 className="text-lg font-semibold">Profile</h1>
          <div className="ml-auto h-10 w-10 rounded-full bg-white/10" />
        </header>

        <section className="rounded-[28px] bg-white text-neutral-900 px-4 py-6">
          <div className="flex items-center gap-4">
            <Image src="/generic-avatar.png" alt="Profile avatar" width={96} height={96} className="rounded-full" />
            <div>
              <h2 className="text-2xl font-bold">Your Name</h2>
              <p className="text-neutral-600">@{shortAddr(address || "0x0")}</p>
            </div>
            <button className="ml-auto h-10 w-10 rounded-full border border-neutral-200" />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 bg-neutral-100 rounded-[20px] px-4 py-3">
            <Stat label="Followers" value="894" />
            <Stat label="Following" value="542" />
            <Stat label="Since" value="3 Years" />
          </div>
        </section>

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setTab("posts")}
            className={`flex-1 h-12 rounded-[28px] border border-white/10 ${
              tab === "posts" ? "bg-white/10 text-white" : "bg-neutral-900 text-white/70"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setTab("votes")}
            className={`flex-1 h-12 rounded-[28px] ${
              tab === "votes" ? "bg-[#1E6CFF] text-white" : "bg-neutral-900 text-white/70 border border-white/10"
            }`}
          >
            Votes
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {tab === "posts" && posts.map((p) => <PostCard key={p.id} post={p} onVote={async () => {}} />)}
          {tab === "votes" && <div className="text-white/70 text-sm">Your recent votes will appear here.</div>}
        </div>
      </div>

      <BottomNav />
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  )
}
